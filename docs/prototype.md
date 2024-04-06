# Monas: Decentralized Personal Data Store  

## Introduction 
Monas is a **Decentralized Personal Data Store (PDS)** designed to empower Data controllers with data sovereignty. In the current landscape, technologies like the **Semantic Web**, **Self-Sovereign Identity**, and **Blockchain** are broadening the scope for data interoperability and user-centric data management. This system, utilizing the encrypted data structure of **Cryptree** and **Blockchain technology** to ensure data authenticity, enables users to manage their data while maintaining privacy and ensuring interoperability. Unlike traditional 'solid line data links', Monas proposes a new paradigm of 'dotted line data links', which directly reflect user intent. This approach allows Monas to create a space in cyberspace that protects both autonomy and privacy, offering users the flexibility to solidify these links at their discretion.  

## Prototype Overview

We've developed a prototype that embodies the principles of Monas. This prototype leverages three key components:

- **Decentralized Identifiers (DIDs)**: Unique global identifiers that operate independently of centralized authorities.
- **Cryptree**: A structure that provides intuitive access control, managed by Data controllers.
- **Blockchain**: This serves as the backbone for our state management system, ensuring the authenticity and consistency of data.

Our prototype specifically focuses on enhancing the functionality of read access control and the robust management of system state.


## System configuration　　
![system configuration](https://raw.githubusercontent.com/user/repo/branch/path/to/image.png)  

The prototype consists of **IPFS**, **Tableland**, **Push Protocol**, **Filecoin** and **Polygon**. The features we implemented in this project are as follows  

### Encryption and decryption functions:
When users create folders or upload files in Monas, this data is sent to the Monas Server. Here, processes such as metadata creation and addition, as well as the encryption, decryption, and re-encryption of metadata and files are performed. Once these data processes are completed, the data is stored on IPFS. More details are provided below.
### State Management Function:
In Monas, state management of the PDS is conducted using Tableland and Filecoin, implemented in the useContract file.  
```ts
export type TableData = {
  id: number;
  fileCid: string;
  rootId: string;
};
```
For operation, click [here](https://github.com/Monas-project/Filecoin-Data-Economy-Hackathon/blob/main/pkgs/frontend/hooks/useContract.ts), and contract [here](pkgs/backend/contracts/FileInfo.sol)


By saving the fileCid and rootId as File_info on Tableland, we implement the function to manage states. This feature is used to verify whether a file has been tampered with and whether it is in its most recent state.

### Sharing Feature:
Access-required information is transmitted to permitted users through the Push protocol. This is implemented in the [usePushProtocol](https://github.com/Monas-project/Filecoin-Data-Economy-Hackathon/blob/main/pkgs/frontend/hooks/usePushProtocol.ts).  
To the permitted users, the location stored information such as the CID of the file or folder, the key required for decryption, and the File_info saved by the state management function are shared.
```ts
export const sendNotification = async (
  to: string,
  cid: any,
  key: any,
  fileInfo: any
)
```
Recipients can access and decrypt the shared item using the received CID and Key. Furthermore, by using File_info, it's possible to verify whether the shared item has been altered and whether the overall space is up-to-date.  

## Cryptree Algorithm Explanation
We will explain the Cryptree algorithm that we have implemented.
### What is Cryptree?
Cryptree is an encrypted data structure composed of keys and cryptographic links. It can be understood as a directed graph, with keys as vertices and cryptographic links as edges. A cryptographic link means that when there is a key K1 from which another key K2 exists, everyone who possesses K1 can derive K2. In Cryptree, by connecting these cryptographic links from K2 to K1, we construct the encrypted data structure. In other words, if you know K1, you can recursively derive its descendant keys, Kn. Monas implements this as a core feature.  

Paper link [here](https://ieeexplore.ieee.org/document/4032481)

![cryptree algorithm]()  

The paper proposed five types of keys, but we have implemented using two types of keys: the Subfolder Key and the File Key. Unlike the method in the paper, where keys are generated from other keys, each key exists independently in our implementation. The reason we chose this method is that we believe it's worth dedicating separate time to the algorithm that generates keys from keys. Our current focus is on the implementation of Cryptree. We assume that even if we were to implement a process for generating keys from keys, the sequence of operations would largely remain unchanged. The reason for limiting it to two types of keys is due to the issues with key storage locations and the increased complexity. Our algorithm resolves the issue of key storage locations and presents an intuitively understandable algorithm.

## Algorithm Description
As depicted in the diagram for Monas, there are two types of keys: Subfolder Key and File Key. The Subfolder Key is used for encrypting metadata (folders), while the File Key is used for encrypting files.  

### Metadata:
Below is the metadata content. The child node's CID and key are included in the children.
```py
metadata = Metadata(
            name=name,
            owner_id=owner_id,
            created_at=datetime.now(),
            children=[]
        )
```
- name: The name of folder
- owner_id: The creator
- created_at: Date of creation
- children: Information about descendant nodes  

### Creation of the Root Node:
In Monas, when a user signs up, metadata is created and encrypted by the algorithm and then stored on IPFS. This is accomplished through the create_node function, which performs encryption and determines whether it's a new creation.
```py
def create_node(cls, name: str, owner_id: str, isDirectory: bool, ipfs_client: Client, parent: Optional['CryptreeNode'] = None, file_data: Optional[str] = None) -> 'CryptreeNode':
        # Generate Key
    if parent is None:
        kms_client = Kms()
        subfolder_key = kms_client.create_key(description=f'{owner_id}_{name}', key_usage="ENCRYPT_DECRYPT", customer_master_spec="SYMMETRIC_DEFAULT")
    else:
        subfolder_key = Fernet.generate_key().decode()
    file_key = Fernet.generate_key().decode() if not isDirectory else None

        # Create metadata
        metadata = Metadata(
            name=name,
            owner_id=owner_id,
            created_at=datetime.now(),
            children=[]
        )
    if parent is None:
        Tableland.insert_root_info(owner_id, cid, subfolder_key)
```
Furthermore, for new creations, the generated CID is designated as the Root id, and the key used for encryption is called the root key. This Root id becomes the root node, and by managing this root node and root key, a user can manage all nodes under the root node.
```py
"root_node": {
                "metadata": root_node.metadata,
                "subfolder_key": root_node.subfolder_key,
                "root_id": root_node.cid,
            },
```

### Adding a Folder:
The process is executed using the same function that was used for creating the root node.  

For instance, when a user initiates the process to create a folder under the root folder, the metadata is created, necessary information is written into the metadata, it is encrypted with a newly generated subfolder Key, and then stored on IPFS. Then, by using update_all_nodes, the CID output when saved on IPFS is written into the children of the parent node (in this case, the root node).
```py
def update_all_nodes(cls, address: str, new_cid: str, target_subfolder_key: str, ipfs_client: Client):
    # Descending down the hierarchy from the root node, find the node with the corresponding subfolder key and update it with the new CID.
    root_id, root_key = Tableland.get_root_info(address)
    root_node = cls.get_node(root_id, root_key, ipfs_client)

    # Update root ID
    def update_root_callback(address, new_root_id):
        Tableland.update_root_id(address, new_root_id)

    # Update CID of root node if root ID matches target subfolder key
    if root_node.subfolder_key == target_subfolder_key:
        update_root_callback(address, new_cid)
    else:
        cls.update_node(root_node, address, target_subfolder_key, new_cid, ipfs_client, update_root_callback)
```
### Uploading a File:
The File process uses create_node to determine whether the file is a file or a folder, and if it is a file, it generates a file_key and encrypts the file.
```py
file_key = Fernet.generate_key().decode() if not isDirectory else None

if not isDirectory:
    # For files, encrypt file data
    enc_file_data = CryptreeNode.encrypt(file_key, file_data)
    cid = ipfs_client.add_bytes(enc_file_data)
    file_info = ChildNodeInfo(cid=cid, fk=file_key)
    metadata.children.append(file_info)
```
### Re-encryption Process:
The encryption process occurs when a user wants to deny access. When access is denied, the re-encryption process begins from a specific node selected for access denial via the `re_encrypt_update` function.
```py
def re_encrypt(self, ipfs_client: Client) -> 'CryptreeNode':
    if self.is_leaf:
        self.subfolder_key = Fernet.generate_key().decode()
        enc_metadata = self.encrypt_metadata()
        self.cid = ipfs_client.add_bytes(enc_metadata)
        return self

    children = self.metadata.children

    if self.is_file:
        file_info = children[0]
        file_data = CryptreeNode.decrypt(file_info.fk, ipfs_client.cat(file_info.cid)).decode()
        file_info.fk = Fernet.generate_key().decode()
        enc_file_data = CryptreeNode.encrypt(file_info.fk, file_data.encode())
        file_info.cid = ipfs_client.add_bytes(enc_file_data)
        self.subfolder_key = Fernet.generate_key().decode()
        enc_metadata = self.encrypt_metadata()
        self.cid = ipfs_client.add_bytes(enc_metadata)
        return self

    for child_info in children:
        child_node = CryptreeNode.get_node(child_info.cid, child_info.sk, ipfs_client)
        new_child_node = child_node.re_encrypt(ipfs_client)
        child_info.cid = new_child_node.cid
        child_info.sk = new_child_node.subfolder_key

    self.subfolder_key = Fernet.generate_key().decode()
    enc_metadata = self.encrypt_metadata()
    self.cid = ipfs_client.add_bytes(enc_metadata)
    return self
```
First, decryption is performed from a specific node down to the lowest layer, which, in cases where files are present, refers to files encrypted with a file key. 

Upon reaching the lowest layer, the re_encrypt function generates a new file key for files and a new Subfolder Key for folders, performs encryption, saves it on IPFS, and continues the process up to the specific node.   

Upon reaching the specific node, the process employs the `update_all_nodes` function to refresh the CID recorded in the children of the parent folder, similar to the procedure used when adding a folder. This updating process continues all the way up to the root node, ensuring that all changes are propagated through the hierarchy.  

## Issues and Solutions
During the development of our Monas prototype, we encountered several challenges. Here, we detail these issues and outline our ongoing and proposed solutions.

### Issue: Changing root_id with Node Addition and Re-encryption
- **Problem**: Integrating IPFS results in immutable content addresses. Any changes to metadata or files alter the CID, similar to a hash function.
- **Solution**: We've implemented Tableland to link `root_id` and `root_key` with specific addresses, ensuring consistent identity management despite changes.


### Issue: Single Key Writings to Tableland on the Server Side
- **Problem**: Using a single key for server-side operations is a common vulnerability across many services.
- **Potential Solutions**: Exploring advanced cryptographic solutions such as threshold cryptography, offered by projects like the Threshold network, can enhance security.
- [Threshold network](https://threshold.network/)

### Issue: Key Management
- **Problem**: We currently utilize separate keys for signing and encryption, managed through KMS.
- **Ongoing Solutions**: We are assessing alternative approaches, including threshold cryptography and Multi-Party Computation (MPC). Incorporating Decentralized Identifiers (DID) might allow for simultaneous transactions and encryption if we can verify DID control.
- [Threshold cryptography](https://en.wikipedia.org/wiki/Threshold_cryptosystem)
- [About MPC](https://www.fireblocks.com/what-is-mpc/)

### Issue: Storage of Shared Keys
- **Problem**: In our prototype, keys are shared through the Push Protocol and stored on IPFS.
- **Future Direction**: As we develop a P2P network, deciding on secure storage locations becomes crucial. We propose creating a dedicated directory within the PDS for this purpose, facilitating secure and accessible key management.  

### Issue: Encryption Algorithm Choice
- **Current Approach**: Our prototype does not prioritize specific encryption algorithms.
- **Strategic Shift**: Considering the sensitive nature of stored data, we are evaluating the adoption of quantum-resistant algorithms to future-proof our security.  

### Issue: Optimization of Key Generation
- **Challenge**: Keys are currently generated at each hierarchical layer and stored in parent node metadata, which could limit flexibility.
- **Proposed Solution**: We are exploring deferred key derivation strategies, where keys are generated as needed and not stored, simplifying key management.  
- [Key derivation function wikipedia](https://en.wikipedia.org/wiki/Key_derivation_function)  
- [A cryptographic key generation scheme for multilevel data security](https://www.sciencedirect.com/science/article/abs/pii/016740489090132D)

### Issue: Timing for State Management Transactions in PDS
- **Problem**: Frequent state updates are currently managed solely by PDS administrators, which can be inefficient and costly.
- **Proposed UX Improvement**: Implementing scheduled updates could reduce transaction costs and improve user experience. Employing Merkle trees and Zero-Knowledge proofs could ensure that these operations are performed correctly and securely.

By addressing these challenges, we aim to enhance the functionality, security, and usability of the Monas PDS, paving the way for a more robust and user-friendly platform.  

## Next Phases of Development
As we continue to evolve the Monas platform, our next major objectives are the construction of a Peer-to-Peer (P2P) network and the enhancement of writing capabilities. Currently, the architecture includes a Monas server, but our goal is to enable users to set up their own nodes and engage directly in end-to-end (E2E) encrypted communications as clients. This will facilitate a more decentralized and secure environment.

Additionally, while currently only the PDS administrators can write to the datastore, it is essential to enable writing permissions for approved users. This feature is particularly important as we aim to develop a range of decentralized applications on Monas, such as distributed social networking services. It will also support features like shared key storage and collaborative editing, which require non-administrative users to write within the PDS.

We will focus on defining and designing the access controls for these writing capabilities, ensuring that actions are properly sequenced and managed. This includes tackling the issues mentioned earlier, such as key management and the standardization of data formats.

By implementing these enhancements, we aim to significantly expand the functionality and applicability of the Monas platform, making it a more versatile tool for decentralized data management.