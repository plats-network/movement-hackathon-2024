from fastapi import APIRouter, Depends
from src.dtos import StoreInputDTO, RetrieveInputDTO
from src.utils import ResponseMsg
from src.services import Auth
import pydash as py_
import base64
import logging
from nacl.signing import VerifyKey
from nacl.encoding import Base64Encoder
from src.services import Nillion

router = APIRouter()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@router.post('/store')
async def store(storeInput: StoreInputDTO):
    try:
        key = storeInput.key
        value = storeInput.value
        plat_id = storeInput.plat_id

        data = await Nillion.store(plat_id, key, value)
        return ResponseMsg.SUCCESS.to_json(data={"store_id": data})
    except Exception as e:
        logger.error(e)
        return ResponseMsg.ERROR.to_json(msg=str(e))


@router.get('/retrieve')
async def retrieve(plat_id: str, key: str):
    try:
        value = await Nillion.retrieve(plat_id, key)
        return ResponseMsg.SUCCESS.to_json(data={"value": value})
    except Exception as e:
        logger.error(e)
        return ResponseMsg.ERROR.to_json(msg=str(e))
    

@router.post('/rank')
async def rank():
    try:
        data = await Nillion.rank()
        return ResponseMsg.SUCCESS.to_json(data=data)
        
    except Exception as e:
        logger.error(e)
        return ResponseMsg.ERROR.to_json(msg=str(e))