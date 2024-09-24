from fastapi import APIRouter, Depends, HTTPException
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
import hashlib
from src.services.solana_client import Solana
from src.services.indexer import Indexer

router = APIRouter()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def base64_to_a_z(base64_str):
    # Decode the base64 string to bytes
    decoded_bytes = base64.b64decode(base64_str)
    # Hash the bytes using SHA-256
    sha256_hash = hashlib.sha256(decoded_bytes).digest()
    # Encode the hash in base64
    base64_hash = base64.b64encode(sha256_hash).decode('utf-8')
    # Map the base64 characters to a-z
    a_z_str = ''.join(chr((ord(c) % 26) + ord('a')) for c in base64_hash)
    return a_z_str

@router.get("/nonce")
async def get_nonce(public_key: str):
    try:
        nonce = base64.b64encode(nacl.utils.random(16)).decode("utf-8")
        
        # generate a string from public_key unique
        try:
            unique_key = base64_to_a_z(public_key)
        
        except Exception as e:
            logger.error("ERROR:BASE64_TO_A_Z", e)
            raise HTTPException(status_code=400, detail="{}".format(e))
        
        # store the nonce in redis
        redis_client.setex(unique_key, timedelta(seconds=60), nonce)
        
        return ResponseMsg.SUCCESS.to_json(data={"nonce": nonce}) 
    
    except HTTPException as http_exc:
        raise http_exc
    
    except Exception as e:
        logger.error("ERROR:GET_NONCE", e)
        raise HTTPException(status_code=500, detail="Internal Server Error::{}".format(e))


@router.post("/verify")
async def verify_signature(request: VerifyRequestDTO):
    public_key = request.public_key
    signature = request.signature
    print("publicKey", public_key)
    print("signature", signature)
    # Retrieve the nonce from Redis
    unique_key = base64_to_a_z(public_key)
    nonce_bytes = redis_client.get(unique_key)
    nonce = nonce_bytes.decode("utf-8") if nonce_bytes else None
    
    
    if nonce is None:
        return ResponseMsg.INVALID.to_json(msg="Nonce not found")
    

    # Delete the nonce from Redis
    redis_client.delete(unique_key)
    
    # ! Uncomment to verify signature
    try:
        # Decode the base64 public key and signature
        verify_key = VerifyKey(public_key, encoder=Base64Encoder)
        decoded_signature = Base64Encoder.decode(signature)
        
        # Verify the signature against the message
        verify_key.verify(nonce.encode("utf-8"), decoded_signature)
    except Exception as e:
        logger.error(f"Error verifying signature: {e}")
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
        UserService.register(plat_id=plat_id, eoa=eoa, public_key=public_key)

        try:
            # Register the user on Solana
            response = Solana.register(plat_id, public_key)
            
            if response is None:
                raise HTTPException(status_code=500, detail="Failed to register on Solana::{}".format(e))
            
            logger.info(f"REGISTER::SYNC VOLUME::{plat_id}::address::{eoa}::publickey::{public_key}")
            
            Indexer().send_message(plat_id=plat_id, wallet_addr=eoa)

            return ResponseMsg.SUCCESS.to_json(data={}, msg="Registration successful")
        except Exception as e:
            UserService.delete_user(plat_id=plat_id)
            raise e
      
    except HTTPException as http_exc:
        raise http_exc
    
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error::{}".format(e))
    

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
    
    except HTTPException as http_exc:
        raise http_exc
    
    except Exception as e:
        logger.error(f"Error logging in: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error::{e}")