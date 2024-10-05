from typing import Tuple
import traceback

import requests

from src.extensions import redis_client
from src.config import BaseConfig as Conf
import src.decorators as Decorator


class TransactionIndexer(object):
    def __init__(self) -> None:
        self.latest_sync_ledger_version = "plat_movement:indexer:latest_sync_ledger_version"
        # get latest block in redis
        latest_ledger_version = redis_client.get(self.latest_sync_ledger_version)
        self.start: int = 0 if not latest_ledger_version else int(latest_ledger_version)
        self.move_decimal = 8
        return

    def __call__(self):
        num_new_transactions: int = 1
        max_limit: int = 100

        while True:
            # latest ledger version
            if self.start != 0:
                latest_ledger_version = self.__get_newest_ledger_version()
                print("latest_ledger_version: ", latest_ledger_version)
                num_new_transactions = max(abs(latest_ledger_version - self.start), 1)

            # get all transaction
            print(f"Getting transaction from {self.start}, to {self.start + num_new_transactions -1},  limit {num_new_transactions}")

            # loop through chunks
            if self.start != 0:
                ls_limit = [max_limit] * (num_new_transactions // max_limit)
                ls_limit += [num_new_transactions - max_limit * (num_new_transactions // max_limit)]
            else:
                ls_limit = [1]
            print("ls_limit: ", ls_limit)

            for limit in ls_limit:
                transactions, next_start = self.__get_transactions(limit=limit, start=self.start)
                self.start = next_start

                # set latest ledger version to redis
                redis_client.set(self.latest_sync_ledger_version, next_start)

                # process transactions
                for transaction in transactions:
                    try:
                        self.__process_transaction(transaction)
                    except Exception:
                        traceback.print_exc()

                print("num transactions: ", len(transactions))
                print("next start: ", next_start)

    def __get_transactions(self, limit: int = 100, start: int = 0) -> Tuple[list, int]:
        url: str = f"{Conf.RPC_URL}/transactions"
        params = {"limit": limit}
        if start:
            params.update({"start": start})
        headers = {"accept": "application/json", "user-agent": "plat-server"}
        response = requests.get(url, params=params, headers=headers)
        if response.status_code != 200:
            # print(f"Get transaction Error: {response.status_code}, {response.text}")
            return [], 0
        transactions = response.json() or []
        if not transactions:
            return [], 0
        next_start = int(transactions[-1].get("version")) + 1
        return response.json(), next_start

    def __get_newest_ledger_version(self) -> int:
        url: str = f"{Conf.RPC_URL}"
        params = {}
        headers = {"accept": "application/json", "user-agent": "plat-server"}
        response = requests.get(url, headers=headers, params=params)
        if response.status_code != 200:
            # print(f"Get transaction Error: {response.status_code}, {response.text}")
            return 0
        ledger_info = response.json()
        return int(ledger_info.get("ledger_version") or 0)

    def __process_transaction(self, transaction_data: dict):
        # only process success transaction
        if transaction_data.get("success"):
            return

        # get signer addr
        signer_addr: str = transaction_data.get("sender")
        if not signer_addr:
            print("There is no signer_addr of tx", transaction_data.get("hash"))
            return

        # check if this is our users
        plat_id = self.__get_plat_id(signer_addr)
        if not plat_id:
            return

        # get volume (usd)
        gas_used: int = int(transaction_data.get("gas_used") or 0)
        if not gas_used:
            return
        gas_unit_price: int = int(transaction_data.get("gas_used") or 100)
        move_used = gas_used * gas_unit_price

        # get balance
        move_transfer: int = 0
        balance: int = 0
        changes = transaction_data.get("changes")
        for change in changes:
            if change.get("data").get("type") != "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>":
                continue
            if change.get("address") == signer_addr:
                balance: int = int(change.get("data").get("data").get("coin").get("value") or 0)
                continue
            if change.get("address") != signer_addr:
                move_transfer += int(change.get("data").get("data").get("coin").get("value") or 0)

        # total volume
        volume: int = abs(move_used) + abs(move_transfer)

        # update volume and balance
        self.__update_volume_and_balance(
            plat_id=plat_id,
            wallet_addr=signer_addr,
            volume=volume,
            balance=balance
        )
        return

    @Decorator.cache_filter(timeout=10, is_class=True, include_null=True)
    def __get_plat_id(self, wallet_addr: str) -> str:
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

    def __update_volume_and_balance(
        self,
        plat_id: str,
        wallet_addr: str,
        volume: int,
        balance: int
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

        # we currently hard code 1 MOVE == 5 USD
        unit_price_usd: float = 5.0

        # calc new volume
        volume_usd = volume * (10 ** self.move_decimal) * unit_price_usd
        new_volume = secret_volume + volume_usd

        # balance_usd
        balance_usd = balance * (10 ** self.move_decimal) * unit_price_usd

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
