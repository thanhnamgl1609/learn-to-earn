const School = artifacts.require("School");

contract('School', (accounts) => {
  const smartContractOwner = accounts[0];
  let _contract = null;

  before(async () => {
    _contract = await School.deployed();
  });

  describe('teacher registration', () => {
    let teacherInfo;
    const teacherAddress = accounts[1];
    const uri = "http://teacher-info.com/1";
    const uri2 = "http://teacher-info.com/2";

    describe('registered teacher', () => {
      before(async () => {
        await _contract.registerTeacher(uri, { from: teacherAddress });
        allRegisteredTeachers = await _contract.getAllRegisteredTeachers({ from: smartContractOwner }); 
        teacherInfo = allRegisteredTeachers.find(({ registeredAddress }) => registeredAddress === teacherAddress);
      });

      it('should register successful', () => {
        assert(!!teacherInfo);
      });

      it('should throw error when try to register again', async () => {
        let err;
        try {
          await _contract.registerTeacher(uri, { from: teacherAddress });
        } catch (e) {
          err = e;
        }

        assert(!!err);
      });
    });

    describe('approve teacher', () => {
      before(async () => {
        teacherInfo = null;
        await _contract.approveTeacher(teacherAddress, { from: smartContractOwner });
      });

      it('should approve successful', async () => {
        allApprovedTeachers = await _contract.getAllApprovedTeachers({ from: smartContractOwner }); 
        teacherInfo = allApprovedTeachers.find(({ registeredAddress }) => registeredAddress === teacherAddress);
        assert(!!teacherInfo);
      });

      it('should approved teacher removed from registration list', async () => {
        allRegisteredTeachers = await _contract.getAllRegisteredTeachers({ from: smartContractOwner }); 
        teacherInfo = allRegisteredTeachers.find(({ registeredAddress }) => registeredAddress === teacherAddress);
        assert(!teacherInfo);
      });

      it('should throw error when teacher try to register again', async () => {
        let err;
        try {
          await _contract.registerTeacher(uri, { from: teacherAddress });
        } catch (e) {
          err = e;
        }

        assert(!!err);
      });
    });

    describe('remove teacher', () => {
      before(async () => {
        teacherInfo = null;
        await _contract.removeTeacher(teacherAddress, { from: smartContractOwner });
      });

      it('should remove successful', async () => {
        allApprovedTeachers = await _contract.getAllApprovedTeachers({ from: smartContractOwner }); 
        teacherInfo = allApprovedTeachers.find(({ registeredAddress }) => registeredAddress === teacherAddress);
        assert(!teacherInfo);
      });
    });

    describe('check permission of approve, reject', () => {
      before(async () => {
        await _contract.registerTeacher(uri2, { from: accounts[2] });
      });

      it('should throw error when approve invalid teacher', async () => {
        let err;
        try {
          await _contract.approveTeacher(accounts[3], { from: smartContractOwner });
        } catch (e) {
          err = e;
        }

        assert(!!err);
      });

      it('should throw error when call approve teacher by other than smart contract owner', async () => {
        let err;
        try {
          await _contract.approveTeacher(accounts[2], { from: accounts[4] });
        } catch (e) {
          err = e;
        }

        assert(!!err);
      });

      it('should throw error when call reject invalid teacher', async () => {
        let err;
        try {
          await _contract.rejectTeacher(teacherAddress, { from: smartContractOwner });
        } catch (e) {
          err = e;
        }

        assert(!!err);
      });

      it('should throw error when call reject teacher by other than smart contract owner', async () => {
        let err;
        try {
          await _contract.rejectTeacher(accounts[2], { from: accounts[4] });
        } catch (e) {
          err = e;
        }

        assert(!!err);
      });
    });

    describe('reject teacher', () => {
      before(async () => {
        await _contract.rejectTeacher(accounts[2], { from: smartContractOwner });
      });
      
      it('should reject successful', async () => {
        allRegisteredTeachers = await _contract.getAllRegisteredTeachers({ from: smartContractOwner }); 
        teacherInfo = allRegisteredTeachers.find(({ registeredAddress }) => registeredAddress === teacherAddress);
        assert(!teacherInfo);
      });
    });
  });
});
