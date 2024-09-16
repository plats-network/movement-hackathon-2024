import os

from dotenv import load_dotenv

load_dotenv()


class SolanaConfig(object):
    RPC_URL = os.getenv("RPC_URL")


class BackendConfig(object):
    BACKEND_URL = os.getenv("BACKEND_URL")


class RedisConfig(object):
    REDIS_HOST = os.getenv('REDIS_HOST')
    REDIS_PORT = os.getenv('REDIS_PORT')
    REDIS_DB = os.getenv('REDIS_DB')
    REDIS_PASSWORD = os.getenv('REDIS_PASSWORD')


class BaseConfig(
    SolanaConfig,
    RedisConfig,
    BackendConfig
):
    ''''''
