import { Database } from "@tableland/sdk";
import "dotenv/config";
import { ethers } from "ethers";
import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";

// Example table schema
interface TableData {
  id: number;
  fileHash: string;
  locationId: string;
}

task("getAllTableData", "Prints all table Data")
  .addParam("tablename", "The table's name")
  .setAction(async (taskArgs: any, hre: HardhatRuntimeEnvironment) => {
    // Set global accounts
    const accounts = new ethers.Wallet(process.env.PRIVATE_KEY!);
    // Create a database connection
    const db = new Database({ signer: accounts[0] });

    // sample fileinfo_table_314159_705
    const { results } = await db
      .prepare(`SELECT * FROM ${taskArgs.tablename};`)
      .all<TableData>();
    console.log("results:", results);
  });
