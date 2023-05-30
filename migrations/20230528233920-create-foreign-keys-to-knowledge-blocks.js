'use strict';

const tableNames = ['classes', 'courses'];
const targetTableName = 'knowledge_blocks';
const names = ['fk_classes_knowledge_blocks', 'fk_courses_knowledge_blocks'];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Promise.all(
      tableNames.map((tableName, index) =>
        queryInterface.addConstraint(tableName, {
          type: 'foreign key',
          fields: ['knowledgeBlockId'],
          references: {
            table: targetTableName,
            field: 'onChainId',
          },
          name: names[index],
        })
      )
    );
  },

  async down(queryInterface, Sequelize) {
    await Promise.all(
      names.map((name) => queryInterface.removeConstraint(name))
    );
  },
};
