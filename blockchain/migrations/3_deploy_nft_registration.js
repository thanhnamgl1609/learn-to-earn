const ArrayMath = artifacts.require('ArrayMath');
const NftClassRegistration = artifacts.require('NftClassRegistration');
const School = artifacts.require('School');
const NftIdentities = artifacts.require('NftIdentities');

const SCHOOL_ACCOUNT = '0x253c4b3B322112e25834495024343e363AB8F89B';

module.exports = function (deployer) {
  deployer.deploy(ArrayMath);
  deployer.link(ArrayMath, NftClassRegistration);
  deployer.deploy(
    NftClassRegistration,
    NftIdentities.address,
    School.address,
    SCHOOL_ACCOUNT
  );
};
