import requests
from src.config import settings
class Movement(object):
    @staticmethod
    def register(plat_id, address, store_ids = ["", "", ""]):
        contract_dns = f"{settings.CONTRACT_SERVICE_DNS}/api/v1/internal/account"
        response = requests.post(contract_dns, json={"platId": plat_id, "address": address, "storeIds": store_ids})
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(response.text)
        
    
    @staticmethod
    def get(plat_id):
        contract_dns = f"{settings.CONTRACT_SERVICE_DNS}/api/v1/internal/account/info"
        json = {
            "platId": plat_id
        }
        print(f"FE::GET::INFO::{plat_id}", json)
        response = requests.post(contract_dns, json=json)
        print(f"FE::GET::INFO::{plat_id}", response.text)
        if response.status_code == 200:
            res = response.json()
            data = res.get('data')
            store_balance = data.get('secret_balance')
            store_volume = data.get('secret_volume')
            store_twitter = data.get('secret_twitter')
            permissions = data.get('permissions')
            return store_balance, store_volume, store_twitter, permissions
        else:
            return [], [], [], []
        
    
    @staticmethod
    def update(plat_id, address, store_balance, store_volume, store_twitter = None):
        '''
            Update store balance, volume and twitter score for a specific address using its `address` and `plat_id` 
        '''
        store_ids = [
            store_balance if store_balance is not None else "",
            store_volume if store_volume is not None else "",
            store_twitter if store_twitter is not None else ""
        ]
        contract_dns = f"{settings.CONTRACT_SERVICE_DNS}/api/v1/internal/account"
        json = {
            "platId": plat_id,
            "address": address, 
            "storeIds": store_ids
        }
        response = requests.put(contract_dns, json=json)
        print(f"CONTRACT::UPDATE::{plat_id}::{address}::{store_balance}::{store_volume}::{store_twitter}::", response.json())
        if response.status_code == 200:
            return response.json()
        else:
            return None
        
        
    @staticmethod
    def add_address(plat_id, address, store_ids = ["", "", ""]):
        '''
            Add address to a specific plat_id using its `address`
        '''
        contract_dns = f"{settings.CONTRACT_SERVICE_DNS}/api/v1/internal/account/identity"
        json = {
            "platId": plat_id,
            "address": address,
            "storeIds": store_ids
        }
        response = requests.put(contract_dns, json=json)
        print(f"CONTRACT::ADD_ACCOUNT::{plat_id}::{address}::", response.json())
        if response.status_code == 200:
            return response.json()
        else:
            print("ERROR::ADD_ACCOUNT::SOLANA_CLIENT::", response.text)
            raise Exception(response.text)
        