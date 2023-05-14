'use strict';

const userTable = 'users';
const classesTable = 'classes';
const fkName = 'fk_classes_users';
const indexName = 'idx_users_teacher_token_id';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex(userTable, {
      fields: ['tokenId'],
      name: indexName,
    });
    await queryInterface.addConstraint(classesTable, {
      type: 'foreign key',
      fields: ['teacherTokenId'],
      name: fkName,
      references: {
        table: userTable,
        field: 'tokenId',
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex(userTable, indexName);
    await queryInterface.removeConstraint(classesTable, fkName);
  },
};
