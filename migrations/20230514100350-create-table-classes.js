'use strict';

const tableName = 'classes';

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
        onChainId: {
          type: Sequelize.INTEGER,
          unique: true,
        },
        courseCode: {
          type: Sequelize.STRING(8),
          allowNull: false,
          references: {
            model: 'courses',
            key: 'courseCode',
          },
        },
        knowledgeBlockId: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        credits: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        startAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        completeAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        maxSize: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
        numberOfStudents: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
        teacherTokenId: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
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
    await queryInterface.addIndex(tableName, ['onChainId']);
    await queryInterface.addIndex(tableName, ['courseCode']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable(tableName);
  },
};
