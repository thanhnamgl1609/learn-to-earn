'use strict';

const tableName = 'knowledge_blocks';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(tableName, {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
      },
      onChainId: {
        type: Sequelize.INTEGER,
      },
      credits: {
        type: Sequelize.INTEGER,
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
      deletedAt: {
        type: Sequelize.DATE,
        defaultValue: null,
      },
    });
    await queryInterface.addIndex(tableName, ['onChainId']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(tableName, {});
  },
};
