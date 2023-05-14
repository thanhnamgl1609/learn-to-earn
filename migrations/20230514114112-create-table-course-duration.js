'use strict';

const tableName = 'course_durations';

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
        courseId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'courses',
            key: 'id',
          },
          onDelete: 'CASCADE',
        },
        theory: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
        practice: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
        exercise: {
          type: Sequelize.INTEGER,
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(tableName);
  },
};
