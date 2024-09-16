from fastapi import APIRouter, HTTPException, Request, Depends
from fastapi.responses import JSONResponse, RedirectResponse
from starlette.config import Config
from authlib.integrations.starlette_client import OAuth, OAuthError
from pydantic import BaseModel
import tweepy
from src.config import settings
from src.services import UserService
from src.utils import ResponseMsg


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

@router.get("/login")
async def login(request: Request, plat_id: str):
    try:
        auth_url = oauth1_user_handler.get_authorization_url()
        request.session['request_token'] = oauth1_user_handler.request_token
        request.session['plat_id'] = plat_id
        
        return RedirectResponse(auth_url)
    except tweepy.TweepyException as e:
        print(e)
        raise HTTPException(status_code=500, detail="Error getting authorization URL")


@router.get("/callback")
async def callback(oauth_token: str, oauth_verifier: str, request: Request, session: dict = Depends(get_session)):
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
        
        # Save screen name in session to db
        plat_id = session.get('plat_id')
        # Save user information in db temporarily
        UserService.update_user_info(plat_id, {
            "twitter": user.screen_name,
        })
        
        # TODO: Store to nillion
        
        return RedirectResponse(url=settings.FRONTEND_URL)
        # return ResponseMsg.SUCCESS.to_json(data={}, msg="Authentication successful")

    except tweepy.TweepError as e:
        raise HTTPException(status_code=500, detail=f"Error during authentication: {str(e)}")


@router.get("/logout")
async def logout(session: dict = Depends(get_session)):
    session.clear()
    return JSONResponse({"message": "Logged out successfully"})