// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.10 <0.9.0;

import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {TablelandController} from "@tableland/evm/contracts/TablelandController.sol";
import {TablelandPolicy} from "@tableland/evm/contracts/TablelandPolicy.sol";
import {TablelandDeployments} from "@tableland/evm/contracts/utils/TablelandDeployments.sol";
import {SQLHelpers} from "@tableland/evm/contracts/utils/SQLHelpers.sol";
import {ERC721Holder} from "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

// Starter template for contract owned and controlled tables
contract Starter is TablelandController, ERC721Holder {
    uint256 private tableId; // Unique table ID
    string private constant _TABLE_PREFIX = "starter_table"; // Custom table prefix

    // Constructor that creates a table, sets the controller, and inserts data
    constructor() {
        // Create a table
        tableId = TablelandDeployments.get().create(
            address(this),
            SQLHelpers.toCreateFromSchema(
                "id integer primary key,"
                "val text",
                _TABLE_PREFIX
            )
        );
        // Set the ACL controller to enable writes to others besides the table owner
        TablelandDeployments.get().setController(
            address(this), // Table owner, i.e., this contract
            tableId,
            address(this) // Set the controller address—also this contract
        );
    }

    // Sample getter to retrieve the table name
    function tableName() external view returns (string memory) {
        return SQLHelpers.toNameFromId(_TABLE_PREFIX, tableId);
    }

    // Insert a row into the table from an external call (`id` will autoincrement)
    function insertVal(string memory val) external {
        TablelandDeployments.get().mutate(
            address(this),
            tableId,
            SQLHelpers.toInsert(
                _TABLE_PREFIX,
                tableId,
                "val",
                SQLHelpers.quote(val) // Wrap strings in single quotes with the `quote` method
            )
        );
    }

    // Update a row in the table from an external call (set `val` at any `id`)
    function updateVal(uint64 id, string memory val) external {
        string memory setters = string.concat("val=", SQLHelpers.quote(val));
        string memory filters = string.concat("id=", Strings.toString(id));
        // Mutate a row at `id` with a new `val`
        TablelandDeployments.get().mutate(
            address(this),
            tableId,
            SQLHelpers.toUpdate(_TABLE_PREFIX, tableId, setters, filters)
        );
    }

    // Delete a row in the table from an external call (delete at any `id`)
    function deleteVal(uint64 id) external {
        string memory filters = string.concat("id=", Strings.toString(id));
        // Mutate by deleting the row at `id`
        TablelandDeployments.get().mutate(
            address(this),
            tableId,
            SQLHelpers.toDelete(_TABLE_PREFIX, tableId, filters)
        );
    }

    // Dynamic ACL controller policy that allows any inserts and updates
    function getPolicy(
        address,
        uint256
    ) public payable override returns (TablelandPolicy memory) {
        // Restrict updates to a single column, e.g., `val`
        string[] memory updatableColumns = new string[](1);
        updatableColumns[0] = "val";
        // Return the policy
        return
            TablelandPolicy({
                allowInsert: true,
                allowUpdate: true,
                allowDelete: false,
                whereClause: "", // Apply WHERE conditions
                withCheck: "", // Apply CHECK conditions
                updatableColumns: updatableColumns
            });
    }
}
