const NftCertificates = artifacts.require('NftCertificates');
const NftSchool = artifacts.require('NftSchool');
const NftIdentities = artifacts.require('NftIdentities');

module.exports = function (deployer) {
  deployer
    .deploy(NftCertificates, NftSchool.address, NftIdentities.address)
    .then(() => NftSchool.deployed())
    .then((nftSchool) => nftSchool.initialize(NftCertificates.address));
};
