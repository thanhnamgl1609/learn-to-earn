// const Type = artifacts.require('Type');
// const School = artifacts.require('School');
const NftIdentities = artifacts.require('NftIdentities');
const NftSchool = artifacts.require('NftSchool');

module.exports = function (deployer) {
  // deployer.deploy(Type);
  // deployer.link(School, Type);
  deployer.deploy(NftSchool, NftIdentities.address);
};
