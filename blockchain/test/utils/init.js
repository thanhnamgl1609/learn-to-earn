const { parseEther } = require('ethers/lib/utils');
const { getUnixTime, dateAdd } = require('.');
const {
  teacherInfoURLs,
  registerPrice,
  studentInfoURLs,
  courses,
} = require('../testdata/common');
const { ROLES, BASE_TEACHER } = require('../testdata/constants');

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

exports.initCourses = async (contract) => {
  await Promise.all(
    courses.map((course) =>
      contract.createCourse(
        course.prevCourseId,
        course.knowledgeBlockId,
        course.credits,
        course.uri
      )
    )
  );
};

exports.initRegisterTime = async (contract) => {
  await contract.updateRegisteredTime(
    1,
    getUnixTime(dateAdd(new Date(), -1, 'd')),
    getUnixTime(dateAdd(new Date(), 1, 'd'))
  );
};

exports.initClasses = async (contract) => {
  await Promise.all(
    courses.map((course, index) =>
      contract.createClass(
        index + 1,
        getUnixTime(dateAdd(new Date(), 1, 'm')),
        40,
        BASE_TEACHER,
        1,
        parseEther('0.5'),
        `http://course-${index}.com`
      )
    )
  );
};
