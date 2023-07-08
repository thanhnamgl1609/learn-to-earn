const ethers = require('ethers');
const { STUDENT_ADDRESS, TEACHER_ADDRESS, OWNER } = require('./data');
const { parseTimestamp, addYears } = require('./utils');
const NftIdentities = artifacts.require('NftIdentities');

module.exports = async (callback) => {
  const registerFee = ethers.utils.parseEther('0.05').toString();
  const [nftIdentities] = await Promise.all([NftIdentities.deployed()]);

  for (const { role, link, address } of registrations) {
    await nftIdentities.registerNftIdentity(role, link, {
      from: address,
      value: registerFee,
    });
  }

  for (const { tokenURI, expiredAt, role, applicant } of nftIdentitiesList) {
    await nftIdentities.grantNftIdentity(applicant, role, expiredAt, tokenURI, {
      from: OWNER,
    });
  }

  callback();
};

const registrations = [
  {
    role: 0,
    link: 'https://ipfs.io/ipfs/QmRnc1mRpDvKgwM1qUTnnLGUue7JAjgq8M4a5XruHGmvfH',
    address: STUDENT_ADDRESS,
  },
  {
    role: 1,
    link: 'https://ipfs.io/ipfs/QmZ1s9d9TJxVy6JQmrKCBDVLKSFgUMNg1fA3PuwfKF6ZBi',
    address: TEACHER_ADDRESS,
  },
];

const nftIdentitiesList = [
  {
    tokenURI:
      'https://ipfs.io/ipfs/QmfWzyce4DfJVeLmnmZx7jKYA8kR4Lh3gWGuETL6JF2ZsP',
    expiredAt: parseTimestamp(addYears(new Date(), 4)),
    role: 0,
    applicant: STUDENT_ADDRESS,
  },
  {
    tokenURI:
      'https://ipfs.io/ipfs/QmbDmZpNyzfR8fSbpnXxKz3ic9U4R2tDbDYSPAXALx5L7q',
    expiredAt: parseTimestamp(addYears(new Date(), 1)),
    role: 1,
    applicant: TEACHER_ADDRESS,
  },
];
