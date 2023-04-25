const { getUnixTime, dateAdd } = require('.');
const {
  teacherInfoURLs,
  registerPrice,
  studentInfoURLs,
} = require('../testdata/common');
const { ROLES } = require('../testdata/constants');

exports.initStudent = async (nftIdentityContract, accounts) =>
  Promise.all(
    accounts.map((account, idx) =>
      this.initByRole(
        nftIdentityContract,
        account,
        ROLES.STUDENT,
        studentInfoURLs[idx]
      )
    )
  );

exports.initTeacher = async (nftIdentityContract, accounts) =>
  Promise.all(
    accounts.map((account, idx) =>
      this.initByRole(
        nftIdentityContract,
        account,
        ROLES.TEACHER,
        teacherInfoURLs[idx]
      )
    )
  );

exports.initByRole = async (nftIdentityContract, account, role, url) => {
  await nftIdentityContract.registerNftIdentity(role, url, {
    from: account,
    value: registerPrice,
  });
  await nftIdentityContract.grantNftIdentity(
    account,
    role,
    getUnixTime(dateAdd(new Date(), 1, 'y')),
    url
  );
};
