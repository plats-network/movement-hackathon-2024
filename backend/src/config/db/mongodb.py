from src.config import settings

import pymongo

mdb = pymongo.MongoClient(settings.MONGO_URI)
