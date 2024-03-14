import "dotenv/config";
import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { loadDeployedContractAddresses } from "../../helper/contractsJsonHelper";

task("deleteData", "delete data")
  .addParam("id", "delete id")
  .setAction(async (taskArgs: any, hre: HardhatRuntimeEnvironment) => {
    // get Contract Address
    const {
      contracts: { FileInfo },
    } = loadDeployedContractAddresses(hre.network.name);
    // create fileinfo contract
    const fileInfo = await hre.ethers.getContractAt("FileInfo", FileInfo);

    try {
      // insert
      const tx = await fileInfo.deleteFileInfo(taskArgs.id);
      console.log("tx hash:", tx.hash);
    } catch (e) {
      console.error("err:", e);
    }
  });
