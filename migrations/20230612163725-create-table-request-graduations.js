'use strict';

const tableName = 'request_graduations';

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
        studentTokenId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          unique: true,
          references: {
            model: 'users',
            key: 'tokenId',
          },
        },
        status: {
          type: Sequelize.INTEGER,
          defaultValue: 1,
        },
        requestDate: {
          type: Sequelize.DATE,
        },
        nationalDefenseEduCertificate: {
          type: Sequelize.STRING,
        },
        foreignLanguageCertificate: {
          type: Sequelize.STRING,
        },
        otherCertificates: {
          type: Sequelize.JSON,
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
