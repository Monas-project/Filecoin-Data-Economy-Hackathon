from base64 import urlsafe_b64encode
from cryptography.fernet import Fernet
from datetime import datetime
import json
from pydantic import BaseModel, Field
from typing import List, Optional

from fake_ipfs import FakeIPFS

# PythonのdatetimeオブジェクトはデフォルトではJSONシリアライズできない
def datetime_converter(o):
    if isinstance(o, datetime):
        return o.isoformat()

class ChildNodeInfo(BaseModel):
    cid: str
    sk: bytes

class Metadata(BaseModel):
    name: str
    owner_id: str
    created_at: datetime = Field(default_factory=datetime.now)
    file_cid: Optional[str] = None
    child_info: List[ChildNodeInfo] = []

# TODO: データ構造を持つクラスとしてこれがベストなのかを考える
class KeyData(BaseModel):
    # TODO: 少なくとも1つのキーを持っていなかったらエラーが出るようにする, root関連がわかっていない
    root_id: Optional[str] = None
    root_key: Optional[str] = None
    file_key: Optional[str] = None
    # Nodeは必ずKeyDataを持つのでsubfolder_keyをここで管理
    subfolder_key: Optional[str] = None

class CrypTreeNode(BaseModel):
    metadata_cid: str
    metadata: Metadata
    keydata: KeyData
    parent: Optional['CrypTreeNode'] = None
    children: List['CrypTreeNode'] = []

    @property
    def is_leaf(self) -> bool:
        # TODO: subfolderのcidがないことを確認する, 子孫がないことを確認する方が良いか
        return self.metadata.file_cid is not None

    def get_encryption_key(self):
        # TODO: root / subfolderの使い分け
        # if self.is_root():
        #     if self.keydata.root_key is None:
        #         raise ValueError("root_key is not set")
        #     return urlsafe_b64decode(self.keydata.root_key)
        if self.is_leaf:
            return self.keydata.file_key
        else:
            return self.keydata.subfolder_key

    def decrypt_data(self, encrypted_data_cid: str, ipfs_client: FakeIPFS) -> bytes:
        key = self.get_encryption_key()
        cipher_suite = Fernet(key)
        decrypted_data = cipher_suite.decrypt(ipfs_client.cat(encrypted_data_cid))
        return decrypted_data

    def re_encrypt_and_update(self, ipfs_client: FakeIPFS):
        if not self.is_leaf:
            decrypted_metadata = self.decrypt_data(self.metadata_cid, ipfs_client)
            decrypted_metadata_dict = json.loads(decrypted_metadata.decode())
            self.metadata = decrypted_metadata_dict
            # ここから再暗号化
            new_subfolder_key = Fernet.generate_key()
            # 新しいsubfolder_keyを更新, update keys
            self.keydata.subfolder_key = urlsafe_b64encode(new_subfolder_key).decode()
            # 再暗号化
            cipher_suite = Fernet(new_subfolder_key)
            encrypted_metadata = cipher_suite.encrypt(json.dumps(self.metadata, default=datetime_converter).encode())
            # 新しいCIDを取得して更新
            new_metadata_cid = ipfs_client.add_bytes(encrypted_metadata)
            self.metadata_cid = new_metadata_cid

        for child in self.children:
            child.re_encrypt_and_update(ipfs_client)

        if self.is_leaf:
            decrypted_filedata = self.decrypt_data(self.metadata_cid, ipfs_client).decode()
            # fileはtextデータを想定
            new_file_key = Fernet.generate_key()
            self.keydata.file_key = urlsafe_b64encode(new_file_key).decode()
            cipher_suite = Fernet(new_file_key)
            encrypted_file_data = cipher_suite.encrypt(decrypted_filedata.encode())
            new_file_cid = ipfs_client.add_bytes(encrypted_file_data)
            self.metadata.file_cid = new_file_cid

        # 親ノードが存在する場合は、child_infoを更新
        if self.parent:
            self.parent.update_child_info(self.metadata.metadata_cid, new_subfolder_key, ipfs_client)

    def update_child_info(self, cid: str, new_subfolder_key: bytes, ipfs_client: FakeIPFS):
        pass