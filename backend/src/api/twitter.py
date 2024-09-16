from fastapi import APIRouter, HTTPException, Request, Depends
from fastapi.responses import JSONResponse, RedirectResponse
from starlette.config import Config
from authlib.integrations.starlette_client import OAuth, OAuthError
from pydantic import BaseModel

from src.config import settings

router = APIRouter()

# Configuration
config = Config(environ={
    "TWITTER_CLIENT_ID": settings.TWITTER_CLIENT_ID,
    "TWITTER_CLIENT_SECRET": settings.TWITTER_CLIENT_SECRET,
})

# OAuth setup
oauth = OAuth(config)
oauth.register(
    name='twitter',
    client_id=settings.TWITTER_CLIENT_ID,
    client_secret=settings.TWITTER_CLIENT_SECRET,
    authorize_url='https://twitter.com/i/oauth2/authorize',
    access_token_url='https://api.twitter.com/2/oauth2/token',
    client_kwargs={
        'scope': 'tweet.read users.read offline.access',
        'token_endpoint_auth_method': 'client_secret_basic',
        'token_placement': 'header',
    },
)

# Session dependency
async def get_session(request: Request):
    return request.session

@router.get('/login')
async def login(request: Request):
    redirect_uri = request.url_for('auth_callback')
    return await oauth.twitter.authorize_redirect(request, redirect_uri)

@router.get('/callback')
async def auth_callback(request: Request, session: dict = Depends(get_session)):
    try:
        token = await oauth.twitter.authorize_access_token(request)
    except OAuthError as error:
        return JSONResponse({"error": str(error)}, status_code=400)
    
    user = await oauth.twitter.parse_id_token(request, token)
    session['user'] = dict(user)
    session['token'] = dict(token)
    return RedirectResponse(url='/protected')

@router.get('/logout')
async def logout(session: dict = Depends(get_session)):
    session.clear()
    return RedirectResponse(url='/')

@router.get('/protected')
async def protected_route(session: dict = Depends(get_session)):
    user = session.get('user')
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return JSONResponse({"message": "Access granted to protected resource", "user": user})