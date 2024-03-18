import datetime
from typing import Optional, Dict, List
from pydantic import BaseModel

class ChildNodeInfo(BaseModel):
    cid: str
    sk: bytes

class CryptreeNodeModel(BaseModel):
    metadata: Dict
    subfolder_key: bytes

class Metadata(BaseModel):
    name: str
    owner_id: str
    creation_date: datetime.datetime
    # parent_info: Optional[str] = None
    child_info: List[ChildNodeInfo] = []
    file_cid: Optional[str] = None  # ファイルCIDはファイルノードでのみ設定されます
    enc_file_key: Optional[bytes] = None  # ファイルノードでのみ設定されます

class GenerateRootNodeRequest(BaseModel):
    name: str
    owner_id: str
    signature: str

class CreateNodeRequest(BaseModel):
    name: str
    owner_id: str
    parent_cid: str
    subfolder_key: str = None  # 親ノードのサブフォルダキー。
    file_data: Optional[str] = None


class FetchNodeRequest(BaseModel):
    cid: str
    subfolder_key: str
    owner_id: str # このCIDのノードの所有者のアドレス