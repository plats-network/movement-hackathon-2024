from fastapi import APIRouter, Depends
from src.dtos import RegisterInputDTO, LoginInputDTO, VerifyRequestDTO
from src.utils import ResponseMsg
from src.services import Auth
import pydash as py_
import base64
import logging
from nacl.signing import VerifyKey
from nacl.encoding import Base64Encoder
import nacl.utils
from datetime import timedelta
from src.config import settings
from src.dtos import TokenData
from src.config.db import redis_client
router = APIRouter()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@router.get("/nonce")
async def get_nonce(publicKey: str):
    nonce = base64.b64encode(nacl.utils.random(16)).decode("utf-8")
    
    # store the nonce in redis
    redis_client.setex(publicKey, timedelta(seconds=60), nonce)
    
    return ResponseMsg.SUCCESS.to_json(data={"nonce": nonce}) 


@router.post("/verify")
async def verify_signature(request: VerifyRequestDTO):
    publicKey = request.publicKey
    signature = request.signature
    print("publicKey", publicKey)
    print("signature", signature)
    # Retrieve the nonce from Redis
    nonce = redis_client.get(publicKey)
    if nonce is None:
        return ResponseMsg.INVALID.to_json(msg="Nonce not found")
    
    # Delete the nonce from Redis
    redis_client.delete(publicKey)
    
    # try:
    #     verify_key = VerifyKey(publicKey, encoder=Base64Encoder)
    #     verify_key.verify(nonce.encode("utf-8"), signature.encode("utf-8"))
    # except:
    #     return ResponseMsg.INVALID.to_json(msg="Verification failed")
    # append public key to key users
    user_id = Auth.create_authenticated_user()
    print("user_id", user_id)
    
    # Create JWT token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = Auth.create_access_token(
        data={"sub": user_id}, expires_delta=access_token_expires
    )
    return ResponseMsg.SUCCESS.to_json(data={"accessToken": access_token}, msg="Verification successful")


@router.post("/register")
async def register(registerInput: RegisterInputDTO, token: TokenData = Depends(Auth.verify_token)):
    try:
        # get users from db
        authenticated_user = Auth.get_current_user(token)
        if authenticated_user is None:
            return ResponseMsg.UNAUTHORIZED.to_json(msg="Unauthorized")
        eoa = registerInput.eoa
        plat_id = registerInput.plat_id
        
        logger.info(f"Registering user with eoa: {eoa} and plat_id: {plat_id}")
        response = await Auth.register(authenticated_user, eoa, plat_id)
        if response is None:
            return ResponseMsg.INVALID.to_json(msg="User exists")
        return ResponseMsg.SUCCESS.to_json(data=response)    
    except Exception as e:
        logger.error(f"Error registering user: {e}")
        return ResponseMsg.ERROR.to_json(msg="Error registering user")
    
    
    

@router.post("/login")
async def login(token: TokenData = Depends(Auth.verify_token)):
    # get users from db
    authenticated_user = Auth.get_current_user(token)
    if authenticated_user is None:
        return ResponseMsg.UNAUTHORIZED.to_json(msg="Unauthorized")
    
    if authenticated_user['plat_id'] is None:
        return ResponseMsg.INVALID.to_json(msg="User not registered")
    response = {
        "eoa": authenticated_user['eoa'],
        "plat_id": authenticated_user['plat_id']
    }
    
    return ResponseMsg.SUCCESS.to_json(data=response)
    