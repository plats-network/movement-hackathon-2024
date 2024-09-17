from solana.rpc.async_api import AsyncClient
from src.config import settings
from solana.rpc.commitment import Confirmed
from solders.pubkey import Pubkey
from anchorpy import Program, Provider, Wallet
import json
class Solana(object):
    def __init__(self) -> None:
        self.client = AsyncClient(settings.SOLANA_RPC_URL, commitment=Confirmed)
        self.program_id = Pubkey.from_string(settings.SOLANA_PROGRAM_ID)
        self.wallet = Wallet()
        self.provider = Provider(self.client, self.wallet)
        self.idl = self.__get_idl()
        self.program = Program(self.idl, self.program_id, self.provider)
        

    def __get_idl(self):
        with open("idl.json", "r") as f:
            idl = json.load(f)
        return idl
        

    async def get_counter(self):
        counter_pda, _ = Pubkey.find_program_address(
        [bytes("counter", "utf-8")],
        self.program.program_id
        )
        counter_account = await self.program.account["counter"].fetch(counter_pda)
        print(f"Counter value: {counter_account.count}")

        # Close the connection
        await self.client.is_connected()
        
        return counter_account.count

if __name__ == "__main__":
    solana = Solana()
    print(solana.get_counter())