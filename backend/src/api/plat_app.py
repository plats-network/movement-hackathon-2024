from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import pydash as py_
from src.utils import ResponseMsg
from src.services import UserService
from src.dtos import TokenData, UpdateAccountDTO
from src.services import Auth
from datetime import timedelta
from src.config import settings
from src.dtos import RegisterAppDTO
import logging
router = APIRouter()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@router.post('')
async def register_plat_app():
    pass
    
