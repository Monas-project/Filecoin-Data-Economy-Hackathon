from cryptography.fernet import Fernet
from datetime import datetime
import json
from pydantic import BaseModel, Field, parse_obj_as, model_validator, ValidationError
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

class KeyData(BaseModel):
    # TODO: root idをここで持つべきか？
    root_id: Optional[str] = None
    root_key: Optional[bytes] = None
    file_key: Optional[bytes] = None
    # Nodes always have KeyData, so subfolder_key is managed here.
    subfolder_key: Optional[bytes] = None

    @model_validator(mode='after')
    def ensure_at_least_one_key_is_set(cls, values):
        keys_set = [values.root_key, values.file_key, values.subfolder_key]
        if not any(keys_set):
            raise ValueError('At least one of root_key, file_key, subfolder_key must be set.')
        return values

class CrypTreeNode(BaseModel):
    metadata_cid: str
    metadata: Metadata
    keydata: KeyData
    parent: Optional['CrypTreeNode'] = None
    children: List['CrypTreeNode'] = []

    def add_child(self, child: 'CrypTreeNode'):
        self.children.append(child)
        child.parent = self

    # TODO: 本当に@propertyを使うべきか？
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

    # TODO: 何をupdateしたいのかを追加するべきか？
    def re_encrypt_and_update(self, ipfs_client: FakeIPFS):
        if not self.is_leaf:
            decrypted_metadata = self.decrypt_data(self.metadata_cid, ipfs_client)
            decrypted_metadata_dict = json.loads(decrypted_metadata.decode())
            self.metadata = parse_obj_as(Metadata, decrypted_metadata_dict)

            # TODO: functionalize: re-encrypt
            new_subfolder_key = Fernet.generate_key()
            self.keydata.subfolder_key = new_subfolder_key
            cipher_suite = Fernet(new_subfolder_key)
            encrypted_metadata = cipher_suite.encrypt(json.dumps(self.metadata, default=datetime_converter).encode())
            new_metadata_cid = ipfs_client.add_bytes(encrypted_metadata)
            self.metadata_cid = new_metadata_cid

        for child in self.children:
            child.re_encrypt_and_update(ipfs_client)

        if self.is_leaf:
            decrypted_filedata = self.decrypt_data(self.metadata.file_cid, ipfs_client)

            # TODO: functionalize: re-encrypt
            new_file_key = Fernet.generate_key()
            self.keydata.file_key = new_file_key
            cipher_suite = Fernet(new_file_key)
            serialized_filedata = json.dumps(decrypted_filedata, default=datetime_converter).encode()
            encrypted_file_data = cipher_suite.encrypt(serialized_filedata)
            new_file_cid = ipfs_client.add_bytes(encrypted_file_data)
            self.metadata.file_cid = new_file_cid

        # 親ノードが存在する場合は、child_infoを更新
        # if self.parent:
        #     self.parent.update_child_info(self.metadata_cid, new_subfolder_key, ipfs_client)

    # def update_child_info(self, cid: str, new_subfolder_key: bytes, ipfs_client: FakeIPFS):
    #     pass