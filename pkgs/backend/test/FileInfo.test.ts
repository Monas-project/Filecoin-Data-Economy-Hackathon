import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import "@nomicfoundation/hardhat-toolbox";
import { type SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import "@openzeppelin/hardhat-upgrades";
import { type TablelandTables } from "@tableland/evm";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { ethers, upgrades } from "hardhat";
// Import your contracts from `contracts` directory
import { Database } from "@tableland/sdk";
import { FileInfo } from "../typechain-types";

chai.use(chaiAsPromised);
const expect = chai.expect;

describe("FileInfo contract", function () {
  let accounts: SignerWithAddress[];
  let registry: TablelandTables;
  let fileInfo: FileInfo;
  let db: Database;
  let sampleHash =
    "0x2cfb66d732c42332174297788fb69fba6c4bef842d95205ebfde1a126997b953";

  /**
   * デプロイメソッド
   */
  async function deployFixture() {
    // Set global accounts
    accounts = await ethers.getSigners();
    // Create a database connection
    db = new Database({ signer: accounts[0] });
    // Deploy `TablelandTables` to allow for table creates and mutates
    const TablelandTablesFactory = await ethers.getContractFactory(
      "TablelandTables"
    );
    registry = await (
      (await upgrades.deployProxy(
        TablelandTablesFactory,
        ["http://127.0.0.1:8545/"],
        {
          kind: "uups",
        }
      )) as TablelandTables
    ).deployed();
  }

  // Deploy the fixture and `Starter` to ensure deterministic table IDs
  beforeEach(async function () {
    await loadFixture(deployFixture);
    const FileInfoFactory = await ethers.getContractFactory("FileInfo");
    fileInfo = (await FileInfoFactory.deploy()) as FileInfo;
    await fileInfo.deployed();
  });

  it("should deploy, create a table, and set the controller", async function () {
    // Check that the registry minted a table to the starter and set the controller
    await expect(fileInfo.deployTransaction)
      .to.emit(registry, "CreateTable")
      .withArgs(fileInfo.address, 1, anyValue) // Use `anyValue` instead of a CREATE TABLE statement
      .to.emit(registry, "SetController")
      .withArgs(1, fileInfo.address);
  });

  it("should have the contract own the table", async function () {
    expect(await registry.ownerOf(1)).to.equal(fileInfo.address); // Table ID is `1` in this environment
  });

  it("should have the correct policy set", async function () {
    await fileInfo.insertFileInfo(sampleHash, sampleHash);
    const tableEvents = await registry.queryFilter(registry.filters.RunSQL());
    const [event] = tableEvents ?? [];
    const policy = event.args?.policy;
    // Check the policy values are equal to those set in the contract
    expect(policy.allowInsert).to.equal(true);
    expect(policy.allowUpdate).to.equal(true);
    expect(policy.allowDelete).to.equal(true);
    expect(policy.whereClause).to.equal("");
    expect(policy.withCheck).to.equal("");
    expect(policy.updatableColumns).to.deep.equal(["fileHash", "locationId"]);
  });

  it("should return the table name", async function () {
    // Custom getter method
    expect(await fileInfo.getTableName()).to.equal("fileino_table_31337_1");
  });

  it("should return the table ID", async function () {
    // Custom getter method
    expect(await fileInfo.getTableId()).to.equal(1);
  });

  it("should call registry to insert value", async function () {
    await expect(
      await fileInfo.connect(accounts[1]).insertFileInfo(sampleHash, sampleHash)
    )
      .to.emit(registry, "RunSQL")
      .withArgs(fileInfo.address, true, 1, anyValue, anyValue);
  });

  it("should call registry to update value", async function () {
    await expect(
      fileInfo.connect(accounts[1]).updateFileInfo(1, sampleHash, sampleHash)
    )
      .to.emit(registry, "RunSQL")
      .withArgs(fileInfo.address, true, 1, anyValue, anyValue);
  });

  it("should call registry to delete value", async function () {
    await expect(await fileInfo.connect(accounts[1]).deleteFileInfo(1))
      .to.emit(registry, "RunSQL")
      .withArgs(fileInfo.address, true, 1, anyValue, anyValue);
  });

  it("should be same Hash", async function () {
    await fileInfo.setRootHash(sampleHash);
    // get RootHash
    const rootHash = await fileInfo.getRootHash();
    expect(rootHash).to.equal(sampleHash);
  });
});
