import requests
from web3 import Web3, HTTPProvider
import os
from dotenv import load_dotenv
import json
from functools import lru_cache


# .envファイルの内容を読み込見込む
load_dotenv()

# web3.pyインスタンスの作成
infura_project_id = os.environ['INFURA_PROJECT_ID']
infura_base_url = os.environ['INFURA_BASE_URL']
if infura_project_id is None or infura_base_url is None:
    raise ValueError("No Infura project ID or base URL provided.")
infura_url = f"{infura_base_url}/{infura_project_id}"
web3 = Web3(HTTPProvider(infura_url))
private_key = os.environ['PRIVATE_KEY']
if private_key is None:
    raise ValueError("No private key provided.")
admin_account = web3.eth.account.from_key(private_key).address

# tablelandの設定
address_column = "user_address"
table_id = 8603
chain_id = 80001
root_table_name = f"users_{chain_id}_{table_id}"
tableland_url = 'https://testnets.tableland.network/api/v1/query'

def get_contract():
    table_contract_address =os.environ['TABLE_CONTRACT_ADDRESS']
    if table_contract_address is None:
        raise ValueError("No contract address provided.")
    contract_address = Web3.to_checksum_address(table_contract_address)
    # JSONファイルを読み込む
    with open('tableland_abi.json', 'r') as f:
        data = json.load(f)

    # 読み込んだデータを表示
    contract_abi = data  # コントラクトのABIをここに設定

    # コントラクトのインスタンスを作成
    contract = web3.eth.contract(address=contract_address, abi=contract_abi)
    return contract
    

def insert_root_info(address: str, root_id: str, root_key: bytes):
    # Ethereumネットワークへの接続設定
    contract = get_contract()

    # 実行したいSQL文
    statement = f"INSERT INTO {root_table_name} VALUES ('{address}', '{root_id}', '{root_key.decode()}');"

    # トランザクションの構築
    nonce = web3.eth.get_transaction_count(admin_account)
    transaction = contract.functions.mutate(
        admin_account,
        table_id,
        statement
    ).build_transaction({
        'chainId': chain_id,
        'gas': 2000000,
        'maxPriorityFeePerGas': web3.to_wei('2', 'gwei'),
        'maxFeePerGas': web3.to_wei('50', 'gwei'),
        'nonce': nonce,
    })
    
    print("insert transaction")
    print(transaction)
    # トランザクションの署名
    signed_txn = web3.eth.account.sign_transaction(transaction, private_key)

    # トランザクションの送信
    txn_hash = web3.eth.send_raw_transaction(signed_txn.rawTransaction)

    # トランザクションのハッシュ値を出力
    print(f"Transaction hash: {txn_hash.hex()}")

    # トランザクションのレシートを待つ（オプション）
    txn_receipt = web3.eth.wait_for_transaction_receipt(txn_hash)
    print(f"Transaction receipt: {txn_receipt}")
    return txn_receipt, txn_hash

def update_root_id(address: str, new_cid: str):
    # Ethereumネットワークへの接続設定
    contract = get_contract();

    # 実行したいSQL文
    statement = f"update {root_table_name} set root_id = '{new_cid}' where {address_column} = '{address}';"

    # トランザクションの構築
    nonce = web3.eth.get_transaction_count(admin_account)
    transaction = contract.functions.mutate(
        admin_account,
        table_id,
        statement
    ).build_transaction({
        'chainId': chain_id,
        'gas': 2000000,
        'maxPriorityFeePerGas': web3.to_wei('2', 'gwei'),
        'maxFeePerGas': web3.to_wei('50', 'gwei'),
        'nonce': nonce,
    })
    
    print("update transaction")
    print(transaction)
    # トランザクションの署名
    signed_txn = web3.eth.account.sign_transaction(transaction, private_key)
    
    print("signed_txn")
    print(signed_txn)

    # トランザクションの送信
    txn_hash = web3.eth.send_raw_transaction(signed_txn.rawTransaction)
    print("txn_hash")
    print(txn_hash)

    # トランザクションのハッシュ値を出力
    print(f"Transaction hash: {txn_hash.hex()}")

    # トランザクションのレシートを待つ（オプション）
    txn_receipt = web3.eth.wait_for_transaction_receipt(txn_hash)
    print(f"Transaction receipt: {txn_receipt}")
    return txn_receipt, txn_hash

def get_root_id(address: str) -> list[str, str]:
    
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
    statement = f"select * from {root_table_name} where {address_column} = '{address}';"

    data = {
        "statement": statement,
        "format": "objects",
        "extract": False,
        "unwrap": False
    }

    response = requests.post(tableland_url, headers=headers, json=data)
    rows = response.json()
    if len(rows) == 0:
        raise ValueError("No rows found for the given address.")
    return rows[0]["root_id"]

# root_keyは別のとこから取ってくるけど一旦これで
@lru_cache(maxsize=None)
def get_root_info(address: str) -> list[str, bytes]:
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
    statement = f"select * from {root_table_name} where {address_column} = '{address}';"

    data = {
        "statement": statement,
        "format": "objects",
        "extract": False,
        "unwrap": False
    }

    response = requests.post(tableland_url, headers=headers, json=data)
    rows = response.json()
    if len(rows) == 0:
        raise ValueError("No rows found for the given address.")
    return rows[0]["root_id"], rows[0]["root_key"].encode()

    
