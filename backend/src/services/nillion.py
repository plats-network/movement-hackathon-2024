from src.libs.nillion_helpers import NillionHelpers
from src.models import mUser
class Nillion(object):
    
    
    @staticmethod
    async def store(plat_id: str, key: str, value):
        user = mUser.get_item_with({"plat_id": plat_id})
        if user is None:
            raise Exception("User not found")
        nillion = NillionHelpers()
        if isinstance(value, str):
            store_id = await nillion.store_blob(key=key, value=value)
        else:
            store_id = await nillion.store_integer(key=key, value=value)
        
        # TODO: Store store_id and key(secret_name) to smart contract using plat_id
            
        return 
        
    
    @staticmethod
    async def retrieve(plat_id: str, key: str):
        nillion = NillionHelpers()
        user = mUser.get_item_with({"plat_id": plat_id})
        if user is None:
            raise Exception("User not found")
        
        # TODO: Retrieve store_id from smart contract using plat_id & key (secret_name)
        # Output is a list of store_id & keys
        # volume_id = ...
        # twitter_id = ...
        # balance_id = ...
        return

        
        if not store_id:
            raise Exception("Store ID not found")
        value = await nillion.retrieve(store_id, key)
        return value
        
    
    @staticmethod
    async def rank():
        nillion = NillionHelpers()
        return await nillion.rank()