from src.models import mUser
import pydash as py_
from .twitter import TwitterService
from src.services import Nillion
class UserService(object):
    
    @staticmethod
    def check_register(address: str):
        # filter User in db has address array contains address
        user = mUser.get_item_with({"address": {"$elemMatch": {"$eq": address}}})
        if user:
            return {
                "plat_id": user['plat_id'],
                "address": user['address']
            }
        return None
        
        
    @staticmethod
    def register(plat_id: str, eoa: str, public_key: str):
        # check exist public_key
        exist_user = mUser.get_item_with({"public_key": public_key})
        exist_plat_id = mUser.get_item_with({"plat_id": plat_id})
        if exist_user:
            return None

        if exist_plat_id:
            return None
        
        user = mUser.insert({
            "plat_id": plat_id,
            "address": [eoa],
            "public_key": public_key
        })
        return user
        
    @staticmethod
    async def get_user(plat_id: str):
        user = mUser.get_item_with({"plat_id": plat_id})
        # except ObjectId
        except_list = ['_id', 'public_key', 'plat_id', 'address', 'date_created', 'date_updated']
        if user:
            for key in except_list:
                user.pop(key, None)
            
            for key in user:
                value = await Nillion.retrieve(plat_id, key)
                user[key] = value
            return user
        return None
    
    @staticmethod
    def get_user_by_public_key(public_key: str):
        user = mUser.get_item_with({"public_key": public_key})
        return user
    
    
    @staticmethod
    def update_user(plat_id: str, eoa: str):
        user = mUser.get_item_with({"plat_id": plat_id})
        if not user:
            raise Exception("User not found")
        user['address'].append(eoa)
        mUser.update(user)
    
    @staticmethod
    def update_user_info(plat_id: str, data: dict):
        user = mUser.get_item_with({"plat_id": plat_id})
        if not user:
            raise Exception("User not found")
        mUser.update(user['_id'], data)