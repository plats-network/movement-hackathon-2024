from fastapi import APIRouter, HTTPException, Request, Depends, BackgroundTasks
from fastapi.responses import JSONResponse, RedirectResponse
from starlette.config import Config
from authlib.integrations.starlette_client import OAuth, OAuthError
from pydantic import BaseModel
import tweepy
from src.config import settings
from src.services import UserService
from src.utils import ResponseMsg
from src.services import Nillion, TwitterService

router = APIRouter()

# Tweepy OAuth1UserHandler
oauth1_user_handler = tweepy.OAuth1UserHandler(
    settings.TWITTER_CONSUMER_KEY, settings.TWITTER_CONSUMER_SECRET,
    callback=settings.TWITTER_REDIRECT_URI
)

class Token(BaseModel):
    oauth_token: str
    oauth_token_secret: str


async def get_session(request: Request):
    return request.session

@router.options("/login")
async def login_options():
    return ResponseMsg.SUCCESS.to_json(msg="Options request successful")

@router.get("/login")
async def login(request: Request, plat_id: str):
    try:
        auth_url = oauth1_user_handler.get_authorization_url()
        request.session['request_token'] = oauth1_user_handler.request_token
        request.session['plat_id'] = plat_id
        
        return RedirectResponse(auth_url)
    except tweepy.TweepyException as e:
        print("Error getting authorization URL: ", str(e))
        raise HTTPException(status_code=500, detail="Error getting authorization URL")


@router.get("/callback")
async def callback(oauth_token: str, background_tasks: BackgroundTasks, oauth_verifier: str, request: Request, session: dict = Depends(get_session) ):
    request_token = session.get('request_token')
    if not request_token:
        raise HTTPException(status_code=400, detail="No request token")

    try:
        access_token, access_token_secret = oauth1_user_handler.get_access_token(oauth_verifier)
        session['access_token'] = access_token
        session['access_token_secret'] = access_token_secret
        
        # Create a Tweepy API object
        auth = tweepy.OAuth1UserHandler(
            settings.TWITTER_CONSUMER_KEY, settings.TWITTER_CONSUMER_SECRET,
            access_token, access_token_secret
        )
        api = tweepy.API(auth)
        
        # Get user information
        user = api.verify_credentials()
        
        plat_id = session.get('plat_id')
        
        # Store to nillion
        background_tasks.add_task(Nillion.store, plat_id, 'twitter', user.screen_name)
        
        # Save twitter score 
        score = TwitterService.get_score(user.screen_name)
        background_tasks.add_task(Nillion.store, plat_id, 'twitter_score', score)
        
        return RedirectResponse(url=settings.FRONTEND_URL)
        # return ResponseMsg.SUCCESS.to_json(data={}, msg="Authentication successful")

    except tweepy.TweepError as e:
        raise HTTPException(status_code=500, detail=f"Error during authentication: {str(e)}")


@router.get("/logout")
async def logout(session: dict = Depends(get_session)):
    session.clear()
    return JSONResponse({"message": "Logged out successfully"})