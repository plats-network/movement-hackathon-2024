from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import pydash as py_
from src.utils import ResponseMsg
from src.services import UserService
router = APIRouter()


@router.get("/check-register")
def check_register(plat_id: str):
    try:
        result = UserService.check_register(plat_id)
        if result:
            return ResponseMsg.SUCCESS.to_json(data={"registered": True})
        return ResponseMsg.NOT_FOUND.to_json(data={"registered": False})
    except Exception as e:
        return ResponseMsg.ERROR.to_json(msg=str(e))