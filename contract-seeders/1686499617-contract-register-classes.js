const NftClassRegistration = artifacts.require('NftClassRegistration');
const ethers = require('ethers');
const { STUDENT_ADDRESS } = require('./data');

module.exports = async (callback) => {
  const [nftClassRegistration] = await Promise.all([
    NftClassRegistration.deployed(),
  ]);
  for (const { classId, registerFee, uri } of nftClassRegistrations) {
    await nftClassRegistration.registerClass(classId, uri, {
      from: STUDENT_ADDRESS,
      value: registerFee,
    });
  }
  callback();
};

const nftClassRegistrations = [
  {
    classId: 1,
    uri: 'https://ipfs.io/ipfs/QmVKggV84m8PDTBUhDEhftqwrPXNuQU63TrjaAs8xAAiUw',
    registerFee: ethers.utils.parseEther('0.5'),
  },
  {
    classId: 2,
    uri: 'https://ipfs.io/ipfs/QmTgbjhzThN3k1T1ZQcwqbQGp3jUo9q1T6P9HpfNYRiEhu',
    registerFee: ethers.utils.parseEther('0.5'),
  },
  {
    classId: 3,
    uri: 'https://ipfs.io/ipfs/QmQijyu5BJQjtQcMCy9VYnqe7wxPtuJrZoXPj8UfgMvzcC',
    registerFee: ethers.utils.parseEther('0.5'),
  },
  {
    classId: 4,
    uri: 'https://ipfs.io/ipfs/QmXNYdywKMexwVg2wpvgYuepM76MGQT8tKbuoW6Hgd67m4',
    registerFee: ethers.utils.parseEther('0.5'),
  },
];
