from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import pydash as py_
from src.utils import ResponseMsg
from src.services import UserService
from src.dtos import TokenData, UpdateAccountDTO, UpdatePermissionDTO
from src.services import Auth
from datetime import timedelta
from src.config import settings
import logging
router = APIRouter()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@router.get('')
async def get_user(token: TokenData = Depends(Auth.verify_token)):
    try:
        # get user from db
        user = await UserService.get_user(token.sub)
        if user is None:
            return ResponseMsg.INVALID.to_json(msg="Unauthorized or User not found")
        
        if not user:
            return ResponseMsg.SUCCESS.to_json(msg="No data", data={})    
        
        response = {
            "user": user
        }
        
        return ResponseMsg.SUCCESS.to_json(data=response)
    
    except HTTPException as http_exc:
        raise http_exc
    
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))
    

@router.put('/address')
async def add_address(body: UpdateAccountDTO, token: TokenData = Depends(Auth.verify_token)):
    try:
        if not body.address or not body.public_key:
            return HTTPException(status_code=400, detail="Address is required")
        # Get user from db with plat_id
        UserService.add_address(token.sub, body.address, body.public_key)
        return ResponseMsg.SUCCESS.to_json(msg="Address added successfully")
    
    except HTTPException as http_exc:
        raise http_exc
    
    except Exception as e:
        logger.error("ADD ACCOUNT::ERROR::{}".format(e))
        raise HTTPException(status_code=500, detail=str(e))
    

@router.put('/permissions')
async def update_permission(body: UpdatePermissionDTO, token: TokenData = Depends(Auth.verify_token)):
    try:
        permissions = body.permissions
        if not permissions:
            return HTTPException(status_code=400, detail="Permissions is required")
        
        
        
        UserService.update_permission(token.sub, permissions)
        
    
    except HTTPException as http_exc:
        raise http_exc
    
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))