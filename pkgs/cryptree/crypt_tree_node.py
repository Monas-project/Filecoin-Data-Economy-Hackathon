from pydantic import BaseModel, Field, validator
from typing import Optional, Dict, List
import os
import json
import datetime
from cryptography.fernet import Fernet
from fake_ipfs import FakeIPFS
import ipfshttpclient
import base64

# 例: 環境変数 'TEST_ENV' が 'True' の場合にのみ実際の接続を行う
if os.environ.get('TEST_ENV') != 'True':
    client = ipfshttpclient.connect()
else:
    client = FakeIPFS()  # テスト用の偽のIPFSクライアント

class ChildNodeInfo(BaseModel):
    cid: str
    sk: bytes

class CryptTreeNode(BaseModel):
    metadata: Dict
    keydata: Dict
    subfolder_key: bytes

class Metadata(BaseModel):
    name: str
    owner_id: str
    creation_date: datetime.datetime
    file_cid: Optional[str] = None  # ファイルCIDはファイルノードでのみ設定されます
    child_info: Optional[List[ChildNodeInfo]] = None
class KeyData(BaseModel):
    root_id: Optional[str] = None
    root_key: Optional[str] = None  # base64エンコードされたルートキー
    enc_file_key: Optional[str] = None
    enc_data_key: Optional[str] = None

