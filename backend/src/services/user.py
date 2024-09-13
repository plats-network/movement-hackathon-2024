from src.models import mUser
class UserService(object):
    
    @staticmethod
    def check_register(plat_id: str):
        user = mUser.get_item_with({"plat_id": plat_id})
        if user:
            return True
        return False
        
        
    @staticmethod
    def register(plat_id: str, eoa: str):
        # check exist plat_id
        user = mUser.get_item_with({"plat_id": plat_id})
        if user:
            return None
        user = mUser.insert({
            "plat_id": plat_id,
            "address": [eoa]
        })
        return user
        
    @staticmethod
    def get_user(plat_id: str):
        user = mUser.get_item_with({"plat_id": plat_id})
        return user
        
    
    @staticmethod
    def update_user(plat_id: str, eoa: str):
        user = mUser.get_item_with({"plat_id": plat_id})
        if not user:
            raise Exception("User not found")
        user['address'].append(eoa)
        mUser.update(user)
        