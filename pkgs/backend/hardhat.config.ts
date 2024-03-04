import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";
import fs from "fs";
import { HardhatUserConfig } from "hardhat/config";
import path from "path";

const { PRIVATE_KEY, GAS_REPORT, COINMARKETCAP_API_KEY } = process.env;

const HARDHAT_CHAINID = 31337;
const DEFAULT_BLOCK_GAS_LIMIT = 30000000;
const GWEI = 1000 * 1000 * 1000;

const SKIP_LOAD = process.env.SKIP_LOAD === "true";
if (!SKIP_LOAD) {
  const taskPaths = ["mock"];
  taskPaths.forEach((folder) => {
    const tasksPath = path.join(__dirname, "tasks", folder);
    fs.readdirSync(tasksPath)
      .filter((_path) => _path.includes(".ts"))
      .forEach((task) => {
        require(`${tasksPath}/${task}`);
      });
  });
}

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      blockGasLimit: DEFAULT_BLOCK_GAS_LIMIT,
      gas: DEFAULT_BLOCK_GAS_LIMIT,
      gasPrice: 3 * GWEI,
      throwOnTransactionFailures: true,
      throwOnCallFailures: true,
      allowUnlimitedContractSize: true,
    },
    filecoinCalibration: {
      url: "https://api.calibration.node.glif.io/rpc/v1" || "",
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
    },
  },
  gasReporter: {
    enabled: GAS_REPORT ? true : false,
    currency: "JPY",
    gasPrice: 20,
    token: "ETH",
    coinmarketcap: COINMARKETCAP_API_KEY,
    gasPriceApi:
      "https://api.etherscan.io/api?module=proxy&action=eth_gasPrice",
  },
};

export default config;
