from pydantic import Field
from typing import Optional, Type
import json
from datetime import datetime
from cryptography.fernet import Fernet
from model import Metadata, ChildNodeInfo, CryptreeNodeModel
from tableland import Tableland
import base64
from kms import Kms
from ipfs_client import IpfsClient

class CryptreeNode(CryptreeNodeModel):
    metadata: Metadata = Field(..., alias="metadata")
    subfolder_key: str = Field(..., alias="subfolder_key")
    cid: str = Field(..., alias="cid")

    @property
    def is_leaf(self) -> bool:
        return len(self.metadata.children) == 0

    @property
    def is_file(self) -> bool:
        return len(self.metadata.children) == 1 and self.metadata.children[0].fk is not None

    # ノードを作成する
    @classmethod
    def create_node(cls, name: str, owner_id: str, isDirectory: bool, ipfs_client: Type[IpfsClient], parent: Optional['CryptreeNode'] = None, file_data: Optional[bytes] = None) -> 'CryptreeNode':
        # キー生成
        if parent is None:
            kms_client = Kms()
            subfolder_key = kms_client.create_key(description=f'{owner_id}_{name}', key_usage="ENCRYPT_DECRYPT", customer_master_spec="SYMMETRIC_DEFAULT")
        else:
            subfolder_key = Fernet.generate_key().decode()
        file_key = Fernet.generate_key().decode() if not isDirectory else None

        # メタデータの作成
        metadata = Metadata(
            name=name,
            owner_id=owner_id,
            created_at=datetime.now(),
            children=[]
        )

        if not isDirectory:
            # ファイルの場合、ファイルデータを暗号化
            enc_file_data = CryptreeNode.encrypt(file_key, file_data)
            cid = ipfs_client.add_bytes(enc_file_data)
            file_info = ChildNodeInfo(cid=cid, fk=file_key)
            metadata.children.append(file_info)

        # メタデータを暗号化してIPFSにアップロード
        enc_metadata = CryptreeNode.encrypt(subfolder_key, metadata.model_dump_json().encode())
        cid = ipfs_client.add_bytes(enc_metadata)

        # # ルートノードの新規作成かどうかを判定
        if parent is None:
            Tableland.insert_root_info(owner_id, cid, subfolder_key)
        else:
            child_info = ChildNodeInfo(cid=cid, sk=subfolder_key)
            parent.metadata.children.append(child_info)
            parent_enc_metadata = parent.encrypt_metadata()
            parent_new_cid = ipfs_client.add_bytes(parent_enc_metadata)
            root_id, _ = Tableland.get_root_info(owner_id)
            # 親ノードおよびルートノードまでの先祖ノード全てのメタデータを更新
            CryptreeNode.update_all_nodes(parent.metadata.owner_id, parent_new_cid, parent.subfolder_key, ipfs_client)
            new_root_id = root_id
            # ルートIDが変更されるまでループ
            while root_id == new_root_id:
                new_root_id, _ = Tableland.get_root_info(owner_id)

        # インスタンスの作成と返却
        return cls(
            metadata=metadata,
            subfolder_key=subfolder_key,
            cid=cid,
        )
    
    @classmethod
    def delete_node(cls, node_id: str, ipfs_client: Type[IpfsClient], parent: Optional['CryptreeNode'] = None):
        # Search for the node
        node_to_delete = cls.find_node(node_id, ipfs_client)
        if not node_to_delete:
            raise ValueError(f"Node with ID {node_id} not found")

        if parent is None:
            raise ValueError("Root node cannot be deleted directly.")

        # Remove this node from the parent's child list
        parent.metadata.children = [child for child in parent.metadata.children if child.cid != node_to_delete.cid]

        # Upload and update the parent's metadata to IPFS
        enc_metadata = cls.encrypt(parent.subfolder_key, parent.metadata.model_dump_json().encode())
        parent.cid = ipfs_client.add_bytes(enc_metadata)

        # If the node is a file, delete it from IPFS and exit
        if node_to_delete.is_file:
            ipfs_client.remove(node_to_delete.cid)
            # Reflect the parent's update to the root node
            cls.update_all_nodes(
                address=parent.metadata.owner_id,
                new_cid=parent.cid,
                target_subfolder_key=parent.subfolder_key,
                ipfs_client=ipfs_client
            )
            return

        # If the node is a directory, recursively delete its children
        for child_info in node_to_delete.metadata.children:
            child_node = cls.get_node(child_info.cid, child_info.sk, ipfs_client)
            cls.delete_node(child_node.cid, ipfs_client, node_to_delete)

        # Reflect the parent's update to the root node
        cls.update_all_nodes(
            address=parent.metadata.owner_id,
            new_cid=parent.cid,
            target_subfolder_key=parent.subfolder_key,
            ipfs_client=ipfs_client
        )

    @classmethod
    def find_node(cls, node_id: str, ipfs_client: Type[IpfsClient]) -> Optional['CryptreeNode']:
        if not node_id:
            return None
        try:
            root_id, root_key = Tableland.get_root_info(node_id)
            return cls.get_node(root_id, root_key, ipfs_client)
        except Exception as e:
            return None
    
    def encrypt_metadata(self) -> bytes:
        return CryptreeNode.encrypt(self.subfolder_key, self.metadata.model_dump_json().encode())
    
    @classmethod
    def find_parent(cls, node_id: str, root_node: 'CryptreeNode', ipfs_client: Type[IpfsClient]) -> Optional['CryptreeNode']:
        # Recursive method to find the parent node of a child node
        for child_info in root_node.metadata.children:
            if child_info.cid == node_id:
                return root_node
            child_node = cls.get_node(child_info.cid, child_info.sk, ipfs_client)
            parent = cls.find_parent(node_id, child_node, ipfs_client)
            if parent:
                return parent
        return None

    @classmethod
    def update_all_nodes(cls, address: str, new_cid: str, target_subfolder_key: str, ipfs_client: Type[IpfsClient]):
        # ルートノードのから下の階層に降りながら、該当のサブフォルダキーを持つノードを探し、新しいCIDに更新する
        root_id, root_key = Tableland.get_root_info(address)
        root_node = cls.get_node(root_id, root_key, ipfs_client)

        # ルートIDの更新
        def update_root_callback(address, new_root_id):
            Tableland.update_root_id(address, new_root_id)

        # ルートIDとターゲットのサブフォルダキーが一致する場合、ルートノードのCIDを更新
        if root_node.subfolder_key == target_subfolder_key:
            update_root_callback(address, new_cid)
        else:
            cls.update_node(root_node, address, target_subfolder_key, new_cid, ipfs_client, update_root_callback)

    @classmethod
    def update_node(cls, node: 'CryptreeNode', address: str, target_subfolder_key: str, new_cid: str, ipfs_client: Type[IpfsClient], callback):
        children = node.metadata.children
        for index, child in enumerate(children):
            # fileだった場合はスキップ
            if child.sk is None:
                continue
            child_subfolder_key = child.sk
            # サブフォルダキーが一致する場合、CIDを更新
            if child_subfolder_key == target_subfolder_key:
                node.metadata.children[index].cid = new_cid
                enc_metadata = node.encrypt_metadata()
                new_cid = ipfs_client.add_bytes(enc_metadata)
                # ここがupdate_root_id or update_all_nodesになる
                callback(address, new_cid)
                break
            else:
                # サブフォルダキーが一致しない場合、さらに子ノードを探索
                child_node = cls.get_node(child.cid, child_subfolder_key, ipfs_client)
                if not child_node.is_leaf:
                    def update_all_again_callback(address, new_cid):
                        cls.update_all_nodes(address, new_cid, node.subfolder_key, ipfs_client)
                    cls.update_node(child_node, address, target_subfolder_key, new_cid, ipfs_client, update_all_again_callback)

    @classmethod
    def get_node(cls, cid: str, sk: str, ipfs_client: Type[IpfsClient]) -> 'CryptreeNode':
        enc_metadata = ipfs_client.cat(cid)
        metadata_bytes = CryptreeNode.decrypt(sk, enc_metadata)
        metadata = json.loads(metadata_bytes)
        return cls(metadata=metadata, subfolder_key=sk, cid=cid)

    @staticmethod
    def encrypt(key: str, data: bytes) -> bytes:
        decoded_key = base64.urlsafe_b64decode(key)
        # ルートキーはAWS KMSのKeyIDなので、32バイトのバイナリデータの場合はFernetで暗号化
        if len(decoded_key) == 32:
            return Fernet(key).encrypt(data)
        else:
            kms_client = Kms()
            response = kms_client.encrypt(key, data)
            return response['CiphertextBlob']

    @staticmethod
    def decrypt(key: str, data: bytes) -> bytes:
        decoded_key = base64.urlsafe_b64decode(key)
        if len(decoded_key) == 32:
            return Fernet(key).decrypt(data)
        else:
            kms_client = Kms()
            response = kms_client.decrypt(key, data)
            return response['Plaintext']

    def re_encrypt_and_update(self, parent_node: 'CryptreeNode', ipfs_client: Type[IpfsClient]) -> 'CryptreeNode':
        # 指定したノードの更新前のsubfolder_keyを保持
        old_subfolder_key = self.subfolder_key

        # 指定したノードから最下層のノードに向かって再帰的に再暗号化を行う
        self = self.re_encrypt(ipfs_client)

        # 指定したノードの親ノードのメタデータを更新
        for child in parent_node.metadata.children:
            if child.sk == old_subfolder_key:
                child.cid = self.cid
                child.sk = self.subfolder_key
                break
        enc_parent_metadata = parent_node.encrypt_metadata()
        new_parent_cid = ipfs_client.add_bytes(enc_parent_metadata)

        # 親ノードおよびルートノードまでの先祖ノード全てのメタデータを更新
        CryptreeNode.update_all_nodes(parent_node.metadata.owner_id, new_parent_cid, parent_node.subfolder_key, ipfs_client)

        return self

    def re_encrypt(self, ipfs_client: Type[IpfsClient]) -> 'CryptreeNode':
        if self.is_leaf:
            self.subfolder_key = Fernet.generate_key().decode()
            enc_metadata = self.encrypt_metadata()
            self.cid = ipfs_client.add_bytes(enc_metadata)
            return self

        children = self.metadata.children

        if self.is_file:
            file_info = children[0]
            file_data = CryptreeNode.decrypt(file_info.fk, ipfs_client.cat(file_info.cid))
            file_info.fk = Fernet.generate_key().decode()
            enc_file_data = CryptreeNode.encrypt(file_info.fk, file_data)
            file_info.cid = ipfs_client.add_bytes(enc_file_data)
            self.subfolder_key = Fernet.generate_key().decode()
            enc_metadata = self.encrypt_metadata()
            self.cid = ipfs_client.add_bytes(enc_metadata)
            return self

        for child_info in children:
            child_node = CryptreeNode.get_node(child_info.cid, child_info.sk, ipfs_client)
            new_child_node = child_node.re_encrypt(ipfs_client)
            child_info.cid = new_child_node.cid
            child_info.sk = new_child_node.subfolder_key

        self.subfolder_key = Fernet.generate_key().decode()
        enc_metadata = self.encrypt_metadata()
        self.cid = ipfs_client.add_bytes(enc_metadata)
        return self

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