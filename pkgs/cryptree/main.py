from fastapi import Depends, APIRouter, FastAPI, HTTPException, status, Body, Form
from fastapi.security import OAuth2PasswordBearer
from crypt_tree_node import CryptreeNode
from datetime import datetime, timedelta
from jose import jwt, JWTError
from web3 import Web3
from eth_account.messages import encode_defunct
from tableland import Tableland
from model import GenerateRootNodeRequest, CreateNodeRequest, FetchNodeRequest
import os
from dotenv import load_dotenv


# .envファイルの内容を読み込見込む
load_dotenv()

w3 = Web3()
app = FastAPI()
router = APIRouter()

SECRET_KEY = os.environ['API_SECRET_KEY']
ALGORITHM = os.environ['ALGORITHM']
ACCESS_TOKEN_EXPIRE_MINUTES = 30
SECRET_MESSAGE = os.environ['SECRET_MESSAGE']

# トークンの受け取り先URLを指定してOAuth2PasswordBearerインスタンスを作成
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

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
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)  # デフォルトの有効期限
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/users/me")
async def read_users_me(current_user: dict = Depends(get_current_user)):
    return current_user

@router.post("/signup")
async def signup(request: GenerateRootNodeRequest):
    message = encode_defunct(text=SECRET_MESSAGE)
    # 署名されたメッセージからアドレスを復元し、提供されたアドレスと比較
    recovered_address = w3.eth.account.recover_message(message, signature=request.signature)
    if recovered_address.lower() == request.owner_id.lower():
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": request.owner_id}, expires_delta=access_token_expires
        )

        try:
            new_node = CryptreeNode.create_node(name=request.name, owner_id=request.owner_id, isDirectory=False)
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))
        
        return {
            "root_node": {
                "metadata": new_node.metadata,
                "subfolder_key": new_node.subfolder_key
            },
            "access_token": access_token,
            "token_type": "bearer"
        }
    else:
        raise HTTPException(status_code=401, detail="Invalid signature or address")

@router.post("/login")
async def login(signature: str = Body(...), address: str = Body(...)):
    message = encode_defunct(text=SECRET_MESSAGE)
    # 署名されたメッセージからアドレスを復元し、提供されたアドレスと比較
    recovered_address = w3.eth.account.recover_message(message, signature=signature)
    if recovered_address.lower() == address.lower():
        # 有効な署名であればアクセストークンを生成
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": address}, expires_delta=access_token_expires
        )
        root_id, root_key = Tableland.get_root_info(address)

        node = CryptreeNode.get_node(root_id, root_key)
        return {
            "root_node": {
                "metadata": node.metadata,
                "subfolder_key": node.subfolder_key
            },
            "access_token": access_token,
            "token_type": "bearer",
        }
    else:
        raise HTTPException(status_code=401, detail="Invalid signature or address")


@router.post("/create")
async def create(request: CreateNodeRequest, current_user: dict = Depends(get_current_user)):
    parent_cid = request.parent_cid
    parent_subfolder_key = request.subfolder_key.encode()
    current_node = CryptreeNode.get_node(parent_cid, parent_subfolder_key)
    file_data = request.file_data.encode() if request.file_data else None
    try:
        new_node = CryptreeNode.create_node(name=request.name, owner_id=current_user["address"], isDirectory=(file_data is None), parent=current_node, file_data=file_data)
        root_id, _ = Tableland.get_root_info(current_user["address"]);
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    return {
        "metadata": new_node.metadata,
        "subfolder_key": new_node.subfolder_key,
        "root_id": root_id,
    }

@router.post("/fetch")
async def fetch(request: FetchNodeRequest, current_user: dict = Depends(get_current_user)):
    subfolder_key = request.subfolder_key
    cid = request.cid
    address = request.owner_id
    node = CryptreeNode.get_node(cid, subfolder_key);
    root_id, _ = Tableland.get_root_info(address);
    return {
        "metadata": node.metadata,
        "subfolder_key": node.subfolder_key,
        "root_id": root_id,
    }


app.include_router(router, prefix="/api")