from src.libs.nillion_helpers import NillionHelpers
from src.models import mUser
class Nillion(object):
    
    
    @staticmethod
    async def store(address: str, key: str, value):
        nillion = NillionHelpers()
        if isinstance(value, str):
            store_id = await nillion.store_blob(key=key, value=value)
        else:
            store_id = await nillion.store_integer(key=key, value=value)
        mUser.update_by_filter({"eoa": address}, {
            key: store_id
        })
        return store_id
        
    
    @staticmethod
    async def retrieve(address: str, key: str):
        nillion = NillionHelpers()
        user = mUser.get_item_with({"eoa": address})
        if not user:
            raise Exception("User not found")
        store_id = user.get(key)
        if not store_id:
            raise Exception("Store ID not found")
        value = await nillion.retrieve(store_id, key)
        return value
        
    