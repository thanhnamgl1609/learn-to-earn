const Score = artifacts.require('Score');
const NftIdentities = artifacts.require('NftIdentities');
const NftSchool = artifacts.require('NftSchool');

module.exports = function (deployer) {
  deployer.deploy(NftSchool, NftIdentities.address, Score.address);
};
