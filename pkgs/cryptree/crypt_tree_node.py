from pydantic import BaseModel, Field, validator
from typing import Optional, Dict, List
import os
import json
import datetime
from cryptography.fernet import Fernet
from fake_ipfs import FakeIPFS
import ipfshttpclient
from tableland import insert_root_info, update_root_id, get_root_info

from model import Metadata, ChildNodeInfo, CryptTreeNodeModel

# 例: 環境変数 'TEST_ENV' が 'True' の場合にのみ実際の接続を行う
if os.environ.get('TEST_ENV') != 'True':
    client = ipfshttpclient.connect()
else:
    client = FakeIPFS()  # テスト用の偽のIPFSクライアント

class CryptTreeNode(CryptTreeNodeModel):
    metadata: Metadata = Field(..., alias="metadata")
    subfolder_key: str = Field(..., alias="subfolder_key")

    # ノードを作成する
    @classmethod
    def create_node(cls, name: str, owner_id: str, isDirectory: bool, parent: Optional['CryptTreeNode'] = None, file_data: Optional[bytes] = None) -> 'CryptTreeNode':
        # キー生成
        subfolder_key = Fernet.generate_key()
        file_key = Fernet.generate_key() if not isDirectory else None

        # 暗号化スイートの初期化
        sk_cipher_suite = Fernet(subfolder_key)
        file_cipher_suite = Fernet(file_key) if file_key else None

        # メタデータの作成
        metadata = Metadata(
            name=name,
            owner_id=owner_id,
            creation_date=datetime.datetime.now(),
            file_cid=None,
            child_info=[]
        )

        # ファイルの場合、ファイルデータを暗号化
        if file_data and file_cipher_suite:
            enc_file_data = file_cipher_suite.encrypt(file_data)
            file_cid = client.add_bytes(enc_file_data)
            print("file_cid")
            print(file_cid)
            metadata.file_cid = file_cid
            metadata.enc_file_key = sk_cipher_suite.encrypt(file_key).decode()
        
        print("metadata")
        print(metadata)

        # メタデータを暗号化してIPFSにアップロード
        enc_metadata = sk_cipher_suite.encrypt(metadata.model_dump_json().encode())
        print("enc_metadata")
        print(enc_metadata)
        cid = client.add_bytes(enc_metadata)

        # # ルートノードの新規作成かどうかを判定
        if parent is None:
            print("insert_root_info")
            insert_root_info(owner_id, cid, subfolder_key)
        else:
            print("parent.metadata")
            child_info: ChildNodeInfo = {
                "cid": cid,
                "sk": subfolder_key
            }
            parent.metadata.child_info.append(child_info)
            parent_enc_metadata = parent.encrypt_metadata()
            print("parent_enc_metadata")
            print(parent_enc_metadata)
            parent_new_cid = client.add_bytes(parent_enc_metadata)
            print("parent_new_cid")
            print(parent_new_cid)
            CryptTreeNode.update_all_nodes(parent.metadata.owner_id, parent_new_cid, parent.subfolder_key)
            print("done")

        # インスタンスの作成と返却
        return cls(
            metadata=metadata,
            subfolder_key=subfolder_key
        )
    
    def encrypt_metadata(self) -> bytes:
        print("self.subfolder_key")
        print(self.subfolder_key)
        print("self.metadata")
        print(self.metadata)
        print("self.metadata.model_dump_json()")
        print(self.metadata.model_dump_json())
        return Fernet(self.subfolder_key).encrypt(self.metadata.model_dump_json().encode())

    @classmethod
    def update_all_nodes(cls, address: str, new_cid: str, target_subfolder_key: bytes):
        root_id, root_key = get_root_info(address)
        root_node_enc_metadata = client.cat(root_id)
        root_node_metadata = json.loads(Fernet(root_key).decrypt(root_node_enc_metadata).decode())
        root_node = cls.get_node(root_node_metadata, root_key)
        print("root_node")

        def update_root_callback(address, new_root_id):
            update_root_id(address, new_root_id)
            
        print("update_node")
        cls.update_node(root_node, address, target_subfolder_key, new_cid, update_root_callback)

    @classmethod
    def update_node(cls, node, address: str, target_subfolder_key: bytes, new_cid: str, callback):
        child_info = node.metadata["child_info"]
        for index, child in enumerate(child_info):
            child_node = cls.get_node(child["cid"], child["sk"])
            if child_node.subfolder_key == target_subfolder_key:
                child_node.metadata["child_info"][index]["cid"] = new_cid
                # enc_metadata = Fernet(child_node.subfolder_key).encrypt(json.dumps(child_node.metadata).encode())
                enc_metadata = child_node.encrypt_metadata()
                new_cid = client.add_bytes(enc_metadata)
                callback(address, new_cid)
                break
            else:
                if len(child_node.metadata["child_info"]) > 0:
                    def update_all_again_callback(address, new_cid):
                        cls.update_all_nodes(address, new_cid, child_node.subfolder_key)
                    cls.update_node(child_node, address, target_subfolder_key, new_cid, update_all_again_callback)
        
    @classmethod
    def get_node(cls, cid: str, sk: bytes) -> 'CryptTreeNode':
        client = ipfshttpclient.connect()
        enc_metadata = client.cat(cid)
        metadata = json.loads(Fernet(sk).decrypt(enc_metadata).decode())
        return CryptTreeNode(metadata=metadata, subfolder_key=sk)

