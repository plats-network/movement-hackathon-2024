# --- Open cmt line bellow if run by cmd: python *.py
import sys  # nopep8
sys.path.append(".")  # nopep8
# ----
import traceback
from src.app import TransactionIndexer


def run_forever():
    instance = TransactionIndexer()
    while True:
        try:
            instance()
        except Exception:
            traceback.print_exc()
    return


def test_dns():
    import os
    import requests
    from dotenv import load_dotenv
    load_dotenv()
    backend_url = os.getenv("BACKEND_URL")
    url = f"{backend_url}/api/v1/internal/nillion/user?wallet_addr=GJeggjDKerwUaFpbkL9DnDC2S9C5ez2HEomcb9LjWKJB"
    headers = {'accept': 'application/json'}
    response = requests.post(url, headers=headers, verify=False)
    print("Check dns result: ", response.text)


test_dns()
run_forever()
