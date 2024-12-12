const ArraySearch = artifacts.require('ArraySearch');
const NftIdentities = artifacts.require('NftIdentities');

const SCHOOL_ACCOUNT = '0x253c4b3B322112e25834495024343e363AB8F89B';

module.exports = function (deployer) {
  deployer.deploy(ArraySearch);
  deployer.link(ArraySearch, NftIdentities);
  deployer.deploy(NftIdentities, SCHOOL_ACCOUNT);
};
