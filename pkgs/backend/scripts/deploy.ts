import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";

async function main() {
  const FileInfo = await ethers.getContractFactory("FileInfo");
  const fileInfo = await FileInfo.deploy();

  await fileInfo.deployed();
  console.log(`Contract deployed to '${fileInfo.address}'.\n`);

  const tableName = await fileInfo.getTableName();
  console.log(`Table name '${tableName}' minted to contract.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
