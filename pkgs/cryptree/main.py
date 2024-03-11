from fastapi import FastAPI, HTTPException, Body
import json
import datetime
from cryptography.fernet import Fernet
from crypt_tree_node import CrypTreeNode
from pydantic import BaseModel, Field, validator
from typing import Optional, Dict, List
import base64

app = FastAPI()
@app.get("/")
async def root():
 return {"greeting":"Hello world"}


class CreateNodeRequest(BaseModel):
    name: str
    owner_id: str
    isDirectory: bool
    file_data: Optional[bytes] = None
    parent_cid: Optional[str] = None  # 親ノードのCID。親がいる場合はこれを使用します。

@app.post("/encrypt")
async def create(request: CreateNodeRequest):
    # if request.file_data:
    #     file_data = base64.urlsafe_b64decode(request.file_data)
    # else:
    #     file_data = None
    parent = None

    try:
        new_node = CrypTreeNode.create_node(name=request.name, owner_id=request.owner_id, isDirectory=request.isDirectory, parent=parent, file_data=request.file_data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    print("new_node.metadata")
    print(new_node.metadata)
    return {
        "metadata": new_node.metadata,
        "keydata": new_node.keydata,
        "subfolder_key": new_node.subfolder_key
    }

# @app.post("/decrypt")
# async def access(request ): 
