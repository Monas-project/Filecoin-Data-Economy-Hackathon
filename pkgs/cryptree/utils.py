import requests
from cryptography.fernet import Fernet
import ipfshttpclient
from model import Metadata, ChildNodeInfo
from typing import Optional, Dict, List
import json
# from tableland import get_root_id

client = ipfshttpclient.connect()

def get_metadata(cid: str, sk: bytes) -> Metadata:
    enc_metadata = client.cat(cid)
    sk_cipher_suite = Fernet(sk)
    metadata = json.loads(sk_cipher_suite.decrypt(enc_metadata).decode())
    return metadata

def search_subfolder_key(address: str, target_cid: str) -> bytes:
    url = 'https://testnets.tableland.network/api/v1/query'
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
    table_name = "users_80001_8603"
    address_column = "user_address"
    
    statement = f"select * from {table_name} where {address_column} = '{address}';"
    data = {
        "statement": statement,
        "format": "objects",
        "extract": False,
        "unwrap": False
    }

    response = requests.post(url, headers=headers, json=data)
    rows = response.json()
    if len(rows) == 0:
        raise ValueError("No rows found for the given address.")
    root_id = response.json()[0]["root_id"]
    # root_id = get_root_id(address)

    # tablelandに保存しない予定だけど一旦これで
    root_key = (response.json()[0]["root_key"]).encode()
    target_subfolder_key = recursive_search_with_cid(root_key, root_id, target_cid)
    if target_subfolder_key is None:
        raise ValueError("No subfolder key found for the given CID.")
    return target_subfolder_key


def recursive_search_with_cid(sk: bytes, cid: str, target_cid: str) -> Optional[bytes]:
    enc_metadata = client.get(cid)
    metadata = json.loads(Fernet(sk).decrypt(enc_metadata).decode())
    child_info: List[ChildNodeInfo] = metadata.child_info
    if child_info is None or len(child_info) == 0:
        return None
    for child in child_info:
        if child.cid == target_cid:
            return child.sk
        recursive_search_with_cid(child.sk, child.cid, target_cid)
