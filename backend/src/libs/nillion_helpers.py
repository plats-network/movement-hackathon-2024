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
            self.threshold_whale = int(os.getenv("THRESHOLD_WHALE") or 500 * settings.NILLION_MULTIPLIER ) 
            self.threshold_trade = int(os.getenv("THRESHOLD_TRADE") or 1000 * settings.NILLION_MULTIPLIER) 
            self.threshold_kol = int(os.getenv("THRESHOLD_KOL") or 200 * settings.NILLION_MULTIPLIER)
    
    
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
            print(f"Error::{store_id}::{key}:: {e}")
            return -1
    
    
    async def rank(self, secret_balance: int, secret_volume: int, secret_twitter: int, threshold_whale: int, threshold_trade: int, threshold_kol: int):
        try:
            party_name = "Plats"
            program_name = "platscall"
            program_mir_path = os.path.join(os.path.dirname(__file__), f"{program_name}.nada.bin")
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
                    "secret_volumn": nillion.SecretInteger(secret_volume),
                    "secret_balance": nillion.SecretInteger(secret_balance),
                    "secret_twitter": nillion.SecretInteger(secret_twitter),
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
            
        except Exception as e:
            print(f"RANKING::ERROR:: {e}")
            return {
                "result_whale": -1,
                "result_trade": -1,
                "result_twitter": -1
            }
    async def init_rank_program(self):
        party_name = "Plats"
        program_name = "platscall"
        program_mir_path = os.path.join(os.path.dirname(__file__), f"{program_name}.nada.bin")
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
        return party_name, program_id
    
    
    async def init_score_program(self):
        party_name = "Plats"
        program_name = "platscall"
        program_mir_path = os.path.join(os.path.dirname(__file__), f"{program_name}.nada.bin")
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
        return party_name, program_id
        
    async def compute_rank(self, party_name, program_id, store_ids: list):
        try:
            # Create a secret
            # stored_secret = nillion.NadaValues(
            #     {
            #         "secret_volume": nillion.SecretInteger(0),
            #         "secret_balance": nillion.SecretInteger(0),
            #         "secret_twitter": nillion.SecretInteger(0),
            #     }
            # )
            # receipt_store = await get_quote_and_pay(
            #     self.client,
            #     nillion.Operation.store_values(stored_secret, ttl_days=1),
            #     self.payments_wallet,
            #     self.payments_client,
            #     self.cluster_id,
            # )
            # # Store a secret
            # store_id = await self.client.store_values(
            #     self.cluster_id, stored_secret, self.permissions, receipt_store
            # )
            # print("Stored secret. store_id:", store_id)
            # Bind the parties in the computation to the client to set input and output parties
            compute_bindings = nillion.ProgramBindings(program_id)
            compute_bindings.add_input_party(party_name, self.client.party_id)
            compute_bindings.add_output_party(party_name, self.client.party_id)
            
            print(f"Computing using program {program_id}")
            # print(f"Use secret store_id: {store_id}")

            computation_time_secrets = nillion.NadaValues({
                    "threshold_trade": nillion.SecretInteger(self.threshold_trade),
                    "threshold_whale": nillion.SecretInteger(self.threshold_whale),
                    "threshold_kol": nillion.SecretInteger(self.threshold_kol),
                })
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
                store_ids,
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
            
        except Exception as e:
            import traceback
            print(traceback.format_exc())
            print(f"RANKING::ERROR:: {e}")
            return {
                "result_whale": -1,
                "result_trade": -1,
                "result_twitter": -1,
                "result_score": -1
            }
            
            
    async def compute_score(self, party_name, program_id, store_ids: list):
        try:
            # Bind the parties in the computation to the client to set input and output parties
            compute_bindings = nillion.ProgramBindings(program_id)
            compute_bindings.add_input_party(party_name, self.client.party_id)
            compute_bindings.add_output_party(party_name, self.client.party_id)
            
            print(f"Computing using program {program_id}")
            # print(f"Use secret store_id: {store_id}")

            computation_time_secrets = nillion.NadaValues({})
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
                store_ids,
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
            
        except Exception as e:
            import traceback
            print(traceback.format_exc())
            print(f"RANKING::ERROR:: {e}")
            return -1
        
        
    
    def safe_float_conversion(self, value, default=0.0):
        try:
            return float(value)
        except (ValueError, TypeError):
            return default
            
    def format_compute(self, balance, volume, twitter):
        threshold_whale = int(500)
        threshold_trade = int(1000)
        threshold_kol = int(200)
        
        # convert to int
        balance_int = int(self.safe_float_conversion(balance))
        volume_int = int(self.safe_float_conversion(volume))
        twitter_int = int(self.safe_float_conversion(twitter))
        
        print(f"FORMAT::BALANCE::{balance_int}::VOLUME::{volume_int}::TWITTER::{twitter_int}")
        print(f"FORMAT::THRESHOLD::WHALE::{threshold_whale}::TRADE::{threshold_trade}::KOL:{threshold_kol}")
        print(f"FORMAT::EXPECTED::{balance_int > threshold_whale}::{volume_int > threshold_trade}:: {twitter_int > threshold_kol}")
        
        return balance_int, volume_int, twitter_int, threshold_whale, threshold_trade, threshold_kol


