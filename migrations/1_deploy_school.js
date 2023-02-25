const School = artifacts.require('School');

module.exports = function (deployer) {
  deployer.deploy(School)
};
