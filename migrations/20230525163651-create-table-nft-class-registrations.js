'use strict';

const tableName = 'nft_class_registrations';

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
        tokenId: {
          type: Sequelize.INTEGER,
        },
        classId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'classes',
            key: 'onChainId',
          },
        },
        studentTokenId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'users',
            key: 'tokenId',
          },
        },
        registerDate: {
          type: Sequelize.DATE,
        },
        chainURI: {
          type: Sequelize.STRING,
        },
        score: {
          type: Sequelize.INTEGER,
          defaultValue: null,
        },
        isExchangeable: {
          type: Sequelize.TINYINT,
          defaultValue: 0, 
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(tableName);
  },
};
