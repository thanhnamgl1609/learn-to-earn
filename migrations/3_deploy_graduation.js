const School = artifacts.require('School');
const NftGraduation = artifacts.require('NftGraduation');

module.exports = function (deployer) {
  deployer
    .deploy(NftGraduation, School.address)
};

