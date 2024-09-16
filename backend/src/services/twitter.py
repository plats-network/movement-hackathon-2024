from src.models import mUser
import pydash as py_
from src.config import settings
import requests
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
        
        