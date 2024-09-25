from src.libs.nillion_helpers import NillionHelpers
from src.models import mUser
from src.services.solana_client import Solana
from src.config import settings
from fastapi import HTTPException
class Nillion(object):
    
    
    @staticmethod
    async def store(plat_id: str, key: str, value):
        '''
            Store value for a specific address using its `plat_id` and a `address`
        '''
        user = mUser.get_item_with({"plat_id": plat_id})
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        nillion = NillionHelpers()
        if isinstance(value, str):
            # Convert string to int
            value = int(nillion.safe_float_conversion(value) * settings.NILLION_MULTIPLIER)
            store_id = await nillion.store_integer(key=key, value=value)
        else:
            store_id = await nillion.store_integer(key=key, value=value)
        
        # TODO: Store store_id and key(secret_name) to smart contract 
        print("store_id", store_id)
        
        store_balance, store_volume, store_twitter, _ = Solana.get(plat_id)
        # Logger
        print(f"STORE::GET from solana::{plat_id}::{key}::{value}::", store_balance, store_volume, store_twitter)
        print(f"store_balance: {store_balance}")
        print(f"store_volume: {store_volume}")
        print(f"store_twitter: {store_twitter}")
        
        if key == 'secret_balance':
            store_balance = store_id
        elif key == 'secret_volume':
            store_volume = store_id
        elif key == 'secret_twitter':
            store_twitter = store_id
        else:
            # Temporary save to database
            mUser.update(user['_id'], {key: store_id})
        
        print(f"STORE::UPDATE from solana::{plat_id}::{key}::{value}::", store_balance, store_volume, store_twitter)
        Solana.update(plat_id, user.get('public_key'), store_balance, store_volume, store_twitter)

        # return store_id 
    
    
    @staticmethod
    async def retrieve(plat_id: str, key: str):
        nillion = NillionHelpers()
        user = mUser.get_item_with({"plat_id": plat_id})
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        
        # TODO: Retrieve store_id from smart contract using plat_id & key (secret_name)
        store_balance, store_volume, store_twitter, _ = Solana.get(plat_id)
        
        print(f"RETRIEVE::GET from solana::{plat_id}::{key}::", store_balance, store_volume, store_twitter)
        if key == 'secret_balance':
            store_id = store_balance
        elif key == 'secret_volume':
            store_id = store_volume
        elif key == 'secret_twitter':
            store_id = store_twitter
        else:
            # Temporary get from database, ex: twitter_name
            store_id = user.get(key, "")
            
        if not store_id:
            return 0
        value = await nillion.retrieve(store_id, key)
        return value
        
    @staticmethod
    async def get_raw(plat_id: str, store_balance: str, store_volume: str, store_twitter: str, balance_key = 'secret_balance', volume_key = 'secret_volume', twitter_key = 'secret_twitter'):
        user = mUser.get_item_with({"plat_id": plat_id})
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        
        nillion = NillionHelpers()
        print(f"FE::GET::INFO::{plat_id}", store_balance, store_volume, store_twitter)
        
        balance = await nillion.retrieve(store_balance, balance_key)
        volume = await nillion.retrieve(store_volume, volume_key)
        twitter = await nillion.retrieve(store_twitter, twitter_key)
        
        # balance_int, volume_int, twitter_int, threshold_whale, threshold_trade, threshold_kol = nillion.format_compute(balance, volume, twitter)
        
        # rank = await nillion.rank(balance_int, volume_int, twitter_int, threshold_whale, threshold_trade, threshold_kol)

        return balance, volume, twitter
    
    
    @staticmethod
    async def compute_rank_score(store_ids: list):
        nillion = NillionHelpers()
        party_name, program_id = await nillion.init_rank_program()
        output = await nillion.compute_rank(party_name, program_id, store_ids)
        
        return output