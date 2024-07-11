import requests
from web3 import Web3, HTTPProvider
import os
from dotenv import load_dotenv
import json
from kms import Kms

class Tableland:
    # クラス変数の初期化
    load_dotenv()
    infura_project_id = os.getenv('INFURA_PROJECT_ID')
    infura_base_url = os.getenv('INFURA_BASE_URL')
    private_key = os.getenv('PRIVATE_KEY')
    table_contract_address = os.getenv('TABLE_CONTRACT_ADDRESS')
    tableland_url = os.getenv('TABLELAND_URL')
    address_column = os.getenv('ADDRESS_COLUMN_NAME')
    table_id = os.getenv('TABLE_ID')
    chain_id = os.getenv('CHAIN_ID')
    root_table_name = f"users_{chain_id}_{table_id}"

    if not (infura_project_id and infura_base_url and private_key and table_contract_address):
        raise ValueError("Environment variables not properly configured.")
    
    infura_url = f"{infura_base_url}/{infura_project_id}"
    web3 = Web3(HTTPProvider(infura_url))
    admin_account = web3.eth.account.from_key(private_key).address
    
    @classmethod
    def get_contract(cls):
        contract_address = Web3.to_checksum_address(cls.table_contract_address)
        with open('tableland_abi.json', 'r') as f:
            contract_abi = json.load(f)
        return cls.web3.eth.contract(address=contract_address, abi=contract_abi)
    
    @classmethod
    def insert_root_info(cls, address: str, root_id: str, root_key: bytes):
        contract = cls.get_contract()
        statement = f"INSERT INTO {cls.root_table_name} VALUES ('{address}', '{root_id}', '{root_key}');"
        nonce = cls.web3.eth.get_transaction_count(cls.admin_account)
        transaction = cls.build_transaction(contract, statement, nonce)
        return cls.send_transaction(transaction)
    
    @classmethod
    def update_root_id(cls, address: str, new_cid: str):
        contract = cls.get_contract()
        statement = f"UPDATE {cls.root_table_name} SET root_id = '{new_cid}' WHERE {cls.address_column} = '{address}';"
        nonce = cls.web3.eth.get_transaction_count(cls.admin_account)
        transaction = cls.build_transaction(contract, statement, nonce)
        return cls.send_transaction(transaction)
    
    @classmethod
    def get_root_info(cls, address: str) -> list[str, bytes]:
        statement = f"SELECT * FROM {cls.root_table_name} WHERE {cls.address_column} = '{address}';"
        response = cls.execute_statement(statement)
        rows = response.json()
        if len(rows) == 0:
            raise ValueError("No rows found for the given address.")
        return rows[0]["root_id"], rows[0]["root_key"]

    @classmethod
    def get(cls, address: str):
        statement = f"SELECT * FROM {cls.root_table_name} WHERE {cls.address_column} = '{address}';"
        response = cls.execute_statement(statement)
        rows = response.json()
        if len(rows) == 0:
            return None
        user = rows[0]
        return user

    @classmethod
    def build_transaction(cls, contract, statement, nonce):
        function = contract.functions.mutate(
                cls.admin_account,
                cls.table_id,
                statement,
            )
        # TODO: gasの値を適切に設定する
        # gas = function.estimate_gas()
        gas = 2000000
        transaction = function.build_transaction({
                'chainId': int(cls.chain_id),
                'gas': gas,
                'maxPriorityFeePerGas': cls.web3.to_wei('2', 'gwei'),
                'maxFeePerGas': cls.web3.to_wei('50', 'gwei'),
                'nonce': nonce,
            },
        )
        return transaction
    
    @classmethod
    def send_transaction(cls, transaction):
        signed_txn = cls.web3.eth.account.sign_transaction(transaction, cls.private_key)
        txn_hash = cls.web3.eth.send_raw_transaction(signed_txn.rawTransaction)
        txn_receipt = cls.web3.eth.wait_for_transaction_receipt(txn_hash)
        return txn_receipt, txn_hash.hex()

    @classmethod
    def execute_statement(cls, statement):
        headers = {'Content-Type': 'application/json', 'Accept': 'application/json'}
        data = {"statement": statement, "format": "objects", "extract": False, "unwrap": False}
        response = requests.post(cls.tableland_url, headers=headers, json=data)
        return response

# 使用例
# Tableland.insert_root_info('0x...', 'Qm...', b'...')
# Tableland.update_root_id('0x...', 'Qm
