// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FileSharing {
    struct File {
        string name;
        string hash; // IPFS hash
        address uploader;
        uint256 timestamp;
    }

    mapping(address => bool) public registeredUsers;
    mapping(uint256 => File) public files;
    uint256 public fileCount = 0;

    event UserRegistered(address indexed user);
    event FileUploaded(
        address indexed uploader,
        uint256 indexed fileId,
        string fileName,
        string ipfsHash
    );

    // Register a user
    function signup() public {
        require(!registeredUsers[msg.sender], "User already registered");
        registeredUsers[msg.sender] = true;
        emit UserRegistered(msg.sender);
    }

    // Upload a file to IPFS and record its metadata in the smart contract
    function uploadFile(string memory _name, string memory _hash) public {
        require(registeredUsers[msg.sender], "User not registered");
        fileCount++;
        files[fileCount] = File(_name, _hash, msg.sender, block.timestamp);
        emit FileUploaded(msg.sender, fileCount, _name, _hash);
    }

    // Get file information by file ID
    function getFile(uint256 _fileId) public view returns (File memory) {
        require(registeredUsers[msg.sender], "User not registered");
        require(_fileId > 0 && _fileId <= fileCount, "Invalid file ID");
        return files[_fileId];
    }

    // Get all files uploaded by a specific user
    function getFilesByUploader(
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
