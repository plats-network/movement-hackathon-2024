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
            public_key: str = payload.get("sub")
            if public_key is None:
                raise HTTPException(
                    status_code=401, detail="Invalid token: subject not found"
                )
            token_data = TokenData(sub=public_key)
        except jwt.PyJWTError:
            raise HTTPException(
                status_code=401, detail="Invalid token"
            )
        return token_data
    
    
    @staticmethod
    def get_current_user(token_data: TokenData = Depends(verify_token)):
        user = mUser.get_item(token_data.sub)
        return user
    
    
    @staticmethod
    def create_authenticated_user():
        user = mUser.insert({
            "eoa": "",
            "plat_id": "",
        })
        return str(user['_id'])
        
    
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
    async def register(cls,authenticated_user, eoa, plat_id):
        print("authenticated_user", authenticated_user)
        # check exist plat_id
        if authenticated_user['plat_id']:
            return None
        
        # !TODO: Send transaction to blockchain
        
        
        # !TODO: Store to nillion
        nillion = NillionHelpers()
        store_id = await nillion.store_blob(key=eoa, value=plat_id)
        # Retrieve the value
        # value = await nillion.retrieve_blob(store_id=store_id, key=eoa)
        # Save user to database
        mUser.update(authenticated_user['_id'], {
            "eoa": eoa,
            "plat_id": plat_id,
            "store_id": store_id,
        })
        
        return {
            "eoa": eoa,
            "plat_id": plat_id,
            "store_id": store_id,
        }
    
    
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