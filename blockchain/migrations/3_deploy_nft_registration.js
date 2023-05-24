const ArrayMath = artifacts.require('ArrayMath');
const NftClassRegistration = artifacts.require('NftClassRegistration');
const NftSchool = artifacts.require('NftSchool');
const NftIdentities = artifacts.require('NftIdentities');

module.exports = function (deployer) {
  deployer.deploy(ArrayMath);
  deployer.link(ArrayMath, NftClassRegistration);
  deployer.deploy(
    NftClassRegistration,
    NftIdentities.address,
    NftSchool.address
  );
};
