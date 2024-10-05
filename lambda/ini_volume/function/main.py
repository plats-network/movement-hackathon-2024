import os
import json
import traceback

import requests

RPC_URL = os.getenv("RPC_URL") or "https://aptos.testnet.suzuka.movementlabs.xyz/v1"
BACKEND_URL = os.getenv("BACKEND_URL") or "https://api.movement.plats.network"
MOVE_DECIMAL = 8


def get_wallet_balance(wallet_addr: str) -> int:
    url = f"{RPC_URL}/accounts/{wallet_addr}/resource/0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>"
    response = requests.get(url, headers={"accept": "application/json", "user-agent": "plat-server"})
    if response.status_code != 200:
        return 0
    return int(response.json().get("data").get("coin").get("value") or 0)


def get_transaction_of_account(wallet_addr: str, limit: int = 100, start: int = 0):
    url = f"{RPC_URL}/accounts/{wallet_addr}/transactions"
    params = {"limit": limit}
    if start:
        params.update({"start": start})
    headers = {"accept": "application/json", "user-agent": "plat-server"}
    response = requests.get(url, params=params, headers=headers)
    if response.status_code != 200:
        return []
    return response.json()


def update_volume_and_balance(
    plat_id: str,
    wallet_addr: str,
    volume: int,
    balance: int
) -> None:
    # get current volume
    secret_volume = 0
    response = requests.get(
        f"{BACKEND_URL}/api/v1/internal/nillion/retrieve",
        headers={
            "accept": "application/json"
        },
        params={
            "plat_id": plat_id,
            "wallet_addr": wallet_addr
        },
        verify=False
    )
    if response.status_code == 200:
        response_json = response.json()
        secret_volume = response_json.get('data').get('secret_volume') or 0
        print("Has current volume: ", secret_volume)
    secret_volume = float(secret_volume)

    # we currently hard code 1 MOVE == 5 USD
    unit_price_usd: float = 5.0

    # calc new volume
    volume_usd = volume * (10 ** MOVE_DECIMAL) * unit_price_usd
    new_volume = secret_volume + volume_usd

    # balance_usd
    balance_usd = balance * (10 ** MOVE_DECIMAL) * unit_price_usd

    # store new value
    new_value = {
        "plat_id": plat_id,
        "wallet_addr": wallet_addr,
        "secret_volume": new_volume,
        "secret_balance": balance_usd
    }
    response = requests.post(
        f"{BACKEND_URL}/api/v1/internal/nillion/store",
        headers={
            "accept": "application/json",
            "Content-Type": "application/json"
        },
        json=new_value,
        verify=False
    )
    print(f"updated volume & balance {plat_id}: {new_value}", response.json())
    return


def sync(wallet_addr: str, plat_id: str):
    transactions = get_transaction_of_account(wallet_addr=wallet_addr, limit=1000)

    # calculate volume
    total_volume: int = 0
    for transaction_data in transactions:
        # only process success transaction
        if not transaction_data.get("success"):
            return

        # get move used (gas)
        gas_used: int = int(transaction_data.get("gas_used") or 0)
        if not gas_used:
            return
        gas_unit_price: int = int(transaction_data.get("gas_used") or 100)
        move_used = gas_used * gas_unit_price
        print("move_used: ", move_used)

        # get move transfer
        move_transfer: int = 0
        if transaction_data.get("payload").get("function") == "0x1::aptos_account::transfer":
            move_transfer = int(transaction_data.get("payload").get("arguments")[1])
        print("move_transfer: ", move_transfer)

        # total volume
        volume: int = abs(move_used) + abs(move_transfer)

        print(f"Updating volume {volume} of address {wallet_addr}")
        total_volume += volume
    print("total volume: ", total_volume)

    # get current balance
    balance = get_wallet_balance(wallet_addr=wallet_addr)
    print("balance: ", balance)

    # update volume and balance
    update_volume_and_balance(
        plat_id=plat_id,
        wallet_addr=wallet_addr,
        volume=total_volume,
        balance=balance
    )
    return


def main(event, context):
    try:
        print("Event: ", event)
        print("Context: ", event)
        payload = json.loads(event.get("Records")[0].get("body"))
        plat_id = payload.get("plat_id")
        wallet_addr = payload.get("wallet_addr")
        sync(wallet_addr=wallet_addr, plat_id=plat_id)
    except Exception:
        traceback.print_exc()
    return
