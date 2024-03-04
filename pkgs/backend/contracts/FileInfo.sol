// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

/**
 * @title FileInfo Contract
 * @author HarukiKondo
 * @notice This is a FileInfo Contract
 */
contract FileInfo {
  // FileInfo Struct
  struct FileInfo {
    bytes32 locationId;
    bytes32 stateHash;
    address fileOwner;
    mapping(address => bool) accessControlList;
  }

  ///// mapping /////
  mapping(bytes32 => FileInfo) public fileInfos;

  //// Event /////
  event FileInfoUpdated(
    bytes32 indexed fileHash,
    bytes32 locationId,
    address fileOwner,
    bytes32 stateHash
  );

  /**
   * add new file
   */
  function addNewFile(
    bytes32 _fileHash,
    bytes32 _locationId,
    address _fileOwner,
    bytes32 _stateHash
  ) external {
    // check data
    require(_fileHash != bytes32(0), "Invalid file hash");
    require(_locationId != bytes32(0), "Invalid location ID");
    require(_fileOwner != address(0), "Invalid address");
    // add new file data
    FileInfo storage fileInfo = fileInfos[_fileHash];
    fileInfo.locationId = _locationId;
    fileInfo.stateHash = _stateHash;
    fileInfo.fileOwner = _fileOwner;
    fileInfo.accessControlList[_fileOwner] = true;

    emit FileInfoUpdated(_fileHash, _locationId, _fileOwner, _stateHash);
  }
}
