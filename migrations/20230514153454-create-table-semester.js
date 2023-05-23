'use strict';

const tableName = 'semesters';

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
        startYear: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        endYear: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        semester: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        startAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        endAt: {
          type: Sequelize.DATE,
          allowNull: false,
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
    await queryInterface.addConstraint(tableName, {
      type: 'unique',
      fields: ['startYear', 'endYear', 'semester'],
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable(tableName);
  },
};
