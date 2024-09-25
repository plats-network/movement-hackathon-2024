from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from src.dtos import StoreInputDTO, RetrieveInputDTO
from src.utils import ResponseMsg
from src.services import Auth
import pydash as py_
import base64
import logging
from nacl.signing import VerifyKey
from nacl.encoding import Base64Encoder
from src.services import Nillion
from src.services import UserService

router = APIRouter()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@router.post('/store')
async def store(storeInput: StoreInputDTO, background_tasks: BackgroundTasks):
    try:
        plat_id = storeInput.plat_id
        balances = storeInput.balances
        volumes = storeInput.volumes

        # in background
        background_tasks.add_task(Nillion.store, plat_id, balances, volumes)

        return ResponseMsg.SUCCESS.to_json(msg="Store operation is in progress")
    
    except HTTPException as http_exc:
        raise http_exc
    
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error storing data::{str(e)}")


@router.get('/retrieve')
async def retrieve(plat_id: str):
    try:
        data = await Nillion.retrieve(plat_id)
        return ResponseMsg.SUCCESS.to_json(data=data)
    
    except HTTPException as http_exc:
        raise http_exc
    
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error storing data::{str(e)}")
    

@router.get("/user")
def check_register(address: str):
    try:
        data = UserService.check_register(address)
        if data:
            return ResponseMsg.SUCCESS.to_json(data=data)
        return ResponseMsg.NOT_FOUND.to_json(data={})
    except Exception as e:
        return ResponseMsg.ERROR.to_json(msg=str(e))

@router.post('/user')
def update_user(plat_id: str, is_new_user: bool):
    try:
        UserService.update_user_info(plat_id, {"is_new_user": is_new_user})
        return ResponseMsg.SUCCESS.to_json(data={})
    except Exception as e:
        return ResponseMsg.ERROR.to_json(msg=str(e))
    

@router.post('/rank')
async def rank():
    try:
        data = await Nillion.rank()
        return ResponseMsg.SUCCESS.to_json(data=data)
        
    except Exception as e:
        logger.error(e)
        return ResponseMsg.ERROR.to_json(msg=str(e))