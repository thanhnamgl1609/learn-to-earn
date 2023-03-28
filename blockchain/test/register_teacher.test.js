const ethers = require('ethers');
const NftIdentities = artifacts.require('NftIdentities');

const ROLES = { TEACHER: 1 };
const uris = Array(10)
  .fill(' ')
  .map((_, idx) => `http://teacher-info.com/${idx + 1}`);

contract('NftIdentities register teacher', (accounts) => {
  const smartContractOwner = accounts[0];
  const _registerPrice = ethers.utils.parseEther('0.05').toString();
  let _contract = null;

  before(async () => {
    _contract = await NftIdentities.deployed();
  });

  describe('teacher registration', () => {
    let teacherInfo;
    const teacherAddress = accounts[1];

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
    describe('should approve successful', () => {
      beforeAll(() => {
         
      });
    });
  });
});
