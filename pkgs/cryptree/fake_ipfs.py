import hashlib
import json 

class FakeIPFS:
    def __init__(self):
        self.datastore = {}

    def add(self, data, **kwargs):
        """Adds data to the fake IPFS and returns a CID (Content IDentifier)."""
        if isinstance(data, bytes):
            hash = self.add_bytes(data, **kwargs)
        elif isinstance(data, str):
            hash = self.add_str(data, **kwargs)
        elif isinstance(data, dict):
            hash = self.add_json(data, **kwargs)
        else:
            raise ValueError(f"Unsupported data type: {type(data)}")
        self.datastore[hash] = data
        return {"Hash": hash, "Size": str(len(data))}

    def add_bytes(self, data: bytes, **kwargs) -> str:
        """Adds data to the fake IPFS and returns a CID (Content IDentifier)."""
        # Compute a simple CID using SHA256. This isn't the real algorithm IPFS uses, but it'll work for our mock version.
        cid = hashlib.sha256(data).hexdigest()
        self.datastore[cid] = data
        return cid

    def add_str(self, data: str, **kwargs) -> str:
        """Adds data to the fake IPFS and returns a CID (Content IDentifier)."""
        # Compute a simple CID using SHA256. This isn't the real algorithm IPFS uses, but it'll work for our mock version.
        cid = hashlib.sha256(data.encode()).hexdigest()
        self.datastore[cid] = data.encode()
        return cid

    def add_json(self, data: dict, **kwargs) -> str:
        """Adds data to the fake IPFS and returns a CID (Content IDentifier)."""
        # Compute a simple CID using SHA256. This isn't the real algorithm IPFS uses, but it'll work for our mock version.
        cid = hashlib.sha256(json.dumps(data).encode()).hexdigest()
        self.datastore[cid] = json.dumps(data).encode()
        return cid

    def cat(self, cid: str) -> bytes:
        """Returns the data for a given CID. Raises an exception if the CID doesn't exist."""
        if cid not in self.datastore:
            raise ValueError(f"CID {cid} not found in fake IPFS.")
        return self.datastore[cid]

# Example usage:
ipfs = FakeIPFS()

# Add data to our fake IPFS.
data = b"This is some test data."
cid = ipfs.add_bytes(data)

# Retrieve the data using its CID.
retrieved_data = ipfs.cat(cid)
print(retrieved_data.decode('utf-8'))  # Outputs: This is some test data
