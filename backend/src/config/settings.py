
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
    MONGO_PLAT_APP_COLLECTION: str = os.getenv('MONGO_PLAT_APP_COLLECTION') or "app"

    REDIS_HOST: str = os.getenv('REDIS_HOST', 'localhost')
    REDIS_PORT: int = int(os.getenv('REDIS_PORT', 6379))
    REDIS_PASSWORD: str = os.getenv('REDIS_PASSWORD', '')
    REDIS_DB: str = os.getenv('REDIS_DB', '')
    REDIS_RETRY_TIMEOUT: bool = os.getenv('REDIS_RETRY_TIMEOUT', 'True').lower() in ('true', '1', 't')
    REDIS_HEALTH_CHECK_TTL: int = int(os.getenv('REDIS_HEALTH_CHECK_TTL', 10))
    REDIS_SUB_CHANNEL: str = os.getenv('REDIS_SUB_CHANNEL')
    REDIS_PUB_CHANNEL: str = os.getenv('REDIS_PUB_CHANNEL')
    REDIS_BROKER_URL: str = os.getenv('REDIS_BROKER_URL')

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
    
    # OAuth
    TWITTER_CLIENT_ID = os.getenv("TWITTER_CLIENT_ID")
    TWITTER_CLIENT_SECRET = os.getenv("TWITTER_CLIENT_SECRET")
    TWITTER_REDIRECT_URI = os.getenv("TWITTER_REDIRECT_URI")
    TWITTER_AUTHORIZATION_URL: str = "https://twitter.com/i/oauth2/authorize"
    TWITTER_TOKEN_URL: str = "https://api.twitter.com/oauth2/token"
    
    # OAuth 1.0
    TWITTER_CONSUMER_KEY = os.getenv("TWITTER_CONSUMER_KEY")
    TWITTER_CONSUMER_SECRET = os.getenv("TWITTER_CONSUMER_SECRET")
    FRONTEND_URL = os.getenv("FRONTEND_URL")
    
    # Twitter
    TWITTER_API_KEY = os.getenv("TWITTER_API_KEY")
    TWITTER_API_URL = os.getenv("TWITTER_API_URL")
    TWITTER_ACCESS_TOKEN = os.getenv("TWITTER_ACCESS_TOKEN") or ""
    TWITTER_ACCESS_TOKEN_SECRET = os.getenv("TWITTER_ACCESS_TOKEN_SECRET") or ""
    
    # Solana
    SOLANA_RPC_URL = os.getenv("SOLANA_RPC_URL")
    SOLANA_PROGRAM_ID = os.getenv("SOLANA_PROGRAM_ID")
    CONTRACT_SERVICE_DNS = os.getenv("CONTRACT_SERVICE_DNS")
    
    SQS_QUEUE_URL = "https://sqs.ap-southeast-1.amazonaws.com/905418230863/plat-fellowship-dev-ini-volume"
    RPC_URL = os.getenv("RPC_URL") or "https://api.devnet.solana.com"
    
    NILLION_MULTIPLIER = int(os.getenv("NILLION_MULTIPLIER") or 1000)
    
settings = Settings()