async def test_blind_compute():
    nillion = NillionHelpers()
    party_name, program_id = await nillion.init_rank_program()
    balance = "123.5"
    volume = "1500.56123"
    twitter = "-1"
    balance = int(nillion.safe_float_conversion(balance) * 1000)
    volume = int(nillion.safe_float_conversion(volume) * 1000)
    twitter = int(nillion.safe_float_conversion(twitter) * 1000)

    balance_id = await nillion.store_integer("secret_balance", balance)
    volume_id = await nillion.store_integer("secret_volume", volume)
    twitter_id = await nillion.store_integer("secret_twitter", int(twitter))
    print(f"STORED::BALANCE::{balance_id}::VOLUME::{volume_id}::TWITTER::{twitter_id}")
    store_ids = [balance_id, volume_id, twitter_id]
    await nillion.compute_rank(party_name, program_id, store_ids)
    
    # Retrive value
    balance = await nillion.retrieve(balance_id, "secret_balance")
    volume = await nillion.retrieve(volume_id, "secret_volume")
    twitter = await nillion.retrieve(twitter_id, "secret_twitter")
    print(f"RETRIEVED::BALANCE::{balance}::VOLUME::{volume}::TWITTER::{twitter}")
    
    # Threshold
    print(f"THRESHOLD::WHALE::{nillion.threshold_whale}::TRADE::{nillion.threshold_trade}::KOL::{nillion.threshold_kol}")
    
if __name__ == "__main__":
    # nillion_helper = NillionHelpers()
    # balance = "123123.5"
    # volume = "500.56123"
    # twitter = "-1"
    
    # balance_int, volume_int, twitter_int, threshold_whale, threshold_trade, threshold_kol = nillion_helper.format_compute(balance, volume, twitter)

    # # whale =  asyncio.run(nillion_helper.retrieve("33761cb8-0e42-4641-a4d8-d7cd4f8c2bb9", "threshold_whale"))
    # # trade = asyncio.run(nillion_helper.retrieve("33761cb8-0e42-4641-a4d8-d7cd4f8c2bb9", "threshold_trade"))
    # # kol = asyncio.run(nillion_helper.retrieve("33761cb8-0e42-4641-a4d8-d7cd4f8c2bb9", "threshold_kol"))
    # # print(whale, trade, kol)
    # asyncio.run(nillion_helper.rank(secret_balance=balance_int, secret_volume=volume_int, secret_twitter=twitter_int, threshold_trade=threshold_trade, threshold_whale=threshold_whale, threshold_kol=threshold_kol))
    asyncio.run(test_blind_compute())