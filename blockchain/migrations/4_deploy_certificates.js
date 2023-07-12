const ArrayMath = artifacts.require('ArrayMath');
const NftCompleteCourses = artifacts.require('NftCompleteCourses');
const School = artifacts.require('School');
const NftClassRegistration = artifacts.require('NftClassRegistration');
const NftIdentities = artifacts.require('NftIdentities');

module.exports = function (deployer) {
  deployer.deploy(ArrayMath);
  deployer.link(ArrayMath, NftCompleteCourses);
  deployer
    .deploy(
      NftCompleteCourses,
      NftIdentities.address,
      School.address,
      NftClassRegistration.address
    )
    .then(() => NftClassRegistration.deployed())
    .then((nftClassRegistration) =>
      nftClassRegistration.initialize(NftCompleteCourses.address)
    )
    .catch((e) => console.log(e));
};
