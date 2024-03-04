# Filecoin-Data-Economy-Hackathon

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
    NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=
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

### Reference

1. [FEVM Quickstart](https://docs.filecoin.io/smart-contracts/developing-contracts/hardhat)
2. [FileCoin Calibration - Explorer](https://calibration.filscan.io/en)
