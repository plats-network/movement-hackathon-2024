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


run_forever()
