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
import { type Starter } from "../../typechain-types";

chai.use(chaiAsPromised);
const expect = chai.expect;

// Test smart contract deployment and method calls
// Note: SQL *does not* get validated nor materialized in this environment
describe("Starter contract", function () {
  // Set global accounts and the Tableland registry contract
  let accounts: SignerWithAddress[];
  let registry: TablelandTables;
  // Custom `Starter` contract
  let starter: Starter;
  // Database Instance
  let db: Database;

  // Deploy the`TablelandTables` registry contract once
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
    const StarterFactory = await ethers.getContractFactory("Starter");
    starter = (await StarterFactory.deploy()) as Starter;
    await starter.deployed();
  });

  it("should deploy, create a table, and set the controller", async function () {
    // Check that the registry minted a table to the starter and set the controller
    await expect(starter.deployTransaction)
      .to.emit(registry, "CreateTable")
      .withArgs(starter.address, 1, anyValue) // Use `anyValue` instead of a CREATE TABLE statement
      .to.emit(registry, "SetController")
      .withArgs(1, starter.address);
  });

  it("should have the contract own the table", async function () {
    expect(await registry.ownerOf(1)).to.equal(starter.address); // Table ID is `1` in this environment
  });

  it("should have the correct policy set", async function () {
    await starter.insertVal("hello");
    const tableEvents = await registry.queryFilter(registry.filters.RunSQL());
    const [event] = tableEvents ?? [];
    const policy = event.args?.policy;
    // Check the policy values are equal to those set in the contract
    expect(policy.allowInsert).to.equal(true);
    expect(policy.allowUpdate).to.equal(true);
    expect(policy.allowDelete).to.equal(false);
    expect(policy.whereClause).to.equal("");
    expect(policy.withCheck).to.equal("");
    expect(policy.updatableColumns).to.deep.equal(["val"]);
  });

  it("should return the table name", async function () {
    // Custom getter method
    expect(await starter.tableName()).to.equal("starter_table_31337_1");
  });

  it("should call registry to insert value", async function () {
    // Call the method externally, albeit, the contract is sending the SQL
    // You *could* directly call the registry contract such that ACLs are enforced
    await expect(await starter.connect(accounts[1]).insertVal("hello"))
      .to.emit(registry, "RunSQL")
      .withArgs(starter.address, true, 1, anyValue, anyValue);

    // get table name
    const tableName = await starter.tableName();

    // execute select query
    // Read from the table
    /*
    const readStmt = `SELECT * FROM ${tableName}`;
    const { results } = await db
      .prepare(readStmt)
      .all<{ id: number; val: string }>();
    // check select result
    console.log("result:", results[0]);
    */
  });

  it("should call registry to update value", async function () {
    await expect(await starter.connect(accounts[1]).updateVal(1, "world"))
      .to.emit(registry, "RunSQL")
      .withArgs(starter.address, true, 1, anyValue, anyValue);
  });

  it("should call registry to delete value", async function () {
    await expect(await starter.connect(accounts[1]).deleteVal(1))
      .to.emit(registry, "RunSQL")
      .withArgs(starter.address, true, 1, anyValue, anyValue);
  });
});
