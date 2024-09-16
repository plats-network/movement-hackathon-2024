from fastapi import APIRouter, HTTPException, Request, Depends
from fastapi.responses import JSONResponse, RedirectResponse
from starlette.config import Config
from authlib.integrations.starlette_client import OAuth, OAuthError
from pydantic import BaseModel
import tweepy
from src.config import settings

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
async def login(request: Request):
    try:
        auth_url = oauth1_user_handler.get_authorization_url()
        request.session['request_token'] = oauth1_user_handler.request_token
        return RedirectResponse(auth_url)
    except tweepy.TweepError:
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
        
        
        return JSONResponse({
            "message": "Authentication successful",
            "user_id": user.id,
            "screen_name": user.screen_name
        })
    except tweepy.TweepError as e:
        raise HTTPException(status_code=500, detail=f"Error during authentication: {str(e)}")

@router.get("/protected")
async def protected_route(session: dict = Depends(get_session)):
    access_token = session.get('access_token')
    access_token_secret = session.get('access_token_secret')
    
    if not access_token or not access_token_secret:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    auth = tweepy.OAuth1UserHandler(
        settings.TWITTER_CONSUMER_KEY, settings.TWITTER_CONSUMER_SECRET,
        access_token, access_token_secret
    )
    api = tweepy.API(auth)
    
    try:
        user = api.verify_credentials()
        return JSONResponse({
            "message": "Access granted to protected resource",
            "user_id": user.id,
            "screen_name": user.screen_name
        })
    except tweepy.TweepError as e:
        raise HTTPException(status_code=401, detail=f"Authentication failed: {str(e)}")

@router.get("/logout")
async def logout(session: dict = Depends(get_session)):
    session.clear()
    return JSONResponse({"message": "Logged out successfully"})