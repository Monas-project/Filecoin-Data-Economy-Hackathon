import FileInfoContractJson from "@/contracts/artifacts/contracts/FileInfo.sol/FileInfo.json";
import {
  FILEINFO_CONTRACT_ADDRESS,
  RPC_URL,
  TABLE_NAME,
} from "@/utils/constants";
import { Database } from "@tableland/sdk";
import { Contract, ethers } from "ethers";

// table schema
export type TableData = {
  id: number;
  fileHash: string;
  locationId: string;
};

var contractAddress: string;
var contract: Contract;
var db: Database;

/**
 * crateContract Instance method
 */
export const createContract = (signer: any) => {
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
  // create db instance
  db = new Database({ signer: signer });
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
  try {
    // delete
    const { meta: write } = await db
      .prepare(`DELETE FROM ${TABLE_NAME} WHERE id = ?;`)
      .bind(id)
      .run();
    await write.txn?.wait();
    console.log("Tx Hash:", write.txn?.transactionHash);
  } catch (err) {
    console.error("err:", err);
  }
};

/**
 * insert table method
 */
export const insertTableData = async (rootId: any, fileCid: any) => {
  try {
    // insert
    const { meta: write } = await db
      .prepare(`INSERT INTO ${TABLE_NAME} (rootId, fileCid) VALUES (?, ?);`)
      .bind(rootId, fileCid)
      .run();
    await write.txn?.wait();
    console.log("Tx Hash:", write.txn?.transactionHash);
  } catch (err) {
    console.error("err:", err);
  }
};

/**
 * update table method
 */
export const updateTableData = async (id: any, rootId: any, fileCid: any) => {
  try {
    // update
    const { meta: write } = await db
      .prepare(`UPDATE ${TABLE_NAME} SET rootId = ?, fileCid = ? WHERE id = ?;`)
      .bind(rootId, fileCid, id)
      .run();
    await write.txn?.wait();
    console.log("Tx Hash:", write.txn?.transactionHash);
  } catch (err) {
    console.error("err:", err);
  }
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
export const getAllTableData = async () => {
  // get all table data
  const { results } = await db
    .prepare(`SELECT * FROM ${TABLE_NAME};`)
    .all<TableData>();

  return results;
};
