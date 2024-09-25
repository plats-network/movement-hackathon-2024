from src.models import mUser
import pydash as py_
from src.config import settings
import requests
from src.libs.nillion_helpers import NillionHelpers
class TwitterService(object):
    
    @staticmethod
    def get_score(screen_name: str):
        url = f"{settings.TWITTER_API_URL}/{screen_name}/info/"
        response = requests.get(url, headers={
            "Content-Type": "application/json",
            "Api-Key": settings.TWITTER_API_KEY
        })
        if response.status_code != 200:
            return -1
        return response.json().get('followersScore')
        
    @staticmethod
    async def save(plat_id: str, screen_name: str, score: int):
        '''
            Save twitter score and screen_name
        '''
        nillion = NillionHelpers()
        user = mUser.get_item_with({"plat_id": plat_id})
        twitter_score = await nillion.store_integer(key='secret_twitter', value=score)
        twitter_name = await nillion.store_blob(key='twitter_name', value=screen_name)
        mUser.update(user['_id'], {
            'twitter_score': twitter_score,
            'twitter_name': twitter_name
        })
        