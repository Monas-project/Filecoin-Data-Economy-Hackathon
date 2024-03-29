import requests
from io import BytesIO

class IpfsClient:
    def __init__(self, ipfs_daemon_url='http://127.0.0.1:5001'):
        self.ipfs_daemon_url = ipfs_daemon_url

    def add_bytes(self, string_data: bytes):
        url = f'{self.ipfs_daemon_url}/api/v0/add'
        string_bytes = BytesIO(string_data)
        files = {'file': ('string_data.txt', string_bytes)}
        response = requests.post(url, files=files)
        if response.ok:
            ipfs_hash = response.json()['Hash']
            print(f'String uploaded to IPFS with hash: {ipfs_hash}')
            return ipfs_hash
        else:
            print('Error uploading string to IPFS')
            print(response.text)
            return None

    def cat(self, ipfs_hash):
        url = f'{self.ipfs_daemon_url}/api/v0/cat?arg={ipfs_hash}'
        print(f'Fetching data from IPFS with hash: {ipfs_hash}')
        print(f'URL: {url}')
        response = requests.post(url, stream=True)
        if response.status_code == 200:
            data = response.content
            return data
        else:
            print('Error getting data from IPFS')
            print(response.text)
            return None
