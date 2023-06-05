const NftGraduation = artifacts.require('NftGraduation');
const NftCertificates = artifacts.require('NftCertificates');
const NftSchool = artifacts.require('NftSchool');
const NftIdentities = artifacts.require('NftIdentities');

module.exports = function (deployer) {
  deployer
    .deploy(
      NftGraduation,
      NftIdentities.address,
      NftSchool.address,
      NftCertificates.address
    )
    .then(() => NftCertificates.deployed())
    .then((nftCertificate) => nftCertificate.initialize(NftGraduation.address))
    .catch((e) => console.log(e));
};
