'use strict';

const tableName = 'nft_class_registrations';
const columnName = 'isRegained';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(tableName, columnName, {
      type: Sequelize.TINYINT,
      defaultValue: 0,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn(tableName, columnName);
  },
};
