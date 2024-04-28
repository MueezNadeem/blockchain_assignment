// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FileSharing {
    struct File {
        string name;
        string hash; // Hash on IPFS
        address uploader;
        uint256 timestamp;
    }

    mapping(address => bool) public registeredUsers;
    mapping(uint256 => File) public files;
    uint256 public fileCount = 0;

    event UserRegistered(address indexed user);
    event FileUploaded(address indexed uploader, uint256 indexed fileId);

    function signup() public {
        require(!registeredUsers[msg.sender], "User already registered");
        registeredUsers[msg.sender] = true;
        emit UserRegistered(msg.sender);
    }

    function uploadFile(string memory _name, string memory _hash) public {
        require(registeredUsers[msg.sender], "User not registered");
        fileCount++;
        files[fileCount] = File(_name, _hash, msg.sender, block.timestamp);
        emit FileUploaded(msg.sender, fileCount);
    }

    function downloadFile(uint256 _fileId) public view returns (File memory) {
        require(registeredUsers[msg.sender], "User not registered");
        return files[_fileId];
    }

    function searchFilesByUploader(
        address _uploader
    ) public view returns (File[] memory) {
        File[] memory userFiles = new File[](fileCount);
        uint256 counter = 0;
        for (uint256 i = 1; i <= fileCount; i++) {
            if (files[i].uploader == _uploader) {
                userFiles[counter] = files[i];
                counter++;
            }
        }
        return userFiles;
    }
}
