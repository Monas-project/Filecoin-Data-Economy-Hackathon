import datetime
from typing import Optional, Dict, List
from pydantic import BaseModel, Field, root_validator
from datetime import datetime

class ChildNodeInfo(BaseModel):
    cid: str
    sk: Optional[str] = None  # Optional field, default is None
    fk: Optional[str] = None  # Optional field, default is None

    @root_validator(pre=True)
    def check_only_one_key(cls, values):
        sk, fk = values.get('sk'), values.get('fk')
        if sk is not None and fk is not None:
            raise ValueError('Only one of "sk" or "fk" should be provided.')
        if sk is None and fk is None:
            raise ValueError('One of "sk" or "fk" must be provided.')
        return values

class Metadata(BaseModel):
    name: str
    owner_id: str
    created_at: datetime = Field(default_factory=datetime.now)
    children: List[ChildNodeInfo] = []

class CryptreeNodeModel(BaseModel):
    metadata: Metadata
    subfolder_key: bytes

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

class FetchNodeResponse(BaseModel):
    metadata: Metadata
    subfolder_key: str
    root_id: str
    file_data: Optional[str] = None # ファイルの場合のみ含まれる


class ReEncryptRequest(BaseModel):
    target_cid: str # Re-encryptするノードのCID
    parent_subfolder_key: str # Re-encryptするノードの親ノードのサブフォルダキー
    parent_cid: str # Re-encryptするノードの親ノードのCID
