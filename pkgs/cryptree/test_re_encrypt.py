from cryptography.fernet import Fernet
from datetime import datetime
import json

from re_encrypt import CrypTreeNode, Metadata, KeyData

def datetime_converter(o):
    if isinstance(o, datetime):
        return o.isoformat()

def create_node_with_encrypted_metadata(ipfs, name, owner_id, is_leaf=False, file_data=None):
    root_key = Fernet.generate_key()
    file_key = Fernet.generate_key() if is_leaf else None
    subfolder_key = Fernet.generate_key() if not is_leaf else None

    key_data = KeyData(
        # TODO: -> root_key=root_key
        root_key=root_key.decode(),
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