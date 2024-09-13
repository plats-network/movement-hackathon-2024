from src.models import mUser
class UserService(object):
    
    @staticmethod
    def check_register(address: str):
        user = mUser.get_item_with({"eoa": address})
        if user and user['plat_id']:
            return True
        return False
        
        
        
        
    