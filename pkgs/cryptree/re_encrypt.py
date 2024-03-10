from datetime import datetime
from pydantic import BaseModel, Field
from typing import List, Optional

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