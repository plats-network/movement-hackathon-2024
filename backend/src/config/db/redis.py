from src.config import settings

import redis

pool = redis.ConnectionPool(
    host=settings.REDIS_HOST,
    port=settings.REDIS_PORT,
    db=settings.REDIS_DB,
    password=settings.REDIS_PASSWORD,
    retry_on_timeout=settings.REDIS_RETRY_TIMEOUT,
    health_check_interval=settings.REDIS_HEALTH_CHECK_TTL
)

redis_client = redis.Redis(connection_pool=pool)
print("REDIS HOST", settings.REDIS_HOST)