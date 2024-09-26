import logging
import traceback
import time
import json

import boto3
import requests
from solana.rpc.api import Client
from jsonrpcclient import request, parse, Ok

import src.decorators as Decorator
from src.config import BaseConfig as Conf
from src.extensions import redis_client


class TransactionIndexer(object):
    def __init__(self) -> None:
        self.sqs = boto3.client('sqs')
        self.latest_sync_block_key = "plat_fellowship:indexer:latest_sync_block"
        self.chain_base_asset_symbol = "SOL"
        self.chain_base_asset_decimals = 9
        # get latest block in redis
        latest_sync_block = redis_client.get(self.latest_sync_block_key)
        if latest_sync_block:
            latest_sync_block = int(latest_sync_block) + 1
        current_block = self._get_current_block()
        self.start_block = min(latest_sync_block, latest_sync_block) if latest_sync_block else current_block

        self.solana_client: Client = Client(Conf.RPC_URL)
        self.symbol_to_latest_price = {}
        '''
        sample record in DB (legacy)
        {
            "block_timestamp": 1345594949,
            "asset": "SOL"
            "asset_volume": 1343493294,
            "asset_decimals": 9,
            "chain_name": "SOL",
            "chain_id": 900,
            "tx_hash": "0x134354623747834"
            "usd_volume": 134432,
            "unit_price": 23456789,
            "usd_decimals":6
        }
        '''

    def __call__(self):
        while True:
            latest_block = self._get_current_block()
            # loop through blocks
            for block_num in range(self.start_block, latest_block):
                print("block_num: ", block_num)
                blocks = self.solana_client.get_block(block_num, "jsonParsed", max_supported_transaction_version=0)

                # loop through transactions in blocks
                transactions = blocks.value.transactions
                for transaction in transactions:
                    message = transaction.transaction.message
                    signatures = transaction.transaction.signatures

                    # find signer addr
                    signer_addr: str = ""
                    for account_key in message.account_keys:
                        if not account_key.signer:
                            continue
                        signer_addr = str(account_key.pubkey)
                        break
                    if not signer_addr:
                        continue

                    # check if this is our users
                    plat_id = self._get_plat_id(signer_addr)
                    if not plat_id:
                        continue

                    print("signatures: ", signatures)
                    print("signer_addr: ", signer_addr)
                    # get base token volume (SOL)
                    meta = transaction.meta
                    pre_balance = meta.pre_balances
                    post_balance = meta.post_balances

                    print(f"Pre Balances: {pre_balance}")
                    print(f"Post Balances: {post_balance}")

                    total_transaction_volume = abs(pre_balance[0] - post_balance[0])
                    print(total_transaction_volume)
                    # add volume
                    try:
                        self._update_volume_and_balance(
                            plat_id=plat_id,
                            wallet_addr=signer_addr,
                            volume=total_transaction_volume,
                            balance=abs(post_balance[0]),
                            asset_symbol=self.chain_base_asset_symbol
                        )
                    except Exception:
                        traceback.print_exc()
                    print("===" * 30)
                    # get others token volume (coming soon)

                # set latest block to redis
                redis_client.set(self.latest_sync_block_key, block_num)

            time.sleep(1)
            self.start_block = latest_block
        return

    def _get_current_block(self) -> int:
        # get current block
        response = requests.post(
            Conf.RPC_URL,
            json=request("getSlot")
        )
        parsed = parse(response.json())
        if isinstance(parsed, Ok):
            return parsed.result
        else:
            logging.error(parsed.message)

    @Decorator.cache_filter(timeout=60, is_class=True)
    def _get_price_by_asset(self, asset_symbol: str):
        symbol_to_id = {
            "SOL": "solana"
        }
        asset_id: str = symbol_to_id.get(asset_symbol)

        if not asset_id:
            return 0

        url = "https://api.coingecko.com/api/v3/simple/price"
        params = {
            "ids": asset_id,
            "vs_currencies": "usd"
        }

        headers = {
            "accept": "application/json"
        }

        response = requests.get(url, headers=headers, params=params)

        # Check if the request was successful
        if response.status_code != 200:
            print(f"Get Price Error: {response.status_code}, {response.text}")
            return self.symbol_to_latest_price.get(asset_symbol) or 0

        price_in_usd = response.json().get(asset_id).get('usd')
        self.symbol_to_latest_price[asset_symbol] = price_in_usd
        return float(price_in_usd)

    @Decorator.cache_filter(timeout=10, is_class=True, include_null=True)
    def _get_plat_id(self, wallet_addr: str) -> str:
        url = f"{Conf.BACKEND_URL}/api/v1/internal/nillion/user"
        params = {"wallet_addr": wallet_addr}
        headers = {"accept": "application/json"}

        response = requests.post(url, headers=headers, params=params)

        if response.status_code != 200:
            # Print error message
            print(f"Not Plat User: {response.status_code}, {response.text}")
            return ""
        # Print the response content
        response_json = response.json()
        plat_id = response_json.get('data').get('plat_id') or ""
        return plat_id

    def _update_volume_and_balance(
        self,
        plat_id: str,
        wallet_addr: str,
        volume: int,
        balance: int,
        asset_symbol: str = "SOL"
    ) -> None:
        # get current volume
        secret_volume = 0
        response = requests.get(
            f"{Conf.BACKEND_URL}/api/v1/internal/nillion/retrieve",
            headers={
                "accept": "application/json"
            },
            params={
                "plat_id": plat_id,
                "wallet_addr": wallet_addr
            }
        )
        if response.status_code == 200:
            response_json = response.json()
            secret_volume = response_json.get('data').get('secret_volume') or 0
            print("Has current volume: ", secret_volume)

        secret_volume = float(secret_volume)

        # price in usd
        price_in_usd = self._get_price_by_asset(asset_symbol)

        # asset to usd
        display_asset_volume: float = volume * 10 ** (-1 * self.chain_base_asset_decimals)
        display_asset_in_usd_volume: float = display_asset_volume * price_in_usd

        # add new volume
        new_volume: float = abs(secret_volume) + abs(display_asset_in_usd_volume)

        # new balance
        display_balance_sol: float = balance * 10 ** (-1 * self.chain_base_asset_decimals)
        balance_usd: float = display_balance_sol * price_in_usd

        # store new value
        new_value = {
            "plat_id": plat_id,
            "wallet_addr": wallet_addr,
            "secret_volume": new_volume,
            "secret_balance": balance_usd
        }
        response = requests.post(
            f"{Conf.BACKEND_URL}/api/v1/internal/nillion/store",
            headers={
                "accept": "application/json",
                "Content-Type": "application/json"
            },
            json=new_value
        )
        print(f"updated volume & balance {plat_id}: {new_value}", response.json())
        return
