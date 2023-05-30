'use strict';

const tableName = 'knowledge_blocks';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.bulkInsert(tableName, data, {
        transaction,
      });
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(tableName, {});
  },
};

const data = [
  {
    id: 1,
    onChainId: 1,
    credits: 56,
    name: 'Kiến thức giáo dục đại cương',
  },
  {
    id: 2,
    onChainId: 2,
    credits: 38,
    name: 'Kiến thức cơ sở ngành',
  },
  {
    id: 3,
    onChainId: 3,
    credits: 34,
    name: 'Kiến thức chuyên ngành',
  },
  {
    id: 4,
    onChainId: 4,
    credits: 10,
    name: 'Kiến thức tốt nghiệp',
  },
];
