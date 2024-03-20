import FileInfoContractJson from "@/contracts/artifacts/contracts/FileInfo.sol/FileInfo.json";
import {
  FILEINFO_CONTRACT_ADDRESS,
  RPC_URL,
  TABLE_NAME,
} from "@/utils/constants";
import { Database } from "@tableland/sdk";
import { Contract, ethers } from "ethers";

// table schema
interface TableData {
  id: number;
  fileHash: string;
  locationId: string;
}

var contractAddress: string;
var contract: Contract;

/**
 * crateContract Instance method
 */
export const createContract = () => {
  // create provider
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  // コントラクトのインスタンスを生成
  contract = new ethers.Contract(
    FILEINFO_CONTRACT_ADDRESS,
    FileInfoContractJson.abi,
    provider
  );
  // set contract address
  contractAddress = FILEINFO_CONTRACT_ADDRESS;
};

/**
 * ※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※
 * setter methods
 * ※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※
 */

/**
 * delete table method
 */
export const deleteTableData = async (id: any) => {
  // delete
  const tx = await contract.deleteFileInfo(id);
  console.log("tx hash:", tx.hash);
};

/**
 * insert table method
 */
export const insertTableData = async (rootId: any, fileCid: any) => {
  // insert
  const tx = await contract.insertFileInfo(rootId, fileCid);
  console.log("tx hash:", tx.hash);
};

/**
 * update table method
 */
export const updateTableData = async (id: any, rootId: any, fileCid: any) => {
  // update
  const tx = await contract.updateFileInfo(id, rootId, fileCid);
  console.log("tx hash:", tx.hash);
};

/**
 * set RootHash method
 */
export const setRootHash = async (newRootHash: any) => {
  const tx = await contract.setRootHash(newRootHash);
  console.log("tx hash:", tx.hash);
};

/**
 * ※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※
 * getter methods
 * ※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※
 */

/**
 * getRootHash method
 * @returns
 */
export const getRootHash = async () => {
  const rootHash = await contract.getRootHash();
  return rootHash;
};

/**
 * getAllTable method
 * @returns
 */
export const getAllTableData = async (signer: any) => {
  // Create a database connection
  const db = new Database({ signer: signer });

  // get all table data
  const { results } = await db
    .prepare(`SELECT * FROM ${TABLE_NAME};`)
    .all<TableData>();

  return results;
};
