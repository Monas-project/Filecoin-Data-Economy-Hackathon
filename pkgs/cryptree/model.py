import datetime
from typing import Optional, Dict, List
from pydantic import BaseModel


class ChildNodeInfo(BaseModel):
    cid: str
    sk: bytes

class CryptTreeNodeModel(BaseModel):
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