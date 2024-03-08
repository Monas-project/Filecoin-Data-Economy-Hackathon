import { ethers } from "hardhat";
import "@nomiclabs/hardhat-ethers";

async function main() {
  const Starter = await ethers.getContractFactory("Starter");
  const starter = await Starter.deploy();

  await starter.deployed();
  console.log(`Contract deployed to '${starter.address}'.\n`);

  const tableName = await starter.tableName();
  console.log(`Table name '${tableName}' minted to contract.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
