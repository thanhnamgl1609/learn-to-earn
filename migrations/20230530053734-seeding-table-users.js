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
    registerAddress: '0xc1d63c78F37eA2CFEbD1D076c909b98a7B7E5432',
    expiredAt: new Date('3000-01-01'),
    chainURI: '',
  },
];
