import asyncio
import py_nillion_client as nillion
import os

from py_nillion_client import NodeKey, UserKey
from dotenv import load_dotenv
from cosmpy.aerial.client import LedgerClient
from cosmpy.aerial.wallet import LocalWallet
from cosmpy.crypto.keypairs import PrivateKey

from nillion_python_helpers import get_quote_and_pay, create_nillion_client, create_payments_config
from src.config import settings


load_dotenv()
class NillionHealpers:
    def __init__(self) -> None:
        self.cluster_id, self.client, self.payments_client, self.payments_wallet = self.get_client()
        self.permissions = nillion.Permissions.default_for_user(self.client.user_id)
    
    
    def get_client(self):
        cluster_id = settings.NILLION_CLUSTER_ID
        grpc_endpoint = settings.NILLION_NILCHAIN_GRPC
        chain_id = settings.NILLION_NILCHAIN_CHAIN_ID
        seed = settings.NILLION_SEED
        userkey = UserKey.from_seed((seed))
        nodekey = NodeKey.from_seed((seed))
        client = create_nillion_client(userkey, nodekey)

        # Create payments config and set up Nillion wallet with a private key to pay for operations
        payments_config = create_payments_config(chain_id, grpc_endpoint)
        payments_client = LedgerClient(payments_config)
        payments_wallet = LocalWallet(
            PrivateKey(bytes.fromhex(settings.NILLION_NILCHAIN_PRIVATE_KEY_0)),
            prefix="nillion",
        )
        return cluster_id, client, payments_client, payments_wallet
    
    async def store_blob(self, key: str, value: str) -> str:
        # Create a SecretBlob
        secret_name = key
        # create a bytearray from the string using UTF-8 encoding
        secret_value = bytearray(value, "utf-8")
        stored_secret = nillion.NadaValues(
            {
                secret_name: nillion.SecretBlob(secret_value),
            }
        )
        # Get cost quote, then pay for operation to store the secret
        receipt_store = await get_quote_and_pay(
            self.client,
            nillion.Operation.store_values(stored_secret, ttl_days=5),
            self.payments_wallet,
            self.payments_client,
            self.cluster_id,
        )
        # Store a secret, passing in the receipt that shows proof of payment
        store_id = await self.client.store_values(
            self.cluster_id, stored_secret, self.permissions, receipt_store
        )
        return store_id
    
    
    async def store_integer(self, key:str, value: int) -> str:
        # Create a SecretBlob
        secret_name = key
        # create a bytearray from the string using UTF-8 encoding
        secret_value = value
        stored_secret = nillion.NadaValues(
            {
                secret_name: nillion.SecretInteger(secret_value),
            }
        )
        # Get cost quote, then pay for operation to store the secret
        receipt_store = await get_quote_and_pay(
            self.client,
            nillion.Operation.store_values(stored_secret, ttl_days=5),
            self.payments_wallet,
            self.payments_client,
            self.cluster_id,
        )
        # Store a secret, passing in the receipt that shows proof of payment
        store_id = await self.client.store_values(
            self.cluster_id, stored_secret, self.permissions, receipt_store
        )
        return store_id
            
            
    async def retrieve_blob(self, store_id: str, key: str) -> str:
        # Get cost quote, then pay for operation to retrieve the secret
        receipt_retrieve = await get_quote_and_pay(
            self.client,
            nillion.Operation.retrieve_value(),
            self.payments_wallet,
            self.payments_client,
            self.cluster_id,
        )

        result_tuple = await self.client.retrieve_value(
            self.cluster_id, store_id, key, receipt_retrieve
        )
        print(f"The secret name as a uuid is {result_tuple[0]}")

        decoded_secret_value = result_tuple[1].value.decode("utf-8")
        print(f"The secret value is '{decoded_secret_value}'")
        return decoded_secret_value
    
    
    async def retrieve_integer(self, store_id: str) -> str:
        # Get cost quote, then pay for operation to retrieve the secret
        receipt_retrieve = await get_quote_and_pay(
            self.client,
            nillion.Operation.retrieve_value(),
            self.payments_wallet,
            self.payments_client,
            self.cluster_id,
        )

        result_tuple = await self.client.retrieve_value(
            self.cluster_id, store_id, self.secret_name, receipt_retrieve
        )
        print(f"The secret name as a uuid is {result_tuple[0]}")

        decoded_secret_value = result_tuple[1].value
        print(f"The secret value is '{decoded_secret_value}'")
        return decoded_secret_value
    
    