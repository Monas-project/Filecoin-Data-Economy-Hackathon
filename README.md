# Filecoin-Data-Economy-Hackathon

## PushProtocol Signer Info(EThereum Sepolia)

[0x69d3E7219CE2259654EcBBFf9597936BaDF5Be52](https://sepolia.etherscan.io/address/0x69d3E7219CE2259654EcBBFf9597936BaDF5Be52)

## How to work

- setup

  - `backend`

    create `.env` & set below values

    ```txt
    PRIVATE_KEY=
    GAS_REPORT=
    COINMARKETCAP_API_KEY=
    ```

  - `frontend`

    create `.env.local` & set below values

    ```txt
    NEXT_PUBLIC_ENABLE_TESTNETS=
    WALLET_CONNECT_PROJECT_ID=
    SEPOLIA_RPC_URL=
    PUSH_PROTOCOL_PRIVATE_KEY=
    ```

- install

  ```Bash
  yarn
  ```

- frontend build

  ```bash
  yarn frontend build
  ```

- frontend dev

  ```bash
  yarn frontend dev
  ```

- smartcontract build

  ```bash
  yarn backend compile
  ```

- smartcontract test

  ```bash
  yarn backend test
  ```

- smartcontract deploy

  ```bash
  yarn backend deploy:filecoinCalibration
  ```

- task getBalance

  ```bash
  cd pkgs/backend && npx hardhat getBalance --account 0x51908F598A5e0d8F1A3bAbFa6DF76F9704daD072 --network filecoinCalibration
  ```

- task getAllTableData

  ```bash
  cd pkgs/backend && npx hardhat getAllTableData --tablename fileinfo_table_314159_728
  results: []
  ```

- task insertData

  ```bash
  cd pkgs/backend && npx hardhat insertData --rootid "0x2cfb66d732c42332174297788fb69fba6c4bef842d95205ebfde1a126997b953" --filecid "0x2cfb66d732c42332174297788fb69fba6c4bef842d95205ebfde1a126997b953" --network filecoinCalibration
  ```

- task setRootHash

  ```bash
  cd pkgs/backend && npx hardhat setRootHash --roothash "0x2cfb66d732c42332174297788fb69fba6c4bef842d95205ebfde1a126997b953" --network filecoinCalibration
  ```

- task getRootHash

  ```bash
  cd pkgs/backend && npx hardhat getRootHash --network filecoinCalibration
  ```

- task delete data

  ```bash
  cd pkgs/backend && npx hardhat deleteData --id 4 --network filecoinCalibration
  ```

- task update data

  ```bash
  cd pkgs/backend && npx hardhat updateData --id 3 --rootid "0x2cfb66d732c42332174297788fb69fba6c4bef842d95205ebfde1a126997b977" --filecid "0x2cfb66d732c42332174297788fb69fba6c4bef842d95205ebfde1a126997b988" --network filecoinCalibration
  ```

### Reference

1. [FEVM Quickstart](https://docs.filecoin.io/smart-contracts/developing-contracts/hardhat)
2. [FileCoin Calibration - Explorer](https://calibration.filscan.io/en)
3. [TableLand - GetStarted](https://docs.tableland.xyz/smart-contracts/get-started)
4. [TableLand - HP](https://tableland.xyz/)
5. [TableLand - Deployed contracts](https://docs.tableland.xyz/smart-contracts/deployed-contracts)
6. [Filfox Contract Verification API Documents](https://filfox.notion.site/Filfox-Contract-Verification-API-Documents-c48d361c949348acb0bf806871ddd2c2)
7. [TableLand Studio](https://studio.tableland.xyz/mashharuki/monas)
8. [wagmi V1 signMessage](https://1.x.wagmi.sh/examples/sign-message)
9. [PushProtocol SDK - RestAPI](https://github.com/ethereum-push-notification-service/push-sdk/blob/main/packages/restapi/README.md)
