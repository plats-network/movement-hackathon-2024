import requests
import json
from src.config import settings
import boto3
import requests
class Indexer():
    def __init__(self) -> None:
        self.symbol_to_latest_price = {}
        self.sqs = boto3.client('sqs')

    
    def __get_current_block(self) -> int:
        payload = json.dumps({
            "jsonrpc": "2.0",
            "id": 1,
            "method": "getBlockHeight"
        })
        headers = {'Content-Type': 'application/json'}

        response = requests.request("POST", settings.RPC_URL, headers=headers, data=payload)

        return response.json().get("result")
    

    def __get_price_by_asset(self, asset_symbol: str):
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


    def send_message(self, plat_id, wallet_addr):
        print("Sending message to SQS")
        current_block = self.__get_current_block()
        print("Current block: ", current_block)
        sol_price = self.__get_price_by_asset("SOL")
        print("SOL price: ", sol_price)
        msg = {
            "plat_id": plat_id,
            "wallet_addr": wallet_addr,
            "from_block": current_block - 1_500_000,
            "to_block": current_block,
            "usd_price": f"{sol_price}"
        }
        response = self.sqs.send_message(
            QueueUrl=settings.SQS_QUEUE_URL,
            DelaySeconds=10,
            MessageAttributes={},
            MessageBody=json.dumps(msg)
        )
        
        print("sended: ", response)


if __name__ == "__main__":
    indexer = Indexer()
    indexer.send_message("khaihoang.ID", "2kce2oj6D5mg5GpqXAAKP8wGLZ5BAJ7UydisMhmD3Wqx")