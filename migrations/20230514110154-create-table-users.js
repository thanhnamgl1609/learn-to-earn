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
          allowNull: false,
        },
        registerAddress: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        expiredAt: {
          type: Sequelize.DATE,
          allowNull: false,
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
  },

  async down(queryInterface) {
    await queryInterface.dropTable(tableName);
  },
};
