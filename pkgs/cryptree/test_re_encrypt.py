import unittest

from cryptography.fernet import Fernet
from datetime import datetime
import json

from fake_ipfs import FakeIPFS
from re_encrypt import CrypTreeNode, Metadata, KeyData


def datetime_converter(o):
    if isinstance(o, datetime):
        return o.isoformat()

def create_node_with_encrypted_metadata(ipfs, name, owner_id, is_leaf=False, file_data=None):
    # TODO: rootのnodeかどうかを確認する
    root_key = Fernet.generate_key()
    file_key = Fernet.generate_key() if is_leaf else None
    subfolder_key = Fernet.generate_key() if not is_leaf else None

    key_data = KeyData(
        root_key=root_key,
        file_key=file_key if file_key else None,
        subfolder_key=subfolder_key if subfolder_key else None,
    )

    metadata = Metadata(
        name=name,
        owner_id=owner_id,
        created_at=datetime.now(),
        file_cid=None,
        child_info=[]
    )

    if is_leaf and file_data:
        cipher_suite = Fernet(file_key)
        encrypted_file_data = cipher_suite.encrypt(file_data)
        file_cid = ipfs.add_bytes(encrypted_file_data)
        metadata.file_cid = file_cid

    cipher_suite = Fernet(subfolder_key if subfolder_key else root_key)
    serialized_metadata = json.dumps(metadata.dict(), default=datetime_converter)
    encoded_metadata = serialized_metadata.encode()
    encrypted_metadata = cipher_suite.encrypt(encoded_metadata)
    metadata_cid = ipfs.add_bytes(encrypted_metadata)

    node = CrypTreeNode(
        metadata_cid=metadata_cid,
        metadata=metadata,
        keydata=key_data,
        # if parent is None, it is root node
        parent=None,
    )
    return node

def display_node_info(node):
    print("----------------")
    print(f"Data of {node.metadata.name}:")
    print("MetaData:")
    print("name:", node.metadata.name)
    print("owner address:", node.metadata.owner_id)
    print("created at:", node.metadata.created_at)
    print("file CID:", node.metadata.file_cid)
    print("child info:", True if node.metadata.child_info else False)
    print("----------------")
    print("KeyData:")
    print("root id:", node.keydata.root_id)
    print("root key:", node.keydata.root_key)
    print("file key:", node.keydata.file_key)
    print("subfolder key:", node.keydata.subfolder_key)
    print("----------------")


class TestCrypTree(unittest.TestCase):
    def setUp(self):
        self.ipfs, self.root, self.child1, self.child1_2, self.leaf1_2_1 = self.setup_tree_structure()

    def setup_tree_structure(self):
        ipfs = FakeIPFS()

        root = create_node_with_encrypted_metadata(ipfs, "root", "user1")
        child1 = create_node_with_encrypted_metadata(ipfs, "child1", "user1")
        child1_2 = create_node_with_encrypted_metadata(ipfs, "child1_2", "user1")
        leaf1_2_1 = create_node_with_encrypted_metadata(ipfs, "leaf1_2_1", "user1", is_leaf=True, file_data=b"dummy data 1")

        # build tree structure
        root.add_child(child1)
        child1.add_child(child1_2)
        child1_2.add_child(leaf1_2_1)

        return ipfs, root, child1, child1_2, leaf1_2_1

    def add_child(self, child: 'CrypTreeNode'):
        self.children.append(child)
        child.parent = self

    # Test: python -m unittest test_re_encrypt.TestCrypTree.test_specific_node_cid_and_subfolder_key_updated
    def test_specific_node_cid_and_subfolder_key_updated(self):
        display_node_info(self.child1)
        original_cid = self.child1.metadata_cid
        original_subfolder_key = self.child1.keydata.subfolder_key
        self.child1.re_encrypt_and_update(self.ipfs)
        self.assertNotEqual(original_cid, self.child1.metadata_cid, "CID should have been updated.")
        self.assertNotEqual(original_subfolder_key, self.child1.keydata.subfolder_key, "Subfolder key should have been updated.")

if __name__ == "__main__":
    unittest.main()
    print("All tests passed successfully.")