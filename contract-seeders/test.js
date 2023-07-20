const NftCompleteCourses = artifacts.require('NftCompleteCourses');

module.exports = async (callback) => {
  const contract = await NftCompleteCourses.deployed();
  await contract.regainNftCompleteCourses(
    1,
    [65540, 65541, 65537, 65538, 65539],
    {
    from: '0xcCDB2DAE0d65B2ecFe73fAeA58D28D4fDdB9Da1c',
  });

  callback();
};
