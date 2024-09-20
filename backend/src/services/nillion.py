from src.libs.nillion_helpers import NillionHelpers
from src.models import mUser
from src.services.solana_client import Solana
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
        
        # TODO: Store store_id and key(secret_name) to smart contract 
        print("store_id", store_id)
        
        store_balance, store_volume, store_twitter = Solana.get(user.get('public_key'))
        if key == 'balance':
            store_balance = store_id
        elif key == 'volume_SOL_in_usd':
            store_volume = store_id
        elif key == 'twitter_score':
            store_twitter = store_id
        else:
            # Temporary save to database
            mUser.update(user['_id'], {key: store_id})
            
        Solana.update(plat_id, user.get('public_key'), store_balance, store_volume, store_twitter)

        # return store_id 
        
    
    @staticmethod
    async def retrieve(plat_id: str, key: str):
        nillion = NillionHelpers()
        user = mUser.get_item_with({"plat_id": plat_id})
        if user is None:
            raise Exception("User not found")
        
        # TODO: Retrieve store_id from smart contract using plat_id & key (secret_name)
        store_balance, store_volume, store_twitter = Solana.get(user.get('public_key'))
        if key == 'balance':
            store_id = store_balance
        elif key == 'volume_SOL_in_usd':
            store_id = store_volume
        elif key == 'twitter_score':
            store_id = store_twitter
        else:
            # Temporary get from database
            store_id = user.get(key, "")
            
        if not store_id:
            raise Exception("Store ID not found")
        value = await nillion.retrieve(store_id, key)
        return value
        
    @staticmethod
    async def get_info(plat_id: str, store_balance: str, store_volume: str, store_twitter: str, balance_key = 'balance', volume_key = 'volume_SOL_in_usd', twitter_key = 'twitter_score'):
        user = mUser.get_item_with({"plat_id": plat_id})
        if user is None:
            raise Exception("User not found")
        nillion = NillionHelpers()
        nan = -1
        balance = volume = twitter = rank = None
        try:
            balance = await nillion.retrieve(store_balance, balance_key)
            volume = await nillion.retrieve(store_volume, volume_key)
            twitter = await nillion.retrieve(store_twitter, twitter_key)
            rank = await nillion.rank(secret_balance=balance, secret_volumn=volume, secret_twitter=twitter)
        except Exception as e:
            print(f"Error occurred: {e}")
            balance = balance if balance is not None else nan
            volume = volume if volume is not None else nan
            twitter = twitter if twitter is not None else nan
            rank = rank if rank is not None else nan
        
        return {
            "balance": balance,
            "volume": volume,
            "twitter": twitter,
            "rank": rank
        }
    
    @staticmethod
    async def rank():
        nillion = NillionHelpers()
        return await nillion.rank()