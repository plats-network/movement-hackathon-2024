from src.libs.nillion_helpers import NillionHelpers
from src.models import mUser
from src.services.solana_client import Solana
from src.config import settings
from fastapi import HTTPException
class Nillion(object):
    
    
    @staticmethod
    async def store(plat_id: str, balances: list, volumes: list):
        '''
            Store value for a specific address using its `plat_id` and a `address`
        '''
        user = mUser.get_item_with({"plat_id": plat_id})
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        
        nillion = NillionHelpers()
        public_key = user.get('public_key', [])
        
        # 1. Convert string to int 
        balances = [int(balance * settings.NILLION_MULTIPLIER) for balance in balances]
        
        volumes = [int(volume * settings.NILLION_MULTIPLIER) for volume in volumes]
        print("BALANCES::", balances)
        print("VOLUMES::", volumes)
        
        # 2. Store balances to nillion
        import asyncio
        balances_ids = []
        volumes_ids = []
        for i in range(len(balances)):
            balance_id = await nillion.store_integer('secret_balance', balances[i])
            volume_id = await nillion.store_integer('secret_volume', volumes[i])
            balances_ids.append(balance_id)
            volumes_ids.append(volume_id)
        print("BALANCES_IDS::", balances_ids)
        print("VOLUMES_IDS::", volumes_ids)
        # 3. Store balances_ids, volumes_ids to solana
        for i in range(len(balances_ids)):
            Solana.update(plat_id=plat_id, public_key=public_key[i], store_balance=balances_ids[i], store_volume=volumes_ids[i])
        
        print("STORE::SUCCESS")
    
    
    @staticmethod
    async def retrieve(plat_id: str):
        '''
            Retrive data of a `plat_id`
        '''
        user = mUser.get_item_with({"plat_id": plat_id})
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        
        nillion = NillionHelpers()
        address = user.get('address', [])
        
        # 1. Retrieve balances, volumes from solana
        store_balance, store_volume, store_twitter, _ = Solana.get(plat_id)
        
        # 2. Retrieve balances, volumes, twitter from nillion
        balances = []
        volumes = []
        for i in range(len(store_balance)):
            balance, volume, _ = await Nillion.get_raw(plat_id, store_balance[i], store_volume[i], store_twitter[i])
            balances.append(balance)
            volumes.append(volume)
        
        # 3. Return raw_data
        balances = [balance / settings.NILLION_MULTIPLIER if balance > 0 else 0 for balance in balances]
        volumes = [volume / settings.NILLION_MULTIPLIER if volume > 0 else 0 for volume in volumes]
        
        return {
            "balances": balances,
            "volumes": volumes,
            "addresses": address,
            "is_new_user": user.get('is_new_user', False)
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