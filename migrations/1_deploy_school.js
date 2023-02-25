const Type = artifacts.require('Type');
const School = artifacts.require('School');

module.exports = function (deployer) {
  deployer.deploy(Type);
  deployer.link(School, Type);
  deployer.deploy(School);
};
