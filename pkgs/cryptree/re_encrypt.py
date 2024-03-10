from cryptography.fernet import Fernet
from datetime import datetime
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

class CryptTreeNode(BaseModel):
    metadata_cid: str
    metadata: Metadata
    keydata: KeyData
    parent: Optional['CryptTreeNode'] = None
    children: List['CryptTreeNode'] = []

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