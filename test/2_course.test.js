const School = artifacts.require("School");

contract('School', (accounts) => {
  const smartContractOwner = accounts[0];
  let _contract = null;

  before(async () => {
    _contract = await School.deployed();
  });

  it('', async () => {
    const allApprovedTeachers = await _contract.getAllApprovedTeachers();
    assert.equal(allApprovedTeachers.length, 1);
  });
});
