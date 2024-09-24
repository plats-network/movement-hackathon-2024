from src.models import mPlatApp
from src.utils import generate_hash, tzware_datetime
from fastapi import HTTPException
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
    def register(app_name, app_url):
        app_id = generate_hash(app_url)
        mPlatApp.insert({
            "app_id": app_id,
            "app_name": app_name,
            "app_url": app_url
        })
        return app_id
    
    @staticmethod
    
    @staticmethod
    def get_plat_app(app_url):
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