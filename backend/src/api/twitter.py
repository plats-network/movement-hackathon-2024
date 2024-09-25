from fastapi import APIRouter, HTTPException, Request, Depends, BackgroundTasks
from fastapi.responses import JSONResponse, RedirectResponse, Response
from starlette.config import Config
from authlib.integrations.starlette_client import OAuth, OAuthError
from pydantic import BaseModel
import tweepy
from src.config import settings
from src.services import UserService
from src.utils import ResponseMsg
from src.services import Nillion, TwitterService
import traceback
router = APIRouter()



class Token(BaseModel):
    oauth_token: str
    oauth_token_secret: str


async def get_session(request: Request):
    return request.session
            

@router.get("/login")
async def login(request: Request, plat_id: str):
    try:
        oauth = tweepy.OAuth1UserHandler(
            consumer_key=settings.TWITTER_CONSUMER_KEY,
            consumer_secret=settings.TWITTER_CONSUMER_SECRET,
            callback=settings.TWITTER_REDIRECT_URI
        )

        auth_url = oauth.get_authorization_url()
        print("Request token", oauth.request_token)
        request.session['request_token'] = oauth.request_token
        request.session['plat_id'] = plat_id   
        # set session to response
        
        # Create a JSON response object
        # response = JSONResponse(content={"msg": "success", "code": 200, "data": {"auth_url": auth_url}})
        
        # Set cookies
        # response.set_cookie(key="request_token", value=oauth.request_token, httponly=True)
        # response.set_cookie(key="plat_id", value=plat_id, httponly=True)
        # return response
        
        # Redirect
        return RedirectResponse(url=auth_url)
        
    except tweepy.TweepyException as e:
        # print traceback
        print(traceback.format_exc())
        print("Error getting authorization URL: ", str(e))
        raise HTTPException(status_code=500, detail=f"Error getting authorization URL::{str(e)}")


@router.get("/callback")
async def callback(oauth_token: str, background_tasks: BackgroundTasks, oauth_verifier: str, request: Request, session: dict = Depends(get_session) ):
    oauth = tweepy.OAuth1UserHandler(
        consumer_key=settings.TWITTER_CONSUMER_KEY,
        consumer_secret=settings.TWITTER_CONSUMER_SECRET,
        callback=settings.TWITTER_REDIRECT_URI
    )
    request_token = session.get('request_token')
    oauth.request_token = request_token
    
    if not request_token:
        raise HTTPException(status_code=400, detail="No request token")

    try:
        print("OAuth verifier", oauth_verifier)
        access_token, access_token_secret = oauth.get_access_token(oauth_verifier)
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
        
        # Save twitter score 
        score = TwitterService.get_score(user.screen_name)
        background_tasks.add_task(TwitterService.save, plat_id, user.screen_name, score)
        
        return RedirectResponse(url=settings.FRONTEND_URL)
        # return ResponseMsg.SUCCESS.to_json(data={}, msg="Authentication successful")

    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error during authentication: {str(e)}")


@router.get("/logout")
async def logout(session: dict = Depends(get_session)):
    session.clear()
    return JSONResponse({"message": "Logged out successfully"})