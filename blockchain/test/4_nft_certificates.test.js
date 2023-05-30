const { parseEther } = require('ethers/lib/utils');
const assert = require('power-assert');
const { classRegistrationInfoURLs } = require('./testdata/common');
const { BASE_STUDENT, ROLES } = require('./testdata/constants');
const NftSchool = artifacts.require('NftSchool');
const NftIdentities = artifacts.require('NftIdentities');
const NftCertificates = artifacts.require('NftCertificates');
const NftClassRegistration = artifacts.require('NftClassRegistration');

const {
  initTeacher,
  initStudent,
  initCourses,
  initRegisterTime,
  initClasses,
} = require('./utils/init');

const testFuncs = ['addToNftCompleteCourseCreationQueue'].join(', ');

contract(`NftCertificate ${testFuncs}`, (accounts) => {
  let _nftSchoolContract;
  let _nftIdentitiesContract;
  let _nftClassRegistrationContract;
  let _nftCertificates;

  before(async () => {
    _nftSchoolContract = await NftSchool.deployed();
    _nftIdentitiesContract = await NftIdentities.deployed();
    _nftCertificates = await NftCertificates.deployed();
    _nftClassRegistrationContract = await NftClassRegistration.deployed();
    await initTeacher(_nftIdentitiesContract, [accounts[1], accounts[2]]);
    await initStudent(_nftIdentitiesContract, [accounts[3], accounts[4]]);
    await initCourses(_nftSchoolContract);
    await initRegisterTime(_nftSchoolContract);
    await initClasses(_nftSchoolContract);
  });

  describe('test NftCertificates.addToNftCompleteCourseCreationQueue', () => {
    let result;
    let error;
    before(async () => {
      try {
        await _nftClassRegistrationContract.registerClass(
          1,
          classRegistrationInfoURLs[0],
          {
            from: accounts[3],
            value: parseEther('0.5'),
          }
        );
        await _nftClassRegistrationContract.approve(accounts[1], 1, {
          from: accounts[3],
        });
        await _nftCertificates.addToNftCompleteCourseCreationQueue(
          BASE_STUDENT,
          1,
          {
            from: accounts[1],
          }
        );
      } catch (e) {
        error = e;
        console.log(e);
      }
    });

    it('should have result', () => {
      assert(!error);
    });
  });
});
