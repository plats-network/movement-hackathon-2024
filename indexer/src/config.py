import os

from dotenv import load_dotenv

load_dotenv()


class BackendConfig(object):
    BACKEND_URL = os.getenv("BACKEND_URL")


class QueueConfig(object):
    SQS_QUEUE_URL = os.getenv("SQS_QUEUE_URL")


class RedisConfig(object):
    REDIS_HOST = os.getenv('REDIS_HOST')
    REDIS_PORT = os.getenv('REDIS_PORT')
    REDIS_DB = os.getenv('REDIS_DB')
    REDIS_PASSWORD = os.getenv('REDIS_PASSWORD')


class BaseConfig(
    RedisConfig,
    BackendConfig,
    QueueConfig
):
    ''''''