class CryptTreeNode(BaseModel):
    metadata: Metadata
    # キーを保存するための辞書 本来は秘匿のために別の場所に保存する
    keydata: KeyData
    subfolder_key: str  # base64エンコードされたサブフォルダキー

    # @validator('subfolder_key', pre=True, always=True)
    # def validate_subfolder_key(cls, v):
    #     if isinstance(v, bytes):
    #         return base64.urlsafe_b64encode(v).decode()
    #     return v

    # ノードを作成する
    @classmethod
    def create_node(cls, name: str, owner_id: str, isDirectory: bool, parent: Optional['CryptTreeNode'] = None, file_data: Optional[bytes] = None) -> 'CryptTreeNode':
        # キー生成
        subfolder_key = Fernet.generate_key()
        data_key = Fernet.generate_key()
        file_key = Fernet.generate_key() if not isDirectory else None

        # 暗号化スイートの初期化
        dk_cipher_suite = Fernet(data_key)
        sk_cipher_suite = Fernet(subfolder_key)
        file_cipher_suite = Fernet(file_key) if file_key else None

        # メタデータの作成
        metadata = {
            "name": name,
            "owner_id": owner_id,
            "creation_date": datetime.datetime.now().isoformat(),
            "file_cid": None,
            "child_info": []
        }

        keydata = {
            "root_id": None,
            "root_key": None,
            "enc_file_key": None,
            "enc_data_key": None
        }

        # ファイルの場合、ファイルデータを暗号化
        if file_data and file_cipher_suite:
            enc_file_data = file_cipher_suite.encrypt(file_data).decode()
            file_cid = client.add_json(enc_file_data)
            print("file_cid")
            print(file_cid)
            metadata["file_cid"] = file_cid
            keydata["enc_file_key"] = dk_cipher_suite.encrypt(file_key).decode()

        # keydata["enc_backlink_key"] = Fernet(
        #     subfolder_key).encrypt(backlink_key).decode()

        # つまりルートノード以外の場合？
        # 今回は親subfolder_keyで子subfolder_keyを暗号化しない
        # if parent is not None:
        #     parent_info = json.dumps({
        #         "name": parent.metadata["name"],
        #     }).encode()
        #     # metadata["parent"] = Fernet(backlink_key).encrypt(parent_info).decode()
        #     metadata["parent"] = parent.metadata["cid"]
        #     keydata["enc_subfolder_key"] = Fernet(
        #         parent.subfolder_key).encrypt(subfolder_key).decode()

        # メタデータを暗号化してIPFSにアップロード
        enc_metadata = dk_cipher_suite.encrypt(json.dumps(metadata).encode())
        cid = client.add_bytes(enc_metadata)

        # ルートノードかどうかに応じてkeydataを設定
        if parent is None:
            keydata["root_id"] = cid
            keydata["root_key"] = base64.urlsafe_b64encode(data_key).decode()
        else:
            keydata["enc_data_key"] = sk_cipher_suite.encrypt(data_key).decode()
            parent.recursive_update_child_info(cid, subfolder_key)
        
        # keydata["enc_data_key"] = Fernet(
        #     backlink_key).encrypt(data_key).decode()

        # インスタンスの作成と返却
        return cls(
            metadata=metadata,
            keydata=keydata,
            subfolder_key=base64.urlsafe_b64encode(subfolder_key).decode()
        )

    # 親ノードのchild_infoを再起的に更新
    def recursive_update_child_info(self, child_cid: str, child_subfolder_key: bytes):
        child_info: ChildNodeInfo = {
            "cid": child_cid,
            "sk": child_subfolder_key
        }
        self.metadata["child_info"] = child_info

        is_root = (self.keydata.get("root_id") is not None) and (self.keydata.get("root_key") is not None)

        # ルートノードの時はroot_keyをdata_keyに設定
        if is_root:
            data_key_bytes = self.keydata.get("root_key")
        else:
        # ルートノード以外の時は親subfolder_keyでdata_keyを復号化
            enc_data_key: bytes = self.keydata["enc_data_key"]
            parent_subfolder_key = self.parent.metadata.child_info["sk"]
            data_key_bytes = Fernet(parent_subfolder_key).decrypt(enc_data_key.encode())
        
        # メタデータをDKで暗号化してIPFSにアップロード
        dk_cipher_suite = Fernet(data_key_bytes)
        metadata_bytes = json.dumps(self.metadata).encode().encode()
        enc_metadata = dk_cipher_suite.encrypt(metadata_bytes).decode()
        cid = client.add_bytes(enc_metadata)

        # ルートノードにぶち当たるまで再起的に呼び出して、メタデータを更新
        if is_root:
            self.keydata["root_id"] = cid
        else:
            parent_subfolder_key = self.parent.metadata["child_info"]["subfolder_key"]
            self.parent.update_child_info(cid, parent_subfolder_key)

    # def get_encrypted_metadata(self):
    #     bk = Fernet(self.subfolder_key).decrypt(
    #         self.keydata["enc_backlink_key"])
    #     dk = Fernet(bk).decrypt(self.keydata["enc_data_key"])
    #     f = Fernet(dk)
    #     return f.encrypt(json.dumps(self.metadata).encode()).decode()

    # def add_node(self, cid, name, path, is_directory):
    #     if "child" not in self.metadata:
    #         raise Exception("Only directory node can call this method")

    #     self.metadata["child"][path] = {
    #         "metadata_cid": cid,
    #         "name": name,
    #         "is_directory": is_directory
    #     }

    # def reencrypt(self, parent_sk: bytes, new_sk: bytes = None):
    #     if new_sk is None:
    #         new_sk = Fernet.generate_key()
    #     new_bk = Fernet.generate_key()
    #     new_dk = Fernet.generate_key()

    #     keydata = {}
    #     keydata["enc_subfolder_key"] = Fernet(
    #         parent_sk).encrypt(new_sk).decode()
    #     keydata["enc_backlink_key"] = Fernet(new_sk).encrypt(new_bk).decode()
    #     keydata["enc_data_key"] = Fernet(new_bk).encrypt(new_dk).decode()

    #     self.keydata = keydata
    #     self.subfolder_key = new_sk
    

    # def get_decrypt_key(self):
    #     # 復号化に必要なキーを取得
    #     bk = Fernet(self.subfolder_key).decrypt(
    #         self.keydata["enc_backlink_key"].encode())
    #     dk = Fernet(bk).decrypt(self.keydata["enc_data_key"].encode())

    #     # Fernetオブジェクトを使用してメタデータを復号化
    #     f = Fernet(dk)
    #     return f