import "@nomiclabs/hardhat-ethers";
import { ethers, network } from "hardhat";
import { writeContractAddress } from "../helper/contractsJsonHelper";

async function main() {
  // set Contract Address json
  // resetContractAddressesJson({ network: network.name });

  const FileInfo = await ethers.getContractFactory("FileInfo");
  const fileInfo = await FileInfo.deploy();

  await fileInfo.deployed();
  console.log(`Contract deployed to '${fileInfo.address}'.\n`);

  const tableName = await fileInfo.getTableName();
  console.log(`Table name '${tableName}' minted to contract.`);

  const tableId = await fileInfo.getTableId();
  console.log(`Table ID '${tableId}' minted to contract.`);

  // write Contract Address
  writeContractAddress({
    group: "contracts",
    name: "FileInfo",
    value: fileInfo.address,
    network: network.name,
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
