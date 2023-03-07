// const Type = artifacts.require('Type');
const NftIdentities = artifacts.require('NftIdentities');

module.exports = function (deployer) {
  deployer.deploy(NftIdentities)
};
