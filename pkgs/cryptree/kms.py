
import boto3
from botocore.exceptions import ClientError
from dotenv import load_dotenv
import os
load_dotenv()

class Kms:
    def __init__(self, region_name='ap-northeast-1', access_key=os.getenv('AWS_ACCESS_KEY_ID'), secret_key=os.getenv('AWS_SECRET_ACCESS_KEY')):
        if os.getenv('ENV') != 'prod':
            print("Local環境で実行しています。")
            self.client = boto3.client(
                'kms',
                endpoint_url='http://localstack:4566',
                region_name=region_name,
                aws_access_key_id='test',  # ダミーのアクセスキー
                aws_secret_access_key='test'  # ダミーのシークレットキー
            )
        else:
            self.client = boto3.client(
                'kms',
                region_name=region_name,
                aws_access_key_id=access_key,
                aws_secret_access_key=secret_key,
            )

    def create_key(self, description, key_usage="ENCRYPT_DECRYPT", customer_master_spec="SYMMETRIC_DEFAULT")-> str:
        response = self.client.create_key(
            Description=description,
            KeyUsage=key_usage,
            CustomerMasterKeySpec=customer_master_spec
        )
        return response['KeyMetadata']['KeyId']
        

    def encrypt(self, key_id: str, plaintext: bytes):
        try:
            return self.client.encrypt(
                KeyId=key_id,
                Plaintext=plaintext
            )
        except ClientError as e:
            # エラー処理
            if e.response['Error']['Code'] == 'NotFoundException':
                print("指定されたキーが存在しないか、アクセスできません。")
                raise ValueError("指定されたキーが存在しないか、アクセスできません。") from e
            else:
                # その他のエラー処理
                print(e.response['Error']['Message'])
                raise e
    
    def decrypt(self, key_id: str, ciphertext_blob: bytes):
        try:
            return self.client.decrypt(
                KeyId=key_id,
                CiphertextBlob=ciphertext_blob
            )
        except ClientError as e:
            # エラー処理
            if e.response['Error']['Code'] == 'NotFoundException':
                print("指定されたキーが存在しないか、アクセスできません。")
                raise ValueError("指定されたキーが存在しないか、アクセスできません。") from e
            else:
                # その他のエラー処理
                print(e.response['Error']['Message'])
                raise e