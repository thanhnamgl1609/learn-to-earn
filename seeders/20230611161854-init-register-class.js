'use strict';

const tableName = 'nft_class_registrations';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(tableName, nftClassRegistrations);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(tableName, {
      where: {
        id: nftClassRegistrations.map(({ id }) => id),
      },
    });
  },
};

const nftClassRegistrations = [
  {
    id: 1,
    tokenId: 1,
    classId: 1,
    studentTokenId: 1,
    registerDate: '2023-06-11 16:15:42',
    chainURI:
      'https://ipfs.io/ipfs/QmVKggV84m8PDTBUhDEhftqwrPXNuQU63TrjaAs8xAAiUw',
    isRegained: 0,
    registerFee: 0.5,
  },
  {
    id: 2,
    tokenId: 2,
    classId: 2,
    studentTokenId: 1,
    registerDate: '2023-06-11 03:27:42',
    chainURI:
      'https://ipfs.io/ipfs/QmTgbjhzThN3k1T1ZQcwqbQGp3jUo9q1T6P9HpfNYRiEhu',
    isRegained: 0,
    registerFee: 0.5,
  },
  {
    id: 3,
    tokenId: 3,
    classId: 3,
    studentTokenId: 1,
    registerDate: '2023-06-11 16:53:17',
    chainURI:
      'https://ipfs.io/ipfs/QmQijyu5BJQjtQcMCy9VYnqe7wxPtuJrZoXPj8UfgMvzcC',
    isRegained: 0,
    registerFee: 0.5,
  },
  {
    id: 4,
    tokenId: 4,
    classId: 4,
    studentTokenId: 1,
    registerDate: '2023-06-11 16:53:17',
    chainURI:
      'https://ipfs.io/ipfs/QmXNYdywKMexwVg2wpvgYuepM76MGQT8tKbuoW6Hgd67m4',
    isRegained: 0,
    registerFee: 0.5,
  }
];
