
from typing import ClassVar, List
import os
from dotenv import load_dotenv
load_dotenv()

class Settings():
    PROJECT_NAME: str = 'Plat-Backend'
    API_V1_STR: str = '/api/v1'
    ALLOWED_ORIGINS: List[str] = ["*"]

    # Database settings
    MONGO_HOST: str = os.getenv('MONGO_HOST', 'localhost')
    MONGO_PORT: int = int(os.getenv('MONGO_PORT', 5432))
    MONGO_USER: str = os.getenv('MONGO_USER', '')
    MONGO_PASSWORD: str = os.getenv('MONGO_PASSWORD', '')
    MONGO_DB: str = os.getenv('MONGO_DB', '')
    MONGO_URI: str = os.getenv('MONGO_URI')
    MONGO_USER_COLLECTION: str = os.getenv('MONGO_USER_COLLECTION')

    REDIS_HOST: str = os.getenv('REDIS_HOST', 'localhost')
    REDIS_PORT: int = int(os.getenv('REDIS_PORT', 6379))
    REDIS_PASSWORD: str = os.getenv('REDIS_PASSWORD', '')
    REDIS_DB: str = os.getenv('REDIS_DB', '')
    REDIS_RETRY_TIMEOUT: bool = os.getenv('REDIS_RETRY_TIMEOUT', 'True').lower() in ('true', '1', 't')
    REDIS_HEALTH_CHECK_TTL: int = int(os.getenv('REDIS_HEALTH_CHECK_TTL', 10))
    REDIS_SUB_CHANNEL: str = os.getenv('REDIS_SUB_CHANNEL')
    REDIS_PUB_CHANNEL: str = os.getenv('REDIS_PUB_CHANNEL')
    REDIS_BROKER_URL: str = os.getenv('REDIS_BROKER_URL')

    # Message queue settings
    MESSAGE_BROKER_URL: str = os.getenv('MESSAGE_BROKER_URL')
    MESSAGE_QUEUE_NAME: str = os.getenv('MESSAGE_QUEUE_NAME')
    MESSAGE_BROKER_USERNAME: str = os.getenv('MESSAGE_BROKER_USERNAME')
    MESSAGE_BROKER_PASSWORD: str = os.getenv('MESSAGE_BROKER_PASSWORD')
    MESSAGE_BROKER_PORT: int = int(os.getenv('MESSAGE_BROKER_PORT'))
    MESSAGE_BROKER_HOST: str = os.getenv('MESSAGE_BROKER_HOST')
    MESSAGE_BROKER_VIRTUAL_HOST: str = os.getenv('MESSAGE_BROKER_VIRTUAL_HOST')

    # Server settings
    MODE: str = os.getenv('MODE', 'local')
    HOST: str = os.getenv('HOST', 'localhost')
    PORT: int = int(os.getenv('PORT', 8000))
    RELOAD: bool = os.getenv('RELOAD', 'False').lower() in ('true', '1', 't')
    
    SECRET_KEY = os.getenv("SECRET_KEY")
    ALGORITHM = os.getenv("ALGORITHM")
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))
    
    # Nillion 
    NILLION_CLUSTER_ID = os.getenv("NILLION_CLUSTER_ID")
    NILLION_BOOTNODE_MULTIADDRESS = os.getenv("NILLION_BOOTNODE_MULTIADDRESS")
    NILLION_BOOTNODE_WEBSOCKET = os.getenv("NILLION_BOOTNODE_WEBSOCKET")
    NILLION_NILCHAIN_CHAIN_ID = os.getenv("NILLION_NILCHAIN_CHAIN_ID")
    NILLION_NILCHAIN_JSON_RPC = os.getenv("NILLION_NILCHAIN_JSON_RPC")
    NILLION_NILCHAIN_REST_API = os.getenv("NILLION_NILCHAIN_REST_API")
    NILLION_NILCHAIN_GRPC = os.getenv("NILLION_NILCHAIN_GRPC")
    NILLION_NILCHAIN_PRIVATE_KEY_0 = os.getenv("NILLION_NILCHAIN_PRIVATE_KEY_0")
    NILLION_SEED = os.getenv("NILLION_SEED")
    
settings = Settings()




