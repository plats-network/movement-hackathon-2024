from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import pydash as py_
from src.utils import ResponseMsg
from src.services import UserService
from src.dtos import TokenData
from src.services import Auth
from datetime import timedelta
from src.config import settings
import logging

router = APIRouter()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@router.get('')
async def get_user(token: TokenData = Depends(Auth.verify_token)):
    
    # With the access token (plat_id)
    try:
        # get user from db
        user = await UserService.get_user(token.sub)
        if user is None:
            return ResponseMsg.INVALID.to_json(msg="Unauthorized or User not found")
        
        response = {
            "user": user
        }
        return ResponseMsg.SUCCESS.to_json(data=response)
    except Exception as e:
        logger.error(f"Error logging in: {e}")
        return ResponseMsg.ERROR.to_json(msg="Error logging in")