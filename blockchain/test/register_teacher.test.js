const { assert } = require('console');
const ethers = require('ethers');
const NftIdentities = artifacts.require('NftIdentities');

const ROLES = { TEACHER: 1 };
const uris = Array(10)
  .fill(' ')
  .map((_, idx) => `http://teacher-info.com/${idx + 1}`);

contract('NftIdentities register teacher', (accounts) => {
  let teacherInfo;
  const smartContractOwner = accounts[0];
  const teacherAddress = accounts[1];
  const _registerPrice = ethers.utils.parseEther('0.05').toString();
  let _contract = null;

  before(async () => {
    _contract = await NftIdentities.deployed();
  });

  describe('teacher registration', () => {
    describe('should register successful', () => {
      before(async () => {
        await _contract.registerNftIdentity(ROLES.TEACHER, uris[0], {
          from: teacherAddress,
          value: _registerPrice,
        });
        const registrationInfos = await _contract.getAllNftIdentityRegistration(
          ROLES.TEACHER,
          { from: smartContractOwner }
        );
        teacherInfo = registrationInfos.find(
          ({ documentURI }) => documentURI === uris[0]
        );
      });

      it('should register successful', () => {
        assert(!!teacherInfo);
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
    let roles;
    let error;

    describe('should approve successful', () => {
      before(async () => {
        await _contract.grantNftIdentity(teacherAddress, expiredAt, uris[0]);
        roles = await _contract.getRoles();
        nftIdentity = await _contract.getOwnedNft(ROLES.TEACHER, {
          from: teacherAddress,
        });
      });

      it('should get nft identity', () => {
        assert(!!nftIdentity);
      });

      it('should has role teacher', () => {
        assert(roles.some((role) => role === ROLES.TEACHER));
      });
    });

    describe('should approve fail when try to approve no existed registration', () => {
      before(async () => {
        error = null;
        try {
          await _contract.grantNftIdentity(teacherAddress, expiredAt, uris[0]);
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
    const expiredAt = 1711640060;
    let roles;
    let error;

    describe('should reject successful', () => {
      before(async () => {
        await _contract.registerNftIdentity(ROLES.TEACHER, uris[2], {
          from: rejectedTeacher,
          value: _registerPrice,
        });
        await _contract.rejectNftIdentityRegistration(rejectedTeacher);
        roles = await _contract.getRoles();
      });

      it('should not have role teacher', () => {
        assert(roles.every((role) => role !== ROLES.TEACHER));
      });
    });

    describe('should reject fail when try to approve no existed registration', () => {
      before(async () => {
        error = null;
        try {
          await _contract.rejectNftIdentityRegistration(rejectedTeacher);
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
