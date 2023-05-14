'use strict';

const tableName = 'courses';

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
        courseCode: {
          type: Sequelize.STRING(8),
        },
        prevCourseId: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: tableName,
            key: 'id',
          },
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        credits: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        status: {
          type: Sequelize.INTEGER,
          defaultValue: 1,
        },
        description: {
          type: Sequelize.TEXT,
          defaultValue: '',
        },
        isRequired: {
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
    await queryInterface.addIndex(tableName, ['courseCode']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable(tableName);
  },
};
