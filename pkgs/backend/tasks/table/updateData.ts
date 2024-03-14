import "dotenv/config";
import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { loadDeployedContractAddresses } from "../../helper/contractsJsonHelper";

task("updateData", "update data")
  .addParam("id", "id")
  .addParam("filehash", "fileHash")
  .addParam("filecid", "fileCid")
  .setAction(async (taskArgs: any, hre: HardhatRuntimeEnvironment) => {
    // get Contract Address
    const {
      contracts: { FileInfo },
    } = loadDeployedContractAddresses(hre.network.name);
    // create fileinfo contract
    const fileInfo = await hre.ethers.getContractAt("FileInfo", FileInfo);

    try {
      // insert
      const tx = await fileInfo.updateFileInfo(
        taskArgs.id,
        taskArgs.filehash,
        taskArgs.filecid
      );
      console.log("tx hash:", tx.hash);
    } catch (e) {
      console.error("err:", e);
    }
  });
