import { ethers } from 'hardhat';

/**
 * deploy MockVerifier contract script
 */
async function main() {
  console.log(` ============================================== [start] ================================================ `)

  // SimpleCoin deploy
  const SimpleCoin = await ethers.getContractFactory("SimpleCoin");
  const coin = await SimpleCoin.deploy(200);
  console.log(` SimpleCoin deployed to ${coin.target}`);

  console.log(` =============================================== [end]  =============================================== `)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})