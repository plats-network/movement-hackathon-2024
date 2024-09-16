import redis
from src.config import BaseConfig as Conf

pool = redis.ConnectionPool(
    host=Conf.REDIS_HOST,
    port=Conf.REDIS_PORT,
    # db=Conf.REDIS_DB,
    password=Conf.REDIS_PASSWORD,
    retry_on_timeout=True,
    health_check_interval=10
)
redis_client = redis.Redis(connection_pool=pool)
