// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

/**
 * @title FileInfo Contract
 * @author HarukiKondo
 * @notice This is a FileInfo Contract
 */
contract FileInfo {
    
  struct FileInfo {
    address locationId;
    bytes32 stateHash;
    mapping(address => bool) accessControl;
  }

  mapping(uint256 => FileInfo) public fileInfos;

  event FileInfoUpdated(bytes32 indexed fileHash, address locationId, bytes32 stateHash);

  function updateFileInfo(
    bytes32 fileHash,
    address locationId,
    bytes32 stateHash,
    address[] memory whiteList
  ) external {
    require(fileHash != bytes32(0), "Invalid file hash");
    require(locationId != address(0), "Invalid location ID");

    FileInfo storage fileInfo = fileInfos[fileHash];
    fileInfo.locationId = locationId;
    fileInfo.stateHash = stateHash;
    fileInfo.whiteList = whiteList;

    emit FileInfoUpdated(fileHash, locationId, stateHash);
  }


  function getFileInfo(bytes32 fileHash) external view returns (address, bytes32, address[] memory) {
    FileInfo memory fileInfo = fileInfos[fileHash];
    return (fileInfo.locationId, fileInfo.stateHash, fileInfo.whiteList);
  }
}