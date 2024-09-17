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
from src.services import UserService

router = APIRouter()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@router.get("/nonce")
async def get_nonce(public_key: str):
    nonce = base64.b64encode(nacl.utils.random(16)).decode("utf-8")
    
    # store the nonce in redis
    redis_client.setex(public_key, timedelta(seconds=60), nonce)
    
    return ResponseMsg.SUCCESS.to_json(data={"nonce": nonce}) 


@router.post("/verify")
async def verify_signature(request: VerifyRequestDTO):
    public_key = request.public_key
    signature = request.signature
    print("publicKey", public_key)
    print("signature", signature)
    # Retrieve the nonce from Redis
    nonce = redis_client.get(public_key)
    if nonce is None:
        return ResponseMsg.INVALID.to_json(msg="Nonce not found")
    
    # Delete the nonce from Redis
    redis_client.delete(public_key)
    
    # ! Uncomment to verify signature
    try:
        # Decode the base64 public key and signature
        verify_key = VerifyKey(public_key, encoder=Base64Encoder)
        decoded_signature = Base64Encoder.decode(signature)
        
        # Verify the signature against the message
        verify_key.verify(nonce.encode("utf-8"), decoded_signature)
    except:
        return ResponseMsg.INVALID.to_json(msg="Verification failed")
    
    
    
    # Create JWT token
    authen_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    authen_token = Auth.create_access_token(
        data={"sub": public_key}, expires_delta=authen_token_expires
    )
    return ResponseMsg.SUCCESS.to_json(data={"authen_token": authen_token}, msg="Verification successful")


@router.post("/register")
async def register(registerInput: RegisterInputDTO, token: TokenData = Depends(Auth.verify_token)):
    # With the authen token (public key)
    try:
        eoa = registerInput.eoa
        plat_id = registerInput.plat_id
        public_key = registerInput.public_key
        
        if token.sub != public_key:
            return ResponseMsg.UNAUTHORIZED.to_json(msg="Unauthorized")
        
        
        # Create a new user with plat_id
        new_user = UserService.register(plat_id=plat_id, eoa=eoa, public_key=public_key)
        if new_user is None:
            return ResponseMsg.INVALID.to_json(msg="User exists")
        
        logger.info(f"User registered with plat_id: {plat_id}, address, {new_user['address']}, public_key: {public_key}")
        # TODO: Send transaction to SMC to register user with plat_id, eoa=new_user['address][0]
        

        
        return ResponseMsg.SUCCESS.to_json(data={}, msg="Registration successful")  
    except Exception as e:
        logger.error(f"Error registering user: {e}")
        return ResponseMsg.ERROR.to_json(msg="Error registering user")
    
    
@router.post("/login")
async def login(token: TokenData = Depends(Auth.verify_token)):
    
    # With the authen token (public key)
    try:
        # get user from db
        user = UserService.get_user_by_public_key(token.sub)
        if user is None:
            return ResponseMsg.INVALID.to_json(msg="User not registered")
        
        # Create accesstoken for get user info later.
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = Auth.create_access_token(
            data={"sub": user['plat_id']}, expires_delta=access_token_expires
        )
        response = {
            "access_token": access_token
        }
        return ResponseMsg.SUCCESS.to_json(data=response)
    except Exception as e:
        logger.error(f"Error logging in: {e}")
        return ResponseMsg.ERROR.to_json(msg="Error logging in")