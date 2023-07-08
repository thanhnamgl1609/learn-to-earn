const { parseEther } = require('ethers/lib/utils');
const assert = require('power-assert');
const { classRegistrationInfoURLs } = require('./testdata/common');
const { BASE_STUDENT, ROLES } = require('./testdata/constants');
const School = artifacts.require('School');
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
  let _schoolContract;
  let _nftIdentitiesContract;
  let _nftClassRegistrationContract;
  let _nftCertificates;

  before(async () => {
    _schoolContract = await School.deployed();
    _nftIdentitiesContract = await NftIdentities.deployed();
    _nftCertificates = await NftCertificates.deployed();
    _nftClassRegistrationContract = await NftClassRegistration.deployed();
    await initTeacher(_nftIdentitiesContract, [accounts[1], accounts[2]]);
    await initStudent(_nftIdentitiesContract, [accounts[3], accounts[4]]);
    await initCourses(_schoolContract);
    await initRegisterTime(_schoolContract);
    await initClasses(_schoolContract);
  });
});
