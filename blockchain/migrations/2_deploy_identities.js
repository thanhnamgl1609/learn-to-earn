const ArraySearch = artifacts.require('ArraySearch');
const NftIdentities = artifacts.require('NftIdentities');

module.exports = function (deployer) {
  deployer.deploy(ArraySearch);
  deployer.link(ArraySearch, NftIdentities);
  deployer.deploy(NftIdentities);
};
