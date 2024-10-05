import json
from src.config import settings
import boto3


class Indexer():
    def __init__(self) -> None:
        self.sqs = boto3.client('sqs')

    def send_message(self, plat_id, wallet_addr):
        msg = {
            "plat_id": plat_id,
            "wallet_addr": wallet_addr
        }
        response = self.sqs.send_message(
            QueueUrl=settings.SQS_QUEUE_URL,
            DelaySeconds=10,
            MessageAttributes={},
            MessageBody=json.dumps(msg)
        )

        print("sended: ", response)


if __name__ == "__main__":
    # import from sys.args
    import sys
    plat_id = sys.argv[1]
    wallet_addr = sys.argv[2]
    print("plat_id: ", plat_id)
    print("wallet_addr: ", wallet_addr)

    indexer = Indexer()
    indexer.send_message(plat_id, wallet_addr)