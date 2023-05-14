'use strict';

const tableName = 'classes';
const columnName = 'semesterId';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(tableName, columnName, {
      type: Sequelize.INTEGER,
      references: {
        model: 'semesters',
        key: 'id',
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn(tableName, columnName);
  },
};
