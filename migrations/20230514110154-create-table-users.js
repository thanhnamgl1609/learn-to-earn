'use strict';

const tableName = 'users';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      tableName,
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        profileImage: {
          type: Sequelize.STRING,
        },
        fullName: {
          type: Sequelize.STRING,
        },
        tokenId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          unique: true,
        },
        memberCode: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        gender: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
        dateOfBirth: {
          type: Sequelize.DATE,
        },
        email: {
          type: Sequelize.STRING,
        },
        personalEmail: {
          type: Sequelize.STRING,
        },
        identityNumber: {
          type: Sequelize.STRING,
        },
        phone: {
          type: Sequelize.STRING(10),
        },
        role: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        status: {
          type: Sequelize.INTEGER,
          defaultValue: 1,
        },
        registerAddress: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        expiredAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        registerDate: {
          type: Sequelize.DATE,
        },
        approveDate: {
          type: Sequelize.DATE,
        },
        registerURI: {
          type: Sequelize.STRING,
          defaultValue: '',
        },
        chainURI: {
          type: Sequelize.STRING,
        },
        createdAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('current_timestamp'),
        },
        updatedAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('current_timestamp'),
          onUpdate: Sequelize.literal('current_timestamp'),
        },
      },
      {
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
      }
    );
    await queryInterface.addIndex(tableName, ['tokenId']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable(tableName);
  },
};
