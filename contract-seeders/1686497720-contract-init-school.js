const NftSchool = artifacts.require('NftSchool');
const ethers = require('ethers');
const { OWNER } = require('./data');
const { parseTimestamp, addHours } = require('./utils');

module.exports = async (callback) => {
  const [nftSchool] = await Promise.all([NftSchool.deployed()]);
  for (const {
    courseId,
    completeAt,
    maxSize,
    teacherTokenId,
    semesterId,
    registerFee,
    uri,
  } of classesList) {
    await nftSchool.createClass(
      courseId,
      completeAt,
      maxSize,
      teacherTokenId,
      semesterId,
      registerFee,
      uri,
      {
        from: OWNER,
      }
    );
  }
  for (const { semesterId, registerEndAt, registerStartAt } of registerTime) {
    await nftSchool.updateRegisteredTime(
      semesterId,
      registerStartAt,
      registerEndAt,
      {
        from: OWNER,
      }
    );
  }
  callback();
};

const classesList = [
  {
    courseId: 1,
    completeAt: parseTimestamp('2023-08-11 00:00:00'),
    maxSize: 40,
    teacherTokenId: 65537,
    semesterId: 1,
    registerFee: ethers.utils.parseEther('0.5'),
    uri: 'https://ipfs.io/ipfs/QmNPrxbuy3FvUzzvSjEpdvRvAtxd9cCbrB18ppeQUirqsN',
  },
  {
    courseId: 2,
    completeAt: parseTimestamp('2023-08-11 00:00:00'),
    maxSize: 40,
    teacherTokenId: 65537,
    semesterId: 1,
    registerFee: ethers.utils.parseEther('0.5'),
    uri: 'https://ipfs.io/ipfs/QmcZs9VGmrS1yTsbYgHffQUSrr5CiNwae1aXy9VdATZPYG',
  },
  {
    courseId: 2,
    completeAt: parseTimestamp('2023-08-11 00:00:00'),
    maxSize: 40,
    teacherTokenId: 65537,
    semesterId: 1,
    registerFee: ethers.utils.parseEther('0.5'),
    uri: 'https://ipfs.io/ipfs/QmcZs9VGmrS1yTsbYgHffQUSrr5CiNwae1aXy9VdATZPYG',
  },
  {
    courseId: 27,
    completeAt: parseTimestamp('2023-08-11 00:00:00'),
    maxSize: 40,
    teacherTokenId: 65537,
    semesterId: 1,
    registerFee: ethers.utils.parseEther('0.5'),
    uri: 'https://ipfs.io/ipfs/QmdiHGPGKgo2Rz1wfVu2zjF3ReQg5YqKQ7yGiRxqq7MqkB',
  },
  {
    courseId: 26,
    completeAt: parseTimestamp('2023-08-11 00:00:00'),
    maxSize: 40,
    teacherTokenId: 65537,
    semesterId: 1,
    registerFee: ethers.utils.parseEther('0.5'),
    uri: 'https://ipfs.io/ipfs/QmRLmmkfrFR5Tan1AtP1JqVjg189zvhUowBqMEjTXzU5Sp',
  },
];

const registerTime = [
  {
    semesterId: 1,
    registerStartAt: parseTimestamp(new Date(), { endDate: false }),
    registerEndAt: parseTimestamp(addHours(new Date(), 2), { endDate: false }),
  },
];
