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
import random
import base64
import nacl.utils
import os
load_dotenv()
class NillionHelpers:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super(NillionHelpers, cls).__new__(cls, *args, **kwargs)
        return cls._instance

    def __init__(self) -> None:
        if not hasattr(self, 'initialized'):  # Ensure __init__ is only called once
            self.cluster_id, self.client, self.payments_client, self.payments_wallet, self.permissions = self.get_client()
            self.initialized = True
    
    
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
        permissions = nillion.Permissions.default_for_user(client.user_id)
        return cluster_id, client, payments_client, payments_wallet, permissions
    
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
            
            
    async def retrieve(self, store_id: str, key: str) -> str:
        try:
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

            value = result_tuple[1].value
            if isinstance(value, int):
                return value
            return value.decode("utf-8")
        except Exception as e:
            print(f"Error: {e}")
            return None
    
    
    async def rank(self, secret_balance=100, secret_volumn=2000000, secret_twitter=100, threshold_trade=100, threshold_whale=50, threshold_kol=20):
        party_name = "Plats"
        program_name = "platscall"
        bin_dir = os.path.join("..", "nillion", "nada_quickstart_programs", "target")
        
        program_mir_path = os.path.join(bin_dir, f"{program_name}.nada.bin")
        print(f"program_mir_path: {program_mir_path}")
        
        # Pay to store the program and obtain a receipt of the payment
        receipt_store_program = await get_quote_and_pay(
            self.client,
            nillion.Operation.store_program(program_mir_path),
            self.payments_wallet,
            self.payments_client,
            self.cluster_id,
        )
        # Store the program
        action_id = await self.client.store_program(
            self.cluster_id, program_name, program_mir_path, receipt_store_program
        )
        # Create a variable for the program_id, which is the {user_id}/{program_name}. We will need this later
        program_id = f"{self.client.user_id}/{program_name}"
        print("Stored program. action_id:", action_id)
        print("Stored program_id:", program_id)
        
        # Set permissions for the client to compute on the program
        self.permissions.add_compute_permissions({self.client.user_id: {program_id}})
        
        # Create a secret
        stored_secret = nillion.NadaValues(
            {
                "threshold_trade": nillion.Integer(threshold_trade),
                "threshold_whale": nillion.Integer(threshold_whale),
                "threshold_kol": nillion.Integer(threshold_kol),
            }
        )
        receipt_store = await get_quote_and_pay(
            self.client,
            nillion.Operation.store_values(stored_secret, ttl_days=5),
            self.payments_wallet,
            self.payments_client,
            self.cluster_id,
        )
        # Store a secret
        store_id = await self.client.store_values(
            self.cluster_id, stored_secret, self.permissions, receipt_store
        )
        # Bind the parties in the computation to the client to set input and output parties
        compute_bindings = nillion.ProgramBindings(program_id)
        compute_bindings.add_input_party(party_name, self.client.party_id)
        compute_bindings.add_output_party(party_name, self.client.party_id)
        
        print(f"Computing using program {program_id}")
        print(f"Use secret store_id: {store_id}")

        computation_time_secrets = nillion.NadaValues(
            {
                "secret_twitter": nillion.SecretInteger(secret_twitter),
                "secret_balance": nillion.SecretInteger(secret_balance),
                "secret_volumn": nillion.SecretInteger(secret_volumn),
            }
        )
        # Pay for the compute
        receipt_compute = await get_quote_and_pay(
            self.client,
            nillion.Operation.compute(program_id, computation_time_secrets),
            self.payments_wallet,
            self.payments_client,
            self.cluster_id,
        )

        # Compute on the secrets
        compute_id = await self.client.compute(
            self.cluster_id,
            compute_bindings,
            [store_id],
            computation_time_secrets,
            receipt_compute,
        )
            # Print compute result
        print(f"The computation was sent to the network. compute_id: {compute_id}")
        while True:
            compute_event = await self.client.next_compute_event()
            if isinstance(compute_event, nillion.ComputeFinishedEvent):
                print(f"✅  Compute complete for compute_id {compute_event.uuid}")
                print(f"🖥️  The result is {compute_event.result.value}")
                return compute_event.result.value
        
            
    