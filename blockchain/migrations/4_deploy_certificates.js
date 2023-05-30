const ArrayMath = artifacts.require('ArrayMath');
const NftCertificates = artifacts.require('NftCertificates');
const NftSchool = artifacts.require('NftSchool');
const NftClassRegistration = artifacts.require('NftClassRegistration');
const NftIdentities = artifacts.require('NftIdentities');

module.exports = function (deployer) {
  deployer.deploy(ArrayMath);
  deployer.link(ArrayMath, NftCertificates);
  deployer
    .deploy(
      NftCertificates,
      NftIdentities.address,
      NftSchool.address,
      NftClassRegistration.address
    )
    .then(() => NftSchool.deployed())
    .then((nftSchool) => nftSchool.initialize(NftCertificates.address))
    .then(() => NftClassRegistration.deployed())
    .then((nftClassRegistration) =>
      nftClassRegistration.initialize(NftCertificates.address)
    )
    .catch((e) => console.log(e));
};
