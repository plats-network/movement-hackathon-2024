from .config import settings
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import api_router
from .middleware.headers import CustomHeadersMiddleware
from starlette.middleware.sessions import SessionMiddleware
from .middleware.options import OptionsMiddleware

def create_app(config=None, app_name=None):
    """Create a FastApi app."""

    if app_name is None:
        app_name = settings.PROJECT_NAME

    app = FastAPI(
        title=app_name,
        openapi_url=f"{settings.API_V1_STR}/openapi.json"
    )

    # Add CORS
    # app.add_middleware(
    #     CORSMiddleware,
    #     allow_origins=["*"],
    #     allow_credentials=False,
    #     allow_methods=["*"],
    #     allow_headers=["*"],
    # )

    # Add middleware
    app.add_middleware(OptionsMiddleware)
    # app.add_middleware(CustomHeadersMiddleware)
    app.add_middleware(SessionMiddleware, secret_key="!secret")

    app.include_router(api_router, prefix=settings.API_V1_STR)

    return app
