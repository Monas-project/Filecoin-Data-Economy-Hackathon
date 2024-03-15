// SPDX-License-Identifier: MIT
pragma solidity >=0.8.10 <0.9.0;

import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {TablelandController} from "@tableland/evm/contracts/TablelandController.sol";
import {TablelandPolicy} from "@tableland/evm/contracts/TablelandPolicy.sol";
import {TablelandDeployments} from "@tableland/evm/contracts/utils/TablelandDeployments.sol";
import {SQLHelpers} from "@tableland/evm/contracts/utils/SQLHelpers.sol";
import {ERC721Holder} from "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

/**
 * @title FileInfo Contract
 * @author HarukiKondo
 * @notice This is a FileInfo Contract
 */
contract FileInfo is TablelandController, ERC721Holder {
  uint256 private tableId;
  string private tableName;
  string private constant _TABLE_PREFIX = "fileinfo_table";
  bytes32 private rootHash;

  /// events

  event TableCreated(uint256 tableId, string tableName);
  event Insert(
    uint256 tableId,
    string tableName,
    string fileHash,
    string fileCid
  );
  event Update(
    uint256 tableId,
    string tableName,
    string fileHash,
    string fileCid
  );
  event Delete(uint256 tableId, string tableName);
  event UpdateRootHash(bytes32 rootHash);

  /**
   * constructor
   */
  constructor() {
    // Create a table
    tableId = TablelandDeployments.get().create(
      address(this),
      SQLHelpers.toCreateFromSchema(
        "id integer primary key,"
        "fileHash text,"
        "fileCid text",
        _TABLE_PREFIX
      )
    );
    tableName = SQLHelpers.toNameFromId(_TABLE_PREFIX, tableId);
    // emit
    emit TableCreated(tableId, tableName);
  }

  /**
   * Insert a row into the table from an external call
   */
  function insertFileInfo(
    string memory _fileHash,
    string memory _fileCid
  ) external {
    TablelandDeployments.get().mutate(
      address(this),
      tableId,
      SQLHelpers.toInsert(
        _TABLE_PREFIX,
        tableId,
        "fileHash, fileCid",
        string.concat(
          SQLHelpers.quote(_fileHash),
          ",",
          SQLHelpers.quote(_fileCid)
        )
      )
    );
    emit Insert(tableId, tableName, _fileHash, _fileCid);
  }

  /**
   * Update function
   */
  function updateFileInfo(
    uint64 id,
    string memory _fileHash,
    string memory _fileCid
  ) external {
    string memory setters = string.concat(
      "fileHash=",
      SQLHelpers.quote(_fileHash),
      ",",
      "fileCid=",
      SQLHelpers.quote(_fileCid)
    );
    string memory filters = string.concat("id=", Strings.toString(id));
    // Mutate a row at `id` with a new `val`
    TablelandDeployments.get().mutate(
      address(this),
      tableId,
      SQLHelpers.toUpdate(_TABLE_PREFIX, tableId, setters, filters)
    );
    emit Update(tableId, tableName, _fileHash, _fileCid);
  }

  /**
   * Delete function
   */
  function deleteFileInfo(uint64 id) external {
    string memory filters = string.concat("id=", Strings.toString(id));
    // Mutate by deleting the row at `id`
    TablelandDeployments.get().mutate(
      address(this),
      tableId,
      SQLHelpers.toDelete(_TABLE_PREFIX, tableId, filters)
    );

    emit Delete(tableId, tableName);
  }

  /**
   * Dynamic ACL controller policy that allows any inserts and updates
   */
  function getPolicy(
    address,
    uint256
  ) public payable override returns (TablelandPolicy memory) {
    // Restrict updates to a single column, e.g., `val`
    string[] memory updatableColumns = new string[](2);
    updatableColumns[0] = "fileHash";
    updatableColumns[1] = "fileCid";
    // Return the policy
    return
      TablelandPolicy({
        allowInsert: true,
        allowUpdate: true,
        allowDelete: true,
        whereClause: "",
        withCheck: "",
        updatableColumns: updatableColumns
      });
  }

  /**
   * set RootHash
   */
  function setRootHash(bytes32 _rootHash) external {
    rootHash = _rootHash;
    emit UpdateRootHash(_rootHash);
  }

  /**
   * set ACL function
   */
  function setAccessControl() public {
    TablelandDeployments.get().setController(
      address(this),
      tableId,
      address(this)
    );
  }

  /**
   * getRootHash
   */
  function getRootHash() external view returns (bytes32) {
    return rootHash;
  }

  /**
   * gat talbleName
   */
  function getTableName() external view returns (string memory) {
    return SQLHelpers.toNameFromId(_TABLE_PREFIX, tableId);
  }

  /**
   * gat talbleId
   */
  function getTableId() external view returns (uint256) {
    return tableId;
  }
}
