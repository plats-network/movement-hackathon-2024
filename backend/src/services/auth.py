from src.models import mUser
from datetime import datetime, timedelta
from src.config import settings
import jwt
from fastapi import Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from src.dtos import TokenData
import jwt
from src.libs.nillion_helpers import NillionHelpers
class Auth(object):
    
    security = HTTPBearer()

    @staticmethod
    def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
        token = credentials.credentials
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            _: str = payload.get("sub")
            if _ is None:
                raise Exception("Invalid token: Missing _")
            token_data = TokenData(sub=_)
        except jwt.PyJWTError:
            raise Exception("Invalid token")
        return token_data

    
    @classmethod
    def create_access_token(cls, data: dict, expires_delta: timedelta = None):
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.now() + expires_delta
        else:
            expire = datetime.now() + timedelta(minutes=15)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
        return encoded_jwt
    
    
    
    @classmethod
    def login(cls, eoa):
        user = mUser.get_item_with({
            "eoa": eoa
        })
        
        if not user:
            return None
        
        return {
            "eoa": user['eoa'],
            "plat_id": user['plat_id'],
        }