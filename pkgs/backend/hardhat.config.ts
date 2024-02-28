import "@nomicfoundation/hardhat-toolbox";
import 'dotenv/config';
import { HardhatUserConfig } from "hardhat/config";

const {
  PRIVATE_KEY,
  GAS_REPORT,
  COINMARKETCAP_API_KEY
} = process.env;

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    filecoinCalibration: {
      url: 'https://api.calibration.node.glif.io/rpc/v1' || '',
      accounts:
        PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
    }
  },
  gasReporter: {
    enabled: GAS_REPORT ? true : false,
    currency: 'JPY',
    gasPrice: 20,
    token: 'ETH',
    coinmarketcap: COINMARKETCAP_API_KEY,
    gasPriceApi: 'https://api.etherscan.io/api?module=proxy&action=eth_gasPrice',
  },
};

export default config;
