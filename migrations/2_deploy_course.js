const School = artifacts.require('School');
const NftCourse = artifacts.require('NftCourse');

module.exports = function (deployer) {
  deployer
    .deploy(NftCourse, School.address)
};

