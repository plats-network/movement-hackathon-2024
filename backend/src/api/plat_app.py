from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import pydash as py_
from src.utils import ResponseMsg
from src.services import UserService
from src.dtos import TokenData, UpdateAccountDTO
from src.services import Auth
from datetime import timedelta
from src.config import settings
from src.dtos import RegisterAppDTO, UpdateAppDTO
from src.services import PlatAppService
import logging

import traceback

router = APIRouter()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
@router.get('')
async def get_all_registered_app():
    try:
        plat_apps = PlatAppService.get_all_plat_app()
        return ResponseMsg.SUCCESS.to_json(data={
            "plat_apps": plat_apps
        })
    
    except HTTPException as http_exc:
        raise http_exc
    
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

@router.post('')
async def register_plat_app(body: RegisterAppDTO):
    try:
        # Register plat app
        app_name = body.app_name
        app_url = body.app_url
        app_icon = body.app_icon
        # check if app_name and app_url is not empty
        if not app_name or not app_url or not app_icon:
            raise HTTPException(status_code=400, detail="App name and App URL is required")
        
        if PlatAppService.get_plat_app(app_url):
            raise HTTPException(status_code=400, detail="App URL already registered")
        
        plat_app = PlatAppService.register(app_name=app_name, app_url=app_url, app_icon=app_icon)
        return ResponseMsg.SUCCESS.to_json(data={"app_id": plat_app})
    
    except HTTPException as http_exc:
        raise http_exc
    
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get('/{app_id}')
async def get_plat_app(app_id: str):
    try:
        plat_app = PlatAppService.get_plat_app(app_id)
        if not plat_app:
            raise HTTPException(status_code=404, detail="Plat app not found")
        
        
        return ResponseMsg.SUCCESS.to_json(data=plat_app)
    
    except HTTPException as http_exc:
        raise http_exc
    
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))
    
    
@router.post('/url')
async def get_plat_app(app_url: str):
    try:
        plat_app = PlatAppService.get_plat_app_by_url(app_url)
        if not plat_app:
            raise HTTPException(status_code=404, detail="Plat app not found")
        
        
        return ResponseMsg.SUCCESS.to_json(data=plat_app)
    
    except HTTPException as http_exc:
        raise http_exc
    
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

@router.put('')
async def regenerate_app_id(body: UpdateAppDTO):
    try:
        PlatAppService.regenerate_app_id(body.app_id)
        return ResponseMsg.SUCCESS.to_json(msg="App ID regenerated successfully")
    
    except HTTPException as http_exc:
        raise http_exc
    
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))
    

@router.delete('')
async def delete_plat_app(app_id: str):
    try:
        PlatAppService.delete_plat_app(app_id)
        return ResponseMsg.SUCCESS.to_json(msg="Plat app deleted successfully")
    
    except HTTPException as http_exc:
        raise http_exc
    
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))
    
    
@router.get('/{app_id}/account')
async def get_user(app_id: str, plat_id: str):
    try:
        output = await PlatAppService.get_user(app_id, plat_id)
        return ResponseMsg.SUCCESS.to_json(data={
            "output": output,
        })
    
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))