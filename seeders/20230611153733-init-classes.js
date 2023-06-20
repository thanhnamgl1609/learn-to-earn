'use strict';

const tableName = 'classes';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(tableName, classes);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(tableName, {
      where: {
        id: classes.map(({ id }) => id),
      },
    });
  },
};

const classes = [
  {
    id: 1,
    onChainId: 1,
    courseCode: 'BAA00101',
    knowledgeBlockId: 1,
    credits: 3,
    startAt: '2023-07-11 00:00:00',
    completeAt: '2023-08-11 00:00:00',
    maxSize: 40,
    numberOfStudents: 0,
    teacherTokenId: 65537,
    chainURI:
      'https://ipfs.io/ipfs/QmNPrxbuy3FvUzzvSjEpdvRvAtxd9cCbrB18ppeQUirqsN',
    semesterId: 1,
  },
  {
    id: 2,
    onChainId: 2,
    courseCode: 'BAA00102',
    knowledgeBlockId: 1,
    credits: 2,
    startAt: '2023-07-11 00:00:00',
    completeAt: '2023-08-11 00:00:00',
    maxSize: 40,
    numberOfStudents: 0,
    teacherTokenId: 65537,
    chainURI:
      'https://ipfs.io/ipfs/QmcZs9VGmrS1yTsbYgHffQUSrr5CiNwae1aXy9VdATZPYG',
    semesterId: 1,
  },
  {
    id: 3,
    onChainId: 3,
    courseCode: 'CSC10008',
    knowledgeBlockId: 2,
    credits: 4,
    startAt: '2023-07-11 00:00:00',
    completeAt: '2023-08-11 00:00:00',
    maxSize: 40,
    numberOfStudents: 0,
    teacherTokenId: 65537,
    chainURI:
      'https://ipfs.io/ipfs/QmdiHGPGKgo2Rz1wfVu2zjF3ReQg5YqKQ7yGiRxqq7MqkB',
    semesterId: 1,
  },
  {
    id: 4,
    onChainId: 4,
    courseCode: 'CSC10007',
    knowledgeBlockId: 2,
    credits: 4,
    startAt: '2023-07-11 00:00:00',
    completeAt: '2023-08-11 00:00:00',
    maxSize: 40,
    numberOfStudents: 0,
    teacherTokenId: 65537,
    chainURI:
      'https://ipfs.io/ipfs/QmRLmmkfrFR5Tan1AtP1JqVjg189zvhUowBqMEjTXzU5Sp',
    semesterId: 1,
  },
];
