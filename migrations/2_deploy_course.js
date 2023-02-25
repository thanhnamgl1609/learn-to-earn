const Type = artifacts.require('Type');
const School = artifacts.require('School');
const NftCourse = artifacts.require('NftCourse');

module.exports = function (deployer) {
  deployer.link(NftCourse, Type);
  deployer.deploy(NftCourse, School.address)
};

