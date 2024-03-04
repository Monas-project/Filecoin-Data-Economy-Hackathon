import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";

task("getBalance", "Prints an account's balance")
  .addParam("account", "The account's address")
  .setAction(async (taskArgs: any, hre: HardhatRuntimeEnvironment) => {
    const balance = await hre.ethers.provider.getBalance(taskArgs.account);

    console.log(hre.ethers.formatEther(balance), "ETH");
  });
