from src.config import settings, mdb
from .base import BaseDAO

mUser = BaseDAO(mdb[settings.MONGO_DB][settings.MONGO_USER_COLLECTION])
