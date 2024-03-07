import { ethers } from "hardhat";

/**
 * deploy TableLandSample contract script
 */
async function main() {
  console.log(
    ` ============================================== [start] ================================================ `
  );

  // Deploy the TableLandSample contract
  const TableLandSample = await ethers.getContractFactory("TableLandSample");
  const tableLandSample = await TableLandSample.deploy();
  console.log(
    `TableLandSample contract deployed to ${tableLandSample.target}.\n`
  );

  console.log(
    ` =============================================== [end]  =============================================== `
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
