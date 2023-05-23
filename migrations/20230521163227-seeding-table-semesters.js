'use strict';

const tableName = 'semesters';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(tableName, data);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(tableName, {});
  },
};

const data = [
  {
    startYear: 2023,
    endYear: 2024,
    semester: 1,
    startAt: new Date('2023-06-01'),
    endAt: new Date('2023-09-30'),
  },
  {
    startYear: 2023,
    endYear: 2024,
    semester: 2,
    startAt: new Date('2023-10-01'),
    endAt: new Date('2024-01-31'),
  },
  {
    startYear: 2023,
    endYear: 2024,
    semester: 3,
    startAt: new Date('2024-02-01'),
    endAt: new Date('2024-05-31'),
  },
].map((item, index) => ({ ...item, id: index + 1 }));
