from fastapi import APIRouter

from .auth import router as auth_router
from .index import router as app_router
from .nillion import router as nillion_router
from .user import router as user_router

api_router = APIRouter()

api_router.include_router(auth_router,
                          prefix="/auth", tags=["Auth"])
api_router.include_router(user_router,
                          prefix="/user", tags=["User"])
api_router.include_router(nillion_router,
                          prefix="/internal/nillion", tags=["Nillion"])
api_router.include_router(app_router,
                          prefix="/health", tags=["Health Check"])
