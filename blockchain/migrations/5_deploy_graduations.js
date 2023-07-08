const NftGraduation = artifacts.require('NftGraduation');
const NftCompleteCourses = artifacts.require('NftCompleteCourses');
const School = artifacts.require('School');
const NftIdentities = artifacts.require('NftIdentities');

module.exports = function (deployer) {
  deployer
    .deploy(
      NftGraduation,
      NftIdentities.address,
      School.address,
      NftCompleteCourses.address
    )
    .then(() => NftCompleteCourses.deployed())
    .then((nftCertificate) => nftCertificate.initialize(NftGraduation.address))
    .catch((e) => console.log(e));
};
