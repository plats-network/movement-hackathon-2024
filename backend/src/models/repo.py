from src.config import settings, mdb
from .base import BaseDAO

mUser = BaseDAO(mdb[settings.MONGO_DB][settings.MONGO_USER_COLLECTION])
mPlatApp = BaseDAO(mdb[settings.MONGO_DB][settings.MONGO_PLAT_APP_COLLECTION])