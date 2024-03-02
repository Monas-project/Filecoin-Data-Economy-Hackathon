from fastapi import FastAPI
import json
import datetime
from cryptography.fernet import Fernet
from pkgs.cryptree.crypt_tree_node import CryptTreeNode
app = FastAPI()
@app.get("/")
async def root():
 return {"greeting":"Hello world"}


@app.get("/encrypt")
async def create(name: str, owner_id: str, parent: CryptTreeNode = None, isDirectory: bool = False, file_data: bytes = None):
    new_node = CryptTreeNode.create_node(name, owner_id, isDirectory, parent, file_data)
    return {"metadata": new_node.metadata, "keydata": new_node.keydata, "subfolder_key": new_node.subfolder_key}