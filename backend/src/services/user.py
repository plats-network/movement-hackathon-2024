from src.models import mUser
class UserService(object):
    
    @staticmethod
    def check_register(plat_id: str):
        user = mUser.get_item_with({"plat_id": plat_id})
        if user:
            return True
        return False
        
        
    @staticmethod
    def register(plat_id: str, eoa: str, public_key: str):
        # check exist public_key
        user = mUser.get_item_with({"public_key": public_key})
        if user:
            return None
        
        if user['public_key'] == public_key:
            return None
        
        if user['plat_id'] == plat_id:
            return None
        
        user = mUser.insert({
            "plat_id": plat_id,
            "address": [eoa],
            "public_key": public_key
        })
        return user
        
    @staticmethod
    def get_user(plat_id: str):
        user = mUser.get_item_with({"plat_id": plat_id})
        # except ObjectId
        if user:
            user.pop('_id', None)
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
        