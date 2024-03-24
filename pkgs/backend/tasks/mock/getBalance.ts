import { ethers } from "ethers";
import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";

task("getBalance", "Prints an account's balance")
  .addParam("account", "The account's address")
  .setAction(async (taskArgs: any, hre: HardhatRuntimeEnvironment) => {
    // get network info
    const network: any = hre.network.config;
    const provider = new ethers.providers.JsonRpcProvider(network.url);
    const balance = await provider.getBalance(taskArgs.account);

    console.log(ethers.utils.formatEther(balance));
  });
