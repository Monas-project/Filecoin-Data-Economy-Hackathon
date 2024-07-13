from fastapi import Depends, APIRouter, FastAPI, HTTPException, status, Body, Form, Depends, HTTPException, Form, File, UploadFile
from typing import Optional
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from crypt_tree_node import CryptreeNode
from datetime import datetime, timedelta
from jose import jwt, JWTError
from web3 import Web3
from eth_account.messages import encode_defunct
from tableland import Tableland
from model import GenerateRootNodeRequest, FetchNodeRequest, FetchNodeResponse, ReEncryptRequest, LoginRequest
import os
from dotenv import load_dotenv
from fake_ipfs import FakeIPFS
from ipfs_client import IpfsClient
import base64


# .envファイルの内容を読み込見込む
load_dotenv()

# 例: 環境変数 'ENV' が 'True' の場合にのみ実際の接続を行う
ipfs_host = os.getenv("IPFS_HOST", "localhost")
ipfs_port = os.getenv("IPFS_PORT", "5001")

allow_origin = os.getenv("ALLOW_ORIGIN", "http://localhost:3000")
if os.environ.get('ENV') == 'development':
    ipfs_client = IpfsClient(f'http://{ipfs_host}:{ipfs_port}')
elif os.environ.get('ENV') == 'test':
    ipfs_client = FakeIPFS()  # テスト用の偽のIPFSクライアント
else:
    ipfs_client = IpfsClient(f'https://{ipfs_host}:{ipfs_port}')

w3 = Web3()
app = FastAPI()
router = APIRouter()

SECRET_KEY = os.environ['API_SECRET_KEY']
ALGORITHM = os.environ['ALGORITHM']
ACCESS_TOKEN_EXPIRE_MINUTES = 30
SECRET_MESSAGE = os.environ['SECRET_MESSAGE']

# トークンの受け取り先URLを指定してOAuth2PasswordBearerインスタンスを作成
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[allow_origin],  # フロントエンドのURLを許可
    allow_credentials=True,
    allow_methods=["*"],  # すべてのHTTPメソッドを許可
    allow_headers=["*"],  # すべてのHTTPヘッダーを許可
)

def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        address: str = payload.get("sub")
        if address is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    root_id, root_key = Tableland.get_root_info(address)
    return {"address": address, "root_id": root_id, "root_key": root_key}

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now() + expires_delta
    else:
        expire = datetime.now() + timedelta(minutes=60)  # デフォルトの有効期限
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.get("/hello")
async def hello():
    res = ipfs_client.add_bytes(b"Hello, World!!!!!")
    return {"message": res}

@router.post("/users/me")
async def read_users_me(current_user: dict = Depends(get_current_user)):
    return current_user

@router.post("/user/exists")
async def user_exists(request: LoginRequest = Body(...)):
    message = encode_defunct(text=SECRET_MESSAGE)
    # 署名されたメッセージからアドレスを復元し、提供されたアドレスと比較
    recovered_address = w3.eth.account.recover_message(message, signature=request.signature)
    if recovered_address.lower() == request.address.lower():
        user = Tableland.get(request.address)
        return {"exists": user is not None}

@router.post("/signup")
async def signup(request: GenerateRootNodeRequest = Body(...)):
    user = Tableland.get(request.owner_id);
    if user:
        raise HTTPException(status_code=400, detail="User already exists")

    message = encode_defunct(text=SECRET_MESSAGE)
    # 署名されたメッセージからアドレスを復元し、提供されたアドレスと比較
    recovered_address = w3.eth.account.recover_message(message, signature=request.signature)
    if recovered_address.lower() == request.owner_id.lower():
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": request.owner_id}, expires_delta=access_token_expires
        )

        try:
            root_node = CryptreeNode.create_node(name=request.name, owner_id=request.owner_id, isDirectory=True, ipfs_client=ipfs_client)
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

        return {
            "root_node": {
                "metadata": root_node.metadata,
                "subfolder_key": root_node.subfolder_key,
                "root_id": root_node.cid,
            },
            "access_token": access_token,
            "token_type": "bearer",
        }
    else:
        raise HTTPException(status_code=401, detail="Invalid signature or address")

@router.post("/login")
async def login(request: LoginRequest = Body(...)):
    message = encode_defunct(text=SECRET_MESSAGE)
    address = request.address
    signature = request.signature
    # 署名されたメッセージからアドレスを復元し、提供されたアドレスと比較
    recovered_address = w3.eth.account.recover_message(message, signature=signature)
    if recovered_address.lower() == address.lower():
        # 有効な署名であればアクセストークンを生成
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": address}, expires_delta=access_token_expires
        )
        root_id, root_key = Tableland.get_root_info(address)

        node = CryptreeNode.get_node(root_id, root_key, ipfs_client)
        return {
            "root_node": {
                "metadata": node.metadata,
                "subfolder_key": node.subfolder_key,
                "root_id": node.cid,
            },
            "access_token": access_token,
            "token_type": "bearer",
        }
    else:
        raise HTTPException(status_code=401, detail="Invalid signature or address")

