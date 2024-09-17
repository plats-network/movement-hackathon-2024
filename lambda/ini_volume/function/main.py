import os
import json

import requests

SOL_DECIMALS = 9
BACKEND_URL = os.getenv("BACKEND_URL")


def get_tx_hashes(wallet_addr: str, from_tx_hash: str = "", limit=100) -> list:
    url = "https://explorer-api.devnet.solana.com/"
    paging_config = {"before": from_tx_hash, "limit": limit} if from_tx_hash else {"limit": limit}
    payload = json.dumps({
        "method": "getSignaturesForAddress",
        "jsonrpc": "2.0",
        "params": [wallet_addr, paging_config],
        "id": "ee1cf2f6-f9bb-495a-9a37-efcec96872be"
    })
    headers = {'content-type': 'application/json'}
    response = requests.request("POST", url, headers=headers, data=payload)
    if response.status_code != 200:
        return []
    results = response.json().get("result") or []
    return [
        {
            "block_time_stamp": result.get("blockTime"),
            "tx_hash": result.get("signature"),
            "block_number": result.get("slot"),
        } for result in results
    ]


def get_tx_volume(signature: str):
    url = "https://explorer-api.devnet.solana.com/"
    payload = json.dumps({
        "method": "getTransaction",
        "jsonrpc": "2.0",
        "params": [
            signature,
            {
                "encoding": "jsonParsed",
                "commitment": "confirmed",
                "maxSupportedTransactionVersion": 0
            }
        ],
        "id": "2ff85a0f-e423-40bf-9455-bcf4e324ff40"
    })
    headers = {'content-type': 'application/json'}
    response = requests.request("POST", url, headers=headers, data=payload)
    if response.status_code != 200:
        return 0
    pre_balances = response.json().get("result").get("meta").get("preBalances")[0]
    post_balances = response.json().get("result").get("meta").get("postBalances")[0]
    volume = abs(abs(pre_balances) - abs(post_balances))
    return volume * 10 ** (-1 * SOL_DECIMALS)


def sync(wallet_addr: str, from_block: int, to_block: int):
    total_volume = 0
    latest_tx_hash = ""
    is_end = False
    while True:
        tx_hashes = get_tx_hashes(wallet_addr, from_tx_hash=latest_tx_hash)

        if not tx_hashes:
            break

        for tx_hash_obj in tx_hashes:
            block_number = tx_hash_obj.get("block_number")

            if block_number >= to_block:
                continue

            if block_number <= from_block:
                is_end = True
                break

            tx_hash = tx_hash_obj.get("tx_hash")
            volume = get_tx_volume(tx_hash)
            # TODO: sol to usd
            total_volume += volume

        if is_end:
            break

        latest_tx_hash = tx_hashes[-1].get("tx_hash")

    return total_volume


def add_volume(plat_id: str, asset_symbol: str, volume: int) -> None:
    key = f"volume_{asset_symbol}_in_usd"

    # get current volume
    current_volume = 0
    response = requests.get(
        f"{BACKEND_URL}/api/v1/internal/nillion/retrieve",
        headers={
            "accept": "application/json"
        },
        params={
            "plat_id": plat_id,
            "key": key
        }
    )
    if response.status_code == 200:
        response_json = response.json()
        current_volume = response_json.get('data').get('value') or 0
        print("Has current volume: ", current_volume)

    current_volume = float(current_volume)

    # add new volume
    new_volume: float = abs(current_volume) + abs(volume)

    # store new value
    response = requests.post(
        f"{BACKEND_URL}/api/v1/internal/nillion/store",
        headers={
            "accept": "application/json",
            "Content-Type": "application/json"
        },
        json={
            "plat_id": plat_id,
            "key": key,
            "value": f"{new_volume}"
        }
    )
    print(f"added volume {plat_id}: ", response.json())
    return


def main():
    plat_id = "odinhoang"
    my_addr = "H3xebErnGPc5JsFyjaDGYh4MN3rH1VBEzxsWu1bf5ryz"
    from_block = 325635587
    to_block = 325684254
    # get volume
    volume = sync(wallet_addr=my_addr, from_block=from_block, to_block=to_block)
    # add volume
    add_volume(plat_id=plat_id, asset_symbol="SOL", volume=volume)
    return


main()
