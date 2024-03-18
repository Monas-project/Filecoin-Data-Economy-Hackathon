from pydantic import Field
from typing import Optional
import os
import json
import datetime
from cryptography.fernet import Fernet
from fake_ipfs import FakeIPFS
import ipfshttpclient
from model import Metadata, ChildNodeInfo, CryptreeNodeModel
from tableland import Tableland

# 例: 環境変数 'TEST_ENV' が 'True' の場合にのみ実際の接続を行う
if os.environ.get('TEST_ENV') != 'True':
    client = ipfshttpclient.connect()
else:
    client = FakeIPFS()  # テスト用の偽のIPFSクライアント

class CryptreeNode(CryptreeNodeModel):
    metadata: Metadata = Field(..., alias="metadata")
    subfolder_key: str = Field(..., alias="subfolder_key")

    # ノードを作成する
    @classmethod
    def create_node(cls, name: str, owner_id: str, isDirectory: bool, parent: Optional['CryptreeNode'] = None, file_data: Optional[bytes] = None) -> 'CryptreeNode':
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
            metadata.file_cid = file_cid
            metadata.enc_file_key = sk_cipher_suite.encrypt(file_key).decode()

        # メタデータを暗号化してIPFSにアップロード
        enc_metadata = sk_cipher_suite.encrypt(metadata.model_dump_json().encode())
        cid = client.add_bytes(enc_metadata)

        # # ルートノードの新規作成かどうかを判定
        if parent is None:
            Tableland.insert_root_info(owner_id, cid, subfolder_key)
        else:
            child_info: ChildNodeInfo = {
                "cid": cid,
                "sk": subfolder_key
            }
            parent.metadata.child_info.append(child_info)
            parent_enc_metadata = parent.encrypt_metadata()
            parent_new_cid = client.add_bytes(parent_enc_metadata)
            root_id, _ = Tableland.get_root_info(owner_id)
            # 親ノードおよびルートノードまでの先祖ノード全てのメタデータを更新
            CryptreeNode.update_all_nodes(parent.metadata.owner_id, parent_new_cid, parent.subfolder_key)
            new_root_id = root_id
            # ルートIDが変更されるまでループ
            while root_id == new_root_id:
                new_root_id, _ = Tableland.get_root_info(owner_id)

        # インスタンスの作成と返却
        return cls(
            metadata=metadata,
            subfolder_key=subfolder_key
        )
    
    def encrypt_metadata(self) -> bytes:
        return Fernet(self.subfolder_key).encrypt(self.metadata.model_dump_json().encode())

    @classmethod
    def update_all_nodes(cls, address: str, new_cid: str, target_subfolder_key: str):
        # ルートノードのから下の階層に降りながら、該当のサブフォルダキーを持つノードを探し、新しいCIDに更新する
        root_id, root_key = Tableland.get_root_info(address)
        root_node = cls.get_node(root_id, root_key)

        # ルートIDの更新
        def update_root_callback(address, new_root_id):
            Tableland.update_root_id(address, new_root_id)

        # ルートIDとターゲットのサブフォルダキーが一致する場合、ルートノードのCIDを更新
        if root_node.subfolder_key == target_subfolder_key:
            update_root_callback(address, new_cid)
        else:
            cls.update_node(root_node, address, target_subfolder_key, new_cid, update_root_callback)

    @classmethod
    def update_node(cls, node: 'CryptreeNode', address: str, target_subfolder_key: str, new_cid: str, callback):
        child_info = node.metadata.child_info
        for index, child in enumerate(child_info):
            child_subfolder_key = child.sk.decode()
            # サブフォルダキーが一致する場合、CIDを更新
            if child_subfolder_key == target_subfolder_key:
                node.metadata.child_info[index].cid = new_cid
                enc_metadata = node.encrypt_metadata()
                new_cid = client.add_bytes(enc_metadata)
                # ここがupdate_root_id or update_all_nodesになる
                callback(address, new_cid)
                break
            else:
                # サブフォルダキーが一致しない場合、さらに子ノードを探索
                child_node = cls.get_node(child.cid, child.sk)
                if len(child_node.metadata.child_info) > 0:
                    def update_all_again_callback(address, new_cid):
                        cls.update_all_nodes(address, new_cid, node.subfolder_key)
                    cls.update_node(child_node, address, target_subfolder_key, new_cid, update_all_again_callback)
        
    @classmethod
    def get_node(cls, cid: str, sk: bytes) -> 'CryptreeNode':
        enc_metadata = client.cat(cid)
        metadata = json.loads(Fernet(sk).decrypt(enc_metadata).decode())
        return CryptreeNode(metadata=metadata, subfolder_key=sk)

    """
    再暗号化(アクセス拒否したときに行う処理)関数
        機能追加
            鍵生成の機能を新しく追加しないといけない

        役割
            Data_key(DK): 階層のフォルダ(メタデータ)の暗号化する
            Subbolder_key(SK): 親フォルダとData_keyを暗号化する
                Data_keyを無視して, 親フォルダと対象フォルダの暗号化
            File_key(FK): FileObjectを暗号化する
            ルートノードは必ずフォルダ

        アルゴリズム:
            1. 特定のパスに行く
                これは引数でファイルまたはフォルダを渡す
            2. 特定のパスから最下層のノードに向かって復号化を行っていく
                リーフノードにむかうまで再帰的に行う
                再帰性はSomaさんのアルゴリズムを参考にする
            3. 最下層ノードに行ったら新しい鍵で暗号化して暗号化されたファイルをIPFSへ保存する
            4. Folderの場合はSub-folder Keyを生成し暗号化
            4'. Fileの場合はFile Keyを生成し、暗号化
            5. 特定ノードへ戻ったら、メタデータの更新とIPFSへ保存をルートノードまで繰り返す
                ※特定ノードからは新しい鍵の生成は必要なし
    """

