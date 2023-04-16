const { teacherInfoURLs, registerPrice } = require('../testdata/common');
const { ROLES } = require('../testdata/constants');

exports.initTeacher = async (nftIdentityContract, accounts) => {
  await nftIdentityContract.registerNftIdentity(
    ROLES.TEACHER,
    teacherInfoURLs[1],
    {
      from: accounts[1],
      value: registerPrice,
    }
  );
  await nftIdentityContract.grantNftIdentity(
    accounts[1],
    ROLES.TEACHER,
    1711640060,
    teacherInfoURLs[1]
  );
};
