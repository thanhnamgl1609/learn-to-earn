'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', users);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', {
      where: {
        id: users.map(({ id }) => id),
      },
    });
  },
};

const users = [
  {
    id: 2,
    profileImage: '/upload/1686454121325_ava1.png',
    fullName: 'Nath Teacher',
    tokenId: 65537,
    memberCode: 'TC000001',
    gender: 0,
    dateOfBirth: '2000-01-01 00:00:00',
    email: null,
    personalEmail: 'nath_teacher@gmail.com',
    identityNumber: '230000001',
    phone: '0900090909',
    role: 1,
    status: 1,
    registerAddress: '0xC86a958f50c6621F79d4684485EAa48a690Ee251',
    expiredAt: '2024-06-11 16:59:59',
    registerDate: '2023-06-11 03:27:43',
    approveDate: '2023-06-11 03:45:58',
    registerURI:
      'https://ipfs.io/ipfs/QmRnc1mRpDvKgwM1qUTnnLGUue7JAjgq8M4a5XruHGmvfH',
    chainURI:
      'https://ipfs.io/ipfs/QmbDmZpNyzfR8fSbpnXxKz3ic9U4R2tDbDYSPAXALx5L7q',
  },
  {
    id: 3,
    profileImage: '/upload/1686454047289_ava1.png',
    fullName: 'Nath',
    tokenId: 1,
    memberCode: 'SV000003',
    gender: 0,
    dateOfBirth: '2000-01-01 00:00:00',
    email: null,
    personalEmail: 'nath@gmail.com',
    identityNumber: '230000000',
    phone: '0900090909',
    role: 0,
    status: 1,
    registerAddress: '0xB91eB802960cb21cBBA3e4C29C73075Bfe51eC8e',
    expiredAt: '2027-06-11 16:59:59',
    registerDate: '2023-06-11 16:59:59',
    approveDate: '2023-06-12 16:59:59',
    registerURI:
      'https://ipfs.io/ipfs/QmRnc1mRpDvKgwM1qUTnnLGUue7JAjgq8M4a5XruHGmvfH',
    chainURI:
      'https://ipfs.io/ipfs/QmfWzyce4DfJVeLmnmZx7jKYA8kR4Lh3gWGuETL6JF2ZsP',
  },
];
