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
        wallet_addr = storeInput.wallet_addr
        secret_balance = storeInput.secret_balance
        secret_volume = storeInput.secret_volume

        # in background
        background_tasks.add_task(Nillion.store, plat_id, wallet_addr, secret_balance, secret_volume)

        return ResponseMsg.SUCCESS.to_json(msg="Store operation is in progress")
    
    except HTTPException as http_exc:
        raise http_exc
    
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error storing data::{str(e)}")


@router.get('/retrieve')
async def retrieve(plat_id: str = "khaihoang", wallet_addr: str = "GJeggjDKerwUaFpbkL9DnDC2S9C5ez2HEomcb9LjWKJB"):
    try:
        data = await Nillion.retrieve(plat_id, wallet_addr)
        return ResponseMsg.SUCCESS.to_json(data=data)
    
    except HTTPException as http_exc:
        raise http_exc
    
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error storing data::{str(e)}")
    

@router.get("/synced")
def check_synced(plat_id: str = "khaihoang", wallet_addr: str = "GJeggjDKerwUaFpbkL9DnDC2S9C5ez2HEomcb9LjWKJB"):
    try:
        data = UserService.check_synced(plat_id, wallet_addr)
        return ResponseMsg.SUCCESS.to_json(data={"synced": data})
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        return HTTPException(status_code=500, detail=str(e))

@router.post('/user')
def update_user(wallet_addr: str = "GJeggjDKerwUaFpbkL9DnDC2S9C5ez2HEomcb9LjWKJB"):
    try:
        data = UserService.check_register(wallet_addr)
        return ResponseMsg.SUCCESS.to_json(data={
            "plat_id": data
        })
    
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        return ResponseMsg.ERROR.to_json(msg=str(e))
    