@router.delete("/delete")
async def delete_node(
    node_id: str = Form(...),  # Retrieve the node ID to be deleted from the form data
    current_user: dict = Depends(get_current_user)  # Retrieve current user information
):
    try:
        # Retrieve the root node of the current user
        root_node = CryptreeNode.get_node(current_user["root_id"], current_user["root_key"], ipfs_client)
        # Find the parent node of the node to be deleted
        parent_node = CryptreeNode.find_parent(node_id, root_node, ipfs_client)
        # Return 400 error if parent node is not found
        if not parent_node:
            raise HTTPException(status_code=400, detail="Parent node not found")
        # Delete the specified node
        CryptreeNode.delete_node(node_id, ipfs_client, parent_node)
        # Return success message
        return {"message": "Node deleted successfully"}
    except Exception as e:
        # Return 500 error if an exception occurs
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/create")
async def create(
    name: str = Form(...),
    owner_id: str = Form(...),
    parent_cid: str = Form(...),
    subfolder_key: Optional[str] = Form(None),
    file_data: Optional[UploadFile] = File(None),
    current_user: dict = Depends(get_current_user),
):
    parent_subfolder_key = subfolder_key
    current_node = CryptreeNode.get_node(parent_cid, parent_subfolder_key, ipfs_client)
    # file_data = request.file_data.encode() if request.file_data else None
    file_data = await file_data.read() if file_data else None
    try:
        new_node = CryptreeNode.create_node(name=name, owner_id=current_user["address"], isDirectory=(file_data is None), parent=current_node, file_data=file_data, ipfs_client=ipfs_client)
        root_id, _ = Tableland.get_root_info(current_user["address"]);
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail=str(e))
    return {
        "metadata": new_node.metadata,
        "cid": new_node.cid,
        "subfolder_key": new_node.subfolder_key,
        "root_id": root_id,
    }

@router.post("/fetch")
async def fetch(request: FetchNodeRequest = Body(...), current_user: dict = Depends(get_current_user)) -> FetchNodeResponse:
    subfolder_key = request.subfolder_key
    cid = request.cid
    node = CryptreeNode.get_node(cid, subfolder_key, ipfs_client)
    children = node.metadata.children
    root_id, _ = Tableland.get_root_info(node.metadata.owner_id)
    response = FetchNodeResponse(
        metadata=node.metadata,
        subfolder_key=node.subfolder_key,
        root_id=root_id,
    )
    # fileの場合、ファイルデータを復号
    if len(children) > 0:
        if len(children) == 1 and children[0].fk is not None:
            enc_file_data = ipfs_client.cat(children[0].cid)
            file_data = CryptreeNode.decrypt(children[0].fk, enc_file_data)
            response.file_data = base64.b64encode(file_data).decode('utf-8')
        else:
            response.children = [CryptreeNode.get_node(child.cid, child.sk if child.sk is not None else child.fk, ipfs_client) for child in children]
        for child in response.children:
            if len(child.metadata.children) == 1 and child.metadata.children[0].fk is not None:
                enc_file_data = ipfs_client.cat(child.metadata.children[0].cid)
                file_data = CryptreeNode.decrypt(child.metadata.children[0].fk, enc_file_data)
                child.file_data = base64.b64encode(file_data).decode('utf-8')
    return response

@router.post("/re-encrypt")
async def re_encrypt(request: ReEncryptRequest = Body(...), current_user: dict = Depends(get_current_user)):
    parent_node = CryptreeNode.get_node(request.parent_cid, request.parent_subfolder_key, ipfs_client)
    # Re-encryptするノードの情報を取得
    target_info = next((child for child in parent_node.metadata.children if child.cid == request.target_cid), None)
    # CryptreeNodeクラスのget_nodeメソッドを使って、Re-encryptするノードを取得
    target_node = CryptreeNode.get_node(request.target_cid, target_info.sk, ipfs_client)
    # Re-encrypt処理を実行
    new_node = target_node.re_encrypt_and_update(parent_node, ipfs_client)

    root_id = current_user['root_id']
    new_root_id, _ = Tableland.get_root_info(current_user["address"])
    # 新しいルートIDになるまでループ
    while root_id == new_root_id:
        new_root_id, _ = Tableland.get_root_info(current_user["address"])

    return {
        "new_subfolder_key": new_node.subfolder_key,
        "new_cid": new_node.cid,
        "root_id": new_root_id,
    }


app.include_router(router, prefix="/api")