from src.libs.nillion_helpers import NillionHelpers
from src.models import mUser
from src.services.solana_client import Solana
from src.config import settings
from fastapi import HTTPException
from src.libs.nillion_helpers import NillionHelpers
class Nillion(object):
    
    
    @staticmethod
    async def store(plat_id: str, wallet_addr: str, secret_balance: float, secret_volume: float):
        '''
            Store value for a specific address using its `plat_id` and a `address`
        '''
        user = mUser.get_item_with({"plat_id": plat_id})
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        nillion = NillionHelpers()
        public_key = user.get('public_key', [])
        address = user.get('address', [])
        synced = user.get('synced', [])
        
        try:
            index = address.index(wallet_addr)

        except ValueError:
            raise HTTPException(status_code=404, detail="Wallet address not found")
        
        # 1. Convert string to int 
        balance = int(secret_balance * settings.NILLION_MULTIPLIER)
        volume = int(secret_volume * settings.NILLION_MULTIPLIER)
        
        # 2. Store balance, volume to nillion
        balance_id = await nillion.store_integer('secret_balance', balance)
        volume_id = await nillion.store_integer('secret_volume', volume)
        twitter_id = await nillion.store_integer('secret_twitter', 0)
        
        # 3. Store balance, volume to solana
        Solana.update(plat_id=plat_id, public_key=public_key[index], store_balance=balance_id, store_volume=volume_id, store_twitter=twitter_id)
        
        # 4. Update synced
        synced.append(wallet_addr)
        mUser.update(user['_id'], {
            "synced": synced
        })
        
        print("STORE::SUCCESS")
    
    
    @staticmethod
    async def retrieve(plat_id: str, wallet_addr: str):
        '''
            Retrive data of a `plat_id`
        '''
        user = mUser.get_item_with({"plat_id": plat_id})
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        
        nillion = NillionHelpers()
        address = user.get('address', [])
        
        # find index of address in address
        try:
            index = address.index(wallet_addr)
            
        except ValueError:
            raise HTTPException(status_code=404, detail="Wallet address not found")
        
        # 1. Retrieve balances, volumes from solana
        store_balance, store_volume, _, _ = Solana.get(plat_id)
        
        # 2. Get the balance and volume of the wallet_addr from nillion
        balance = await nillion.retrieve(store_balance[index], 'secret_balance')
        volume =  await nillion.retrieve(store_volume[index], 'secret_volume')
        
        # 3. Return raw_data
        balance = balance / settings.NILLION_MULTIPLIER if balance > 0 else 0
        volume = volume / settings.NILLION_MULTIPLIER if volume > 0 else 0

        
        return {
            "secret_balance": balance,
            "secret_volume": volume,
        }
        
        
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