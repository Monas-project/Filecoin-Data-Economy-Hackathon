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
async def encrypt(name: str, owner_id: str, parent: CryptTreeNode = None, isDirectory: bool = False, file_data: bytes = None):
    node = CryptTreeNode.create_node(name, owner_id, isDirectory, parent, file_data)
    
    return {"greeting":"encrypt"}