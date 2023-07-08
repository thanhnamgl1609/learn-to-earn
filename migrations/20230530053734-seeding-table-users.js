'use strict';

const tableName = 'users';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.bulkInsert(tableName, data, {
        transaction,
      });
    });
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete(tableName, {});
  },
};

const data = [
  {
    id: 1,
    tokenId: 0,
    fullName: 'Nguyễn Văn Trỗi',
    memberCode: 'CB0001',
    profileImage: '/images/default_avatar.png',
    gender: 1,
    dateOfBirth: new Date('1989-01-01'),
    email: 'canbo@hcmus.edu.vn',
    personalEmail: 'canbo_me@gmail.com',
    identityNumber: '060001089999',
    phone: '0901090901',
    role: 101,
    status: 1,
    registerAddress: '0x98FB9BF010095517db4C66C358B0286ADB5100d6',
    expiredAt: new Date('3000-01-01'),
    chainURI: '',
  },
];
