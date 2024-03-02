

import os
import json
import datetime
from typing import TypedDict
from cryptography.fernet import Fernet
from pkgs.cryptree.fake_ipfs import FakeIPFS, IpfsAddtionResponse
import ipfshttpclient
from .crypt_tree_node import CryptTreeNode

# 例: 環境変数 'TEST_ENV' が 'True' の場合にのみ実際の接続を行う
if os.environ.get('TEST_ENV') != 'True':
    client = ipfshttpclient.connect()
else:
    client = FakeIPFS()  # テスト用の偽のIPFSクライアント

ChildNodeInfo = TypedDict('ChildNodeInfo', {'cid': str, 'sk': bytes})

class CryptTreeNode:
    def __init__(self, metadata, keydata, subfolder_key):
        self.metadata = metadata
        self.keydata = keydata
        self.subfolder_key = subfolder_key

    # ノードを作成する
    @classmethod
    def create_node(cls, name: str, owner_id: str, isDirectory: bool, parent: 'CryptTreeNode' = None, file_data: bytes = None):
        # キーを保存するための辞書 本来は秘匿のために別の場所に保存する
        keydata = {}

        # キーの生成
        subfolder_key = Fernet.generate_key()
        data_key = Fernet.generate_key()
        # backlink_key = Fernet.generate_key()

        # 暗号化オブジェクトの生成
        sk_cipher_suite = Fernet(subfolder_key)
        dk_cipher_suite = Fernet(data_key)
        # bk_cipher_suite = Fernet(backlink_key)

        # メタデータを作成する
        metadata = {}
        metadata["name"] = name
        metadata["owner_id"] = owner_id # ウォレットアドレス
        metadata["creation_date"] = datetime.datetime.now().strftime(
            "%Y/%m/%d %H:%M:%S")

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

        if not isDirectory:
            file_key = Fernet.generate_key()
            keydata["enc_file_key"] = dk_cipher_suite.encrypt(file_key).decode()

            # ファイルだったら暗号化してfile作成
            enc_file_data = Fernet(
                file_key).encrypt(file_data).decode()
            res: IpfsAddtionResponse = client.add_json(enc_file_data)
            file_cid = res.Hash
            metadata["file_cid"] = file_cid
        else:
            metadata["child_info"] = {}
        
        # metadataを暗号化してIPFSにアップロード
        metadata_str = json.dumps(metadata)
        metadata_bytes = metadata_str.encode()
        enc_metadata = dk_cipher_suite.encrypt(metadata_bytes).decode()
        res: IpfsAddtionResponse = client.add_bytes(enc_metadata)
        cid = res.Hash
            

        # ルートノードの場合はroot_idとroot_keyを設定
        if parent is None:
            keydata["root_id"] = cid
            # この保存場所だけ変えたい
            keydata["root_key"] = data_key
        else:
        # ルートノード以外の場合は親ノードの情報を更新
            parent.recursive_update_child_info(cid, subfolder_key)
            keydata["enc_data_key"] = sk_cipher_suite.encrypt(data_key).decode()
        
        # keydata["enc_data_key"] = Fernet(
        #     backlink_key).encrypt(data_key).decode()

        return CryptTreeNode(metadata=metadata, keydata=keydata, subfolder_key=subfolder_key)

    # 親ノードのchild_infoを再起的に更新
    def recursive_update_child_info(self, child_cid: str, subfolder_key: bytes):
        child_info: ChildNodeInfo = {
            "cid": child_cid,
            "sk": subfolder_key
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
        res: IpfsAddtionResponse = client.add_bytes(enc_metadata)
        cid = res.Hash

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