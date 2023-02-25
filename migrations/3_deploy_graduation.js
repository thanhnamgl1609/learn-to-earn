const NftCourse = artifacts.require('NftCourse');
const NftGraduation = artifacts.require('NftGraduation');

module.exports = function (deployer) {
  deployer
    .deploy(NftGraduation, NftCourse.address)
};

