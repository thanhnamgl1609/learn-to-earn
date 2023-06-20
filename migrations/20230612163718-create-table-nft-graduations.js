'use strict';

const tableName = 'nft_graduations';

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
          references: {
            model: 'users',
            key: 'tokenId',
          },
        },
        tokenId: {
          type: Sequelize.INTEGER,
        },
        grantDate: {
          type: Sequelize.DATE,
        },
        uri: {
          type: Sequelize.STRING,
        },
        requestGraduationId: {
          type: Sequelize.NUMBER,
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
