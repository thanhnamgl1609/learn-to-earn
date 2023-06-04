'use strict';

const tableName = 'nft_complete_courses';

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
        classId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'classes',
            key: 'onChainId',
          },
        },
        tokenId: {
          type: Sequelize.INTEGER,
        },
        knowledgeBlockId: {
          type: Sequelize.INTEGER,
        },
        avgScore: {
          type: Sequelize.FLOAT,
        },
        grantDate: {
          type: Sequelize.DATE,
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
