from src.models import mUser
import pydash as py_
from .twitter import TwitterService
from src.services import Nillion
from src.services.solana_client import Solana
from fastapi import HTTPException
class UserService(object):
    
    @staticmethod
    def check_register(address: str):
        # filter User in db has address array contains address
        user = mUser.get_item_with({"address": {"$elemMatch": {"$eq": address}}})
        if user:
            return {
                "plat_id": user['plat_id'],
                "address": user['address'],
                "is_new_user": user['is_new_user']
            }
        return None
    
    @staticmethod
    def delete_user(plat_id: str):
        user = mUser.get_item_with({"plat_id": plat_id})
        if user:
            mUser.delete(user['_id'], force=True)
            return True
        return False
        
    @staticmethod
    def register(plat_id: str, eoa: str, public_key: str):
        # check exist public_key
        exist_user = mUser.get_item_with({"public_key": { "$elemMatch": {"$eq": public_key}}})
        
        exist_plat_id = mUser.get_item_with({"plat_id": plat_id})
        if exist_user:
            raise HTTPException(status_code=400, detail="This address already associated with another user")

        if exist_plat_id:
            raise HTTPException(status_code=400, detail="Plat id already exists")
        
        user = mUser.insert({
            "plat_id": plat_id,
            "address": [eoa],
            "public_key": [public_key],
            "is_new_user": True
        })
        return user
        
    @staticmethod
    async def get_user(plat_id: str):
        user = mUser.get_item_with({"plat_id": plat_id})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # get list of store_balance, store_volume, store_twitter
        store_balance, store_volume, store_twitter, _ = Solana.get(plat_id)
        
        # Log all variables
        print(f"store_balance: {store_balance}")
        print(f"store_volume: {store_volume}")
        print(f"store_twitter: {store_twitter}")
        
        import asyncio
        raw_data = await asyncio.gather(
            *[Nillion.get_raw(plat_id, store_balance[i], store_volume[i], store_twitter[i]) for i in range(len(store_balance))]
        )
    
        raw_balance, raw_volume, raw_twitter = zip(*raw_data)
            
        # Get twitter_name
        try:
            twitter_name, twitter_score = await asyncio.gather(
                Nillion.retrieve(plat_id, 'twitter_name'),
                Nillion.retrieve(plat_id, 'twitter_score')
            )
        except Exception as e:
            twitter_name = twitter_name if 'twitter_name' in locals() else ""
            twitter_score = twitter_score if 'twitter_score' in locals() else -1
        
        # Remove _id from user
        user.pop('_id', None)
        user['twitter_name'] = twitter_name
        user['twitter_score'] = twitter_score
        user['balances'] = raw_balance
        user['volumes'] = raw_volume
        user['twitters'] = raw_twitter
        
        
        return user
    
    @staticmethod
    def get_user_by_public_key(public_key: str):
        user = mUser.get_item_with({"public_key": { "$elemMatch": {"$eq": public_key}}})
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
        
    
    @staticmethod
    def add_address(plat_id: str, eoa: str, public_key: str):
        user = mUser.get_item_with({"plat_id": plat_id})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Check if exist eoa in address array
        if eoa in user['address']:
            raise HTTPException(status_code=400, detail="Address already exists")
        # Check if exist public_key in public_key array
        if public_key in user['public_key']:
            raise HTTPException(status_code=400, detail="Public key already exists")
        
        # add to solana
        Solana.add_address(plat_id, public_key)
        
        mUser.update(user['_id'], {
            "address": user['address'] + [eoa],
            "public_key": user['public_key'] + [public_key]
        })
        

        
    @staticmethod
    def update_permission(plat_id: str, permissions: list):
        user = mUser.get_item_with({"plat_id": plat_id})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        # Update permissions on Solana
        Solana.update_permission(plat_id, user['public_key'][0], permissions)