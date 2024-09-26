from src.models import mPlatApp
from src.utils import generate_hash, tzware_datetime
from fastapi import HTTPException
from src.services.solana_client import Solana
from src.models import mUser
from src.models import mPlatApp
from src.services.nillion import Nillion
from src.libs.nillion_helpers import NillionHelpers
class PlatAppService(object):
    
    @staticmethod
    def get_all_plat_app():
        plat_apps_cursor = mPlatApp.get_all()
        # convert cursor to list
        plat_apps = list(plat_apps_cursor) 
        for app in plat_apps:
            app.pop('_id', None)
        return plat_apps
    
    @staticmethod
    def register(app_name, app_url, app_icon):
        app_id = generate_hash(app_url)
        mPlatApp.insert({
            "app_id": app_id,
            "app_name": app_name,
            "app_url": app_url,
            "app_icon": app_icon,
        })
        return app_id
    
    @staticmethod
    
    @staticmethod
    def get_plat_app(app_id):
        app = mPlatApp.get_item_with({"app_id": app_id})
        if app:
            app.pop('_id', None)
            return app
        
    @staticmethod
    def get_plat_app_by_url(app_url):
        app = mPlatApp.get_item_with({"app_url": app_url})
        if app:
            app.pop('_id', None)
            return app
        
    @staticmethod
    def regenerate_app_id(app_id: str):
        try:
            app = mPlatApp.get_item_with({"app_id": app_id})
            if app:
                mPlatApp.update(app['_id'], {
                    "app_id": generate_hash(app['app_url']),
                })
            else:
                raise HTTPException(status_code=404, detail="App not found")
        except Exception as e:
            import traceback
            print(traceback.format_exc())
            raise e
        
        
    @staticmethod
    def delete_plat_app(app_id: str):
        app = mPlatApp.get_item_with({"app_id": app_id})
        if app:
            mPlatApp.delete(app['_id'], force=True)
        else:
            raise HTTPException(status_code=404, detail="App not found")
        
        
    @staticmethod
    async def get_user(app_id: str, plat_id: str):
        # 1. Get permission of app for plat_id on Solana
        user = mUser.get_item_with({"plat_id": plat_id})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        store_balance, store_volume, store_twitter, permissions = Solana.get(plat_id)
        
        # 2. Verify permission
        if app_id not in permissions:
            raise HTTPException(status_code=403, detail="Unauthorized")
        
        # 3. Compute rank and score of the master account
        store_balance = store_balance[0]
        store_volume = store_volume[0]
        store_twitter = store_twitter[0]
        
        # ìf twitter is empty, then save to nillion 
        # store_twitter = user.get('twitter_score', None)
        # party_name, program_id = await nillion.init_rank_program()

            
        # 4. Compute rank and score of the master account
        
        store_ids = [store_balance, store_volume, store_twitter]
        

        
        print(f"PLAT_APP::GET::INFO::{plat_id}", store_balance, store_volume, store_twitter)
        
        output = await Nillion.compute_rank_score(store_ids)

        return output
        
        
        
async def test():
    nillion = NillionHelpers()
    store_volume = await nillion.store_integer('secret_volume', 98)
    store_balance = await nillion.store_integer('secret_balance', 1923)
    store_twitter = await nillion.store_integer('secret_twitter', 90092)
    store_ids = [store_balance, store_volume, store_twitter]
    
    party_name, program_id = await nillion.init_rank_program()
    # GET DATA
    store_balance = await nillion.retrieve(store_balance, 'secret_balance')
    store_volume = await nillion.retrieve(store_volume, 'secret_volume')
    store_twitter = await nillion.retrieve(store_twitter, 'secret_twitter')
    
    print("store_balance", store_balance)
    print("store_volume", store_volume)
    print("store_twitter", store_twitter)
    
    print("store_ids", store_ids)
    output = await nillion.compute_rank(party_name, program_id, store_ids)
    return output        
        
if __name__ == '__main__':
    try:
        import asyncio
        asyncio.run(test())
        
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise e
        
    
        