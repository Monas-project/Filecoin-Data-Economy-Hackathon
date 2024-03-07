// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {TablelandDeployments} from "@tableland/evm/contracts/utils/TablelandDeployments.sol";
import {SQLHelpers} from "@tableland/evm/contracts/utils/SQLHelpers.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

/**
 * @title TableLandSample Contract
 * @author HarukiKondo
 * @notice This is a TableLandSample Contract
 */
contract TableLandSample is ERC721Holder, Ownable {
  // my table ID and prefix
  uint256 public _tableId;
  string private constant _TABLE_PREFIX = "my_table";

  /**
   * constructor
   */
  constructor() Ownable(msg.sender) {
    // set table Id
    _tableId = TablelandDeployments.get().create(
      address(this),
      SQLHelpers.toCreateFromSchema(
        "id integer primary key,"
        "val text",
        _TABLE_PREFIX
      )
    );
  }

  /**
   * insertIntoTable function
   */
  function insertIntoTable(uint256 id, string memory val) external {
    // create & execute insert query
    TablelandDeployments.get().mutate(
      address(this), // Table owner
      _tableId,
      SQLHelpers.toInsert(
        _TABLE_PREFIX,
        _tableId,
        "id,val",
        string.concat(
          Strings.toString(id), // Convert to a string
          ",",
          SQLHelpers.quote(val) // Wrap strings in single quotes with the `quote` method
        )
      )
    );
  }

  /**
   * updateTable function
   */
  function updateTable(uint256 id, string memory val) external {
    // Set the values to update
    string memory setters = string.concat("val=", SQLHelpers.quote(val));
    // Specify filters for which row to update
    string memory filters = string.concat("id=", Strings.toString(id));
    // create & execute update query
    TablelandDeployments.get().mutate(
      address(this),
      _tableId,
      SQLHelpers.toUpdate(_TABLE_PREFIX, _tableId, setters, filters)
    );
  }

  /**
   * delete function
   */
  function deleteFromTable(uint256 id) external {
    string memory filters = string.concat("id=", Strings.toString(id));
    // Mutate a row at `id`
    TablelandDeployments.get().mutate(
      address(this),
      _tableId,
      SQLHelpers.toDelete(_TABLE_PREFIX, _tableId, filters)
    );
  }

  /**
   * setAccessControl function
   */
  function setAccessControl(address controller) external onlyOwner {
    TablelandDeployments.get().setController(
      address(this), // Table owner
      _tableId,
      controller
    );
  }

  /**
   * Return the table ID function
   */
  function getTableId() external view returns (uint256) {
    return _tableId;
  }

  /**
   * Return the table name function
   */
  function getTableName() external view returns (string memory) {
    return SQLHelpers.toNameFromId(_TABLE_PREFIX, _tableId);
  }
}
