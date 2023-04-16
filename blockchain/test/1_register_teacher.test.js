const assert = require('power-assert');
const ethers = require('ethers');
const { ROLES } = require('./testdata/constants');
const NftIdentities = artifacts.require('NftIdentities');

const uris = Array(10)
  .fill(' ')
  .map((_, idx) => `http://teacher-info.com/${idx + 1}`);
const testFuncs = [
  'registerNftIdentity',
  'getAllOwnedRegistrationInfos',
  'getAllRegistrationInfosByRole',
  'getOwnedNfts',
  'rejectNftIdentityRegistration',
].join(', ');

contract(`NftIdentities register teacher ${testFuncs}`, (accounts) => {
  const teacherAddress = accounts[1];
  const _registerPrice = ethers.utils.parseEther('0.05').toString();
  let _contract = null;

  before(async () => {
    _contract = await NftIdentities.deployed();
  });

  describe('teacher registration', () => {
    describe('should register successful', () => {
      let registrationTeacherInfo;
      let allRegistrationInfos;

      before(async () => {
        await _contract.registerNftIdentity(ROLES.TEACHER, uris[0], {
          from: teacherAddress,
          value: _registerPrice,
        });
        const registrationInfos = await _contract.getAllOwnedRegistrationInfos({
          from: teacherAddress,
        });
        allRegistrationInfos = await _contract.getAllRegistrationInfosByRole(
          ROLES.TEACHER
        );
        registrationTeacherInfo = registrationInfos.find(
          ({ role }) => parseInt(role) === ROLES.TEACHER
        );
      });

      it('should register successful', () => {
        assert(!!registrationTeacherInfo);
      });

      it('should register correct info', () => {
        assert(registrationTeacherInfo.detail.documentURI, uris[0]);
      });

      it('should all registration infos have new application', () => {
        assert(allRegistrationInfos.length === 1);
      });

      it('should throw error when try to register again', async () => {
        let err;
        try {
          await _contract.registerNftIdentity(ROLES.TEACHER, uris[1], {
            from: teacherAddress,
          });
        } catch (e) {
          err = e;
        }

        assert(!!err);
      });
    });

    describe('should register fail when use no values', () => {
      let err;
      before(async () => {
        try {
          await _contract.registerNftIdentity(ROLES.TEACHER, uris[1], {
            from: teacherAddress,
          });
        } catch (e) {
          err = e;
        }
      });

      it('should throw error when try to register again', async () => {
        assert(!!err);
      });
    });

    describe('should register fail when give wrong role', () => {
      let err;
      before(async () => {
        try {
          await _contract.registerNftIdentity(999, uris[1], {
            from: teacherAddress,
          });
        } catch (e) {
          err = e;
        }
      });

      it('should throw error when try to register again', async () => {
        assert(!!err);
      });
    });
  });

  describe('grant NFT Identity for teacher', () => {
    const expiredAt = 1711640060;
    let nftIdentity;
    let registrationInfo;
    let error;
    let allMembers;

    describe('should approve successful', () => {
      before(async () => {
        await _contract.grantNftIdentity(
          teacherAddress,
          ROLES.TEACHER,
          expiredAt,
          uris[0]
        );
        const registrationInfos = await _contract.getAllOwnedRegistrationInfos({
          from: teacherAddress,
        });
        registrationInfo = registrationInfos.find(
          ({ role }) => parseInt(role) === ROLES.TEACHER
        );

        const nftIdentities = await _contract.getOwnedNfts({
          from: teacherAddress,
        });
        nftIdentity = nftIdentities.find(
          ({ role }) => parseInt(role) === ROLES.TEACHER
        );

        allMembers = await _contract.getAllMembers(ROLES.TEACHER);
      });

      it('should has nft identity with teacher role', () => {
        assert(!!nftIdentity);
      });

      it('should registration be deleted', () => {
        assert(!registrationInfo);
      });

      it('should have 1 member', () => {
        assert(allMembers.length, 1);
      })
    });

    describe('should approve fail when try to approve no existed registration', () => {
      before(async () => {
        error = null;
        try {
          await _contract.grantNftIdentity(
            teacherAddress,
            ROLES.TEACHER,
            expiredAt,
            uris[0]
          );
        } catch (e) {
          error = e;
        }
      });

      it('should throw error', () => {
        assert(!!error);
      });
    });
  });

  describe('reject NFT Identity for teacher', () => {
    const rejectedTeacher = accounts[2];
    let registrationInfo;
    let error;

    describe('should reject successful', () => {
      before(async () => {
        await _contract.registerNftIdentity(ROLES.TEACHER, uris[2], {
          from: rejectedTeacher,
          value: _registerPrice,
        });
        await _contract.rejectNftIdentityRegistration(
          rejectedTeacher,
          ROLES.TEACHER
        );
        const registrationInfos = await _contract.getAllOwnedRegistrationInfos({
          from: rejectedTeacher,
        });
        registrationInfo = registrationInfos.find(
          ({ role }) => ROLES.TEACHER === parseInt(role)
        );
      });

      it('should not have role teacher', () => {
        assert(!registrationInfo);
      });
    });

    describe('should reject fail when try to approve no existed registration', () => {
      before(async () => {
        error = null;
        try {
          await _contract.rejectNftIdentityRegistration(
            rejectedTeacher,
            ROLES.TEACHER
          );
        } catch (e) {
          error = e;
        }
      });

      it('should throw error', () => {
        assert(!!error);
      });
    });
  });
});
