// migrations/2_deploy_filesharing.js
const FileSharing = artifacts.require("FileSharing");

module.exports = function (deployer) {
  deployer.deploy(FileSharing);
};
