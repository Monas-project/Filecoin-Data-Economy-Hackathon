from pydantic import BaseModel, Field, validator
from typing import Optional, Dict, List
import os
import json
import datetime
from cryptography.fernet import Fernet
from fake_ipfs import FakeIPFS
import ipfshttpclient
from utils import search_subfolder_key, get_metadata
from tableland import insert_root_info, update_root_id

from model import Metadata, ChildNodeInfo, CryptTreeNodeModel

# 例: 環境変数 'TEST_ENV' が 'True' の場合にのみ実際の接続を行う
if os.environ.get('TEST_ENV') != 'True':
    client = ipfshttpclient.connect()
else:
    client = FakeIPFS()  # テスト用の偽のIPFSクライアント

class CryptTreeNode(CryptTreeNodeModel):
    metadata: Metadata
    subfolder_key: str  # base64エンコードされたサブフォルダキー

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
        metadata = {
            "name": name,
            "owner_id": owner_id,
            "creation_date": datetime.datetime.now().isoformat(),
            "file_cid": None,
            "parent_info": None,
            "child_info": []
        }

        # ファイルの場合、ファイルデータを暗号化
        if file_data and file_cipher_suite:
            enc_file_data = file_cipher_suite.encrypt(file_data)
            file_cid = client.add_bytes(enc_file_data)
            print("file_cid")
            print(file_cid)
            metadata["file_cid"] = file_cid
            metadata["enc_file_key"] = sk_cipher_suite.encrypt(file_key)
        
        if parent is not None:
            child_info: ChildNodeInfo = {
                "cid": cid,
                "sk": subfolder_key
            }
            parent.metadata["child_info"].append(child_info)
            parent_subfolder_key: bytes = parent.subfolder_key
            parent_sk_cipher_suite = Fernet(parent_subfolder_key)
            parent_enc_metadata = parent_sk_cipher_suite.encrypt(json.dumps(parent.metadata).encode())
            parent_cid = client.add_bytes(parent_enc_metadata)
            metadata["parent_info"] = parent_cid

        # メタデータを暗号化してIPFSにアップロード
        enc_metadata = sk_cipher_suite.encrypt(json.dumps(metadata).encode())
        cid = client.add_bytes(enc_metadata)

        # # ルートノードの新規作成かどうかを判定
        if parent is None:
            insert_root_info(cid, subfolder_key)
        else:
            print("parent_info")
            grandparent_cid = parent.metadata.get("parent_info")
            if grandparent_cid is not None:
                parent.recursive_update_ancestor_child_info(parent_cid)
            else:
                txn_receipt, txn_hash = update_root_id(parent_cid, parent.subfolder_key)
                # トランザクションハッシュをログに出力
                print(f"root_id updated: {txn_hash.hex()}")

        # インスタンスの作成と返却
        return cls(
            metadata=metadata,
            subfolder_key=subfolder_key
        )

    # 先祖ノードのchild_infoを再起的に更新
    def recursive_update_ancestor_child_info(self, new_cid: str):
        # cidからsubfolder_keyを取得(実際はroot_idとroot_keyを使って、最上階層から復号化して探してきてる)
        ancestor_cid = self.metadata["parent_info"]
        ancestor_subfolder_key = search_subfolder_key(self.metadata["owner_id"], ancestor_cid)

        ancestor_metadata: Metadata = get_metadata(ancestor_cid, ancestor_subfolder_key)
        ancestor_node: CryptTreeNode = CryptTreeNode.get_parent_node(ancestor_metadata, ancestor_subfolder_key)
        ancestor_child_info = ancestor_metadata["child_info"]
        # 削除するchild_infoのindexと新しいchild_infoを取得
        delete_index = None
        update_child_info: ChildNodeInfo = None

        for index, child in enumerate(ancestor_child_info):
            if child["sk"] == self.subfolder_key:
                delete_index = index
                update_child_info = {
                    "cid": new_cid,
                    "sk": self.subfolder_key
                }
        if delete_index is None:
            raise ValueError("No child_info found for the given subfolder_key.")
        del ancestor_child_info[delete_index]
        ancestor_metadata["child_info"].append(update_child_info)
        enc_ancestor_new_metadata = Fernet(ancestor_subfolder_key).encrypt(json.dumps(ancestor_node.metadata).encode())
        ancestor_new_cid = client.add_bytes(enc_ancestor_new_metadata)
        
        # parent_infoがある場合は再帰的に呼び出す ない場合はroot_idを更新
        if ancestor_metadata.get("parent_info") is not None:
            CryptTreeNode.instance(ancestor_metadata, ancestor_subfolder_key).recursive_update_ancestor_child_info(ancestor_new_cid)
        else:
            txn_receipt, txn_hash = update_root_id(ancestor_metadata["owner_id"], ancestor_new_cid)
            # トランザクションハッシュをログに出力
            print(f"root_id updated: {txn_hash.hex()}")
    
    def get_node(cid: str, sk: bytes) -> 'CryptTreeNode':
        client = ipfshttpclient.connect()
        enc_metadata = client.cat(cid)
        metadata = json.loads(Fernet(sk).decrypt(enc_metadata).decode())
        return CryptTreeNode(metadata=metadata, subfolder_key=sk)
    
    def instance(cls, metadata: Metadata, sk: bytes) -> 'CryptTreeNode':
        return CryptTreeNode(metadata=metadata, subfolder_key=sk)
