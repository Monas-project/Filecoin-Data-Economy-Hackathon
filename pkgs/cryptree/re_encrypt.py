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