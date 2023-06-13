'use strict';

const tableName = 'nft_complete_course_graduation_relations';

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
        nftCompleteCourseId: {
          type: Sequelize.INTEGER,
        },
        nftGraduationId: {
          type: Sequelize.INTEGER,
        },
        requestGraduationId: {
          type: Sequelize.INTEGER,
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

  async down(queryInterface) {
    await queryInterface.dropTable(tableName);
  },
};
