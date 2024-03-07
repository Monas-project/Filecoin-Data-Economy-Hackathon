import { Registry } from "@tableland/sdk";
import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";

task("tableland", "Mock Tableand task").setAction(
  async (taskArgs: any, hre: HardhatRuntimeEnvironment) => {
    // Deploy the TableLandSample contract
    const TableLandSample = await hre.ethers.getContractFactory(
      "TableLandSample"
    );
    const tableLandSample = await TableLandSample.deploy();
    // get signers
    const [other] = await hre.ethers.getSigners();
    const tableId = await tableLandSample.getTableId();
    const tableName = await tableLandSample.getTableName();
    // insert
    var tx = await tableLandSample
      .connect(other)
      .insertIntoTable(tableId, "init");
    await tx.wait();
    // insert
    tx = await tableLandSample
      .connect(other)
      .updateTable(tableId, "test other");
    await tx.wait();
    // Now, we're going to try & insert into the table by directly hitting the registry
    const registry = await Registry.forSigner(other as any);
    const { chainId } = await hre.ethers.provider.getNetwork();
    const numberedChainId = hre.ethers.toNumber(chainId);
    // insert
    let statement = `INSERT INTO ${tableName} (val) VALUES ('this fails')`;
    var mutateTx = await registry.mutate({
      chainId: numberedChainId,
      tableId: tableId.toString(),
      statement,
    });
    await tx.wait();
    // update
    statement = `UPDATE ${tableName} SET val = 'this succeeds'`;
    mutateTx = await registry.mutate({
      chainId: numberedChainId,
      tableId: tableId.toString(),
      statement,
    });
    await tx.wait();
  }
);
