# Monas: Decentralized Personal Data Store  

## Introduction 
Monas is a **Decentralized Personal Data Store (PDS)** designed to empower Data controllers with data sovereignty. In the current landscape, technologies like the **Semantic Web**, **Self-Sovereign Identity**, and **Blockchain** are broadening the scope for data interoperability and user-centric data management. This system, utilizing the encrypted data structure of **Cryptree** and **Blockchain technology** to ensure data authenticity, enables users to manage their data while maintaining privacy and ensuring interoperability. Unlike traditional 'solid line data links', Monas proposes a new paradigm of 'dotted line data links', which directly reflect user intent. This approach allows Monas to create a space in cyberspace that protects both autonomy and privacy, offering users the flexibility to solidify these links at their discretion.  

## Prototype Description
We have implemented a prototype of Monas as described above. As outlined in the link, Monas consists of a **DID, a global identifier that does not rely on third parties**, **Cryptree, which allows Data controllers intuitive access control**, and **a Blockchain for state management to maintain data authenticity and consistency**. In this prototype implementation, we focused **on read access control** and **state management**.  

## System configuration　　
![system configuration]()  
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
