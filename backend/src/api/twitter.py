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

# OAuth2 configuration
config = Config('.env')
oauth = OAuth(config)
oauth.register(
    name='twitter',
    client_id=settings.TWITTER_CLIENT_ID,
    client_secret=settings.TWITTER_CLIENT_SECRET,
    authorize_url='https://twitter.com/i/oauth2/authorize',
    authorize_params=None,
    access_token_url='https://api.x.com/2/oauth2/token',
    access_token_params=None,
    refresh_token_url=None,
    redirect_uri=settings.TWITTER_REDIRECT_URI,
    client_kwargs={'scope': 'tweet.read ysers.read follows.read follows.write offline.access'}
)

class Token(BaseModel):
    access_token: str
    token_type: str

async def get_session(request: Request):
    return request.session

@router.options("/login")
async def login_options():
    return ResponseMsg.SUCCESS.to_json(msg="Options request successful")

@router.get("/login")
async def login(request: Request, plat_id: str):
    redirect_uri = await oauth.twitter.authorize_redirect(request, settings.TWITTER_REDIRECT_URI)
    request.session['plat_id'] = plat_id
    return redirect_uri

@router.get("/callback")
async def callback(request: Request, background_tasks: BackgroundTasks, session: dict = Depends(get_session)):
    try:
        token = await oauth.twitter.authorize_access_token(request)
        session['access_token'] = token['access_token']
        
        # Create a Tweepy API object
        auth = tweepy.OAuth2BearerHandler(token['access_token'])
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

    except OAuthError as e:
        raise HTTPException(status_code=500, detail=f"Error during authentication: {str(e)}")

@router.get("/logout")
async def logout(session: dict = Depends(get_session)):
    session.clear()
    return JSONResponse({"message": "Logged out successfully"})