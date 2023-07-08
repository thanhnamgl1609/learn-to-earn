const ArrayMath = artifacts.require('ArrayMath');
const NftClassRegistration = artifacts.require('NftClassRegistration');
const School = artifacts.require('School');
const NftIdentities = artifacts.require('NftIdentities');

module.exports = function (deployer) {
  deployer.deploy(ArrayMath);
  deployer.link(ArrayMath, NftClassRegistration);
  deployer.deploy(
    NftClassRegistration,
    NftIdentities.address,
    School.address
  );
};
