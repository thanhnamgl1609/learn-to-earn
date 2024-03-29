'use strict';

const tableName = 'courses';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.bulkInsert(tableName, data1, {
        transaction,
      });
    });
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete(tableName, {});
  },
};

const data = [
  {
    id: 1,
    knowledgeBlockId: 1,
    courseCode: 'BAA00101',
    name: 'Triết học Mác - Lênin',
    credits: 3,
    status: 1,
    theoryLessons: 45,
    practiceLessons: 0,
    exerciseLessons: 0,
    description: null,
    isRequired: 1,
    chainURI:
      'https://ipfs.io/ipfs/QmfL8JhYFavwy28RagJ4BksPcktbWS4YQ5uE3kgXewsa3E',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 14:58:48',
    prevCourseId: null,
  },
  {
    id: 2,
    knowledgeBlockId: 1,
    courseCode: 'BAA00102',
    name: 'Kinh tế chính trị Mác - Lênin',
    credits: 2,
    status: 1,
    theoryLessons: 30,
    practiceLessons: 0,
    exerciseLessons: 0,
    description: null,
    isRequired: 1,
    chainURI:
      'https://ipfs.io/ipfs/QmdC4G1YDmP5tT3bBva7osXx7RySnxuWcykW2Rv8prNsbz',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 14:58:51',
    prevCourseId: null,
  },
  {
    id: 3,
    knowledgeBlockId: 1,
    courseCode: 'BAA00103',
    name: 'Chủ nghĩa xã hội khoa học',
    credits: 2,
    status: 1,
    theoryLessons: 30,
    practiceLessons: 0,
    exerciseLessons: 0,
    description: null,
    isRequired: 1,
    chainURI:
      'https://ipfs.io/ipfs/QmU9QZSxGQxHXhhuB7NFZ8YMgQ4cnT9tEfoCQqCPTADZbJ',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 14:58:53',
    prevCourseId: null,
  },
  {
    id: 4,
    knowledgeBlockId: 1,
    courseCode: 'BAA00104',
    name: 'Lịch sử Đảng Cộng sản Việt Nam',
    credits: 2,
    status: 1,
    theoryLessons: 30,
    practiceLessons: 0,
    exerciseLessons: 0,
    description: null,
    isRequired: 1,
    chainURI:
      'https://ipfs.io/ipfs/QmdDCw21TjPf1RJNJuKuX4mrx7Je94RTxB7xadvbYbFvnY',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 14:58:57',
    prevCourseId: null,
  },
  {
    id: 5,
    knowledgeBlockId: 1,
    courseCode: 'BAA00003',
    name: 'Tư tưởng Hồ Chí Minh',
    credits: 2,
    status: 1,
    theoryLessons: 30,
    practiceLessons: 0,
    exerciseLessons: 0,
    description: null,
    isRequired: 1,
    chainURI:
      'https://ipfs.io/ipfs/Qmd4CEM7Q9AT1thk9ZdzJUGFET21ryEkHa5ezRxjKBrRty',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 14:59:00',
    prevCourseId: null,
  },
  {
    id: 6,
    knowledgeBlockId: 1,
    courseCode: 'BAA00004',
    name: 'Pháp luật đại cương',
    credits: 3,
    status: 1,
    theoryLessons: 45,
    practiceLessons: 0,
    exerciseLessons: 0,
    description: null,
    isRequired: 1,
    chainURI:
      'https://ipfs.io/ipfs/QmPqZDqvqygsJG87dG1UBjvQKAg5yhFMgTPxvsJaVaJjsB',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 14:59:03',
    prevCourseId: null,
  },
  {
    id: 7,
    knowledgeBlockId: 1,
    courseCode: 'BAA00005',
    name: 'Kinh tế đại cương',
    credits: 2,
    status: 1,
    theoryLessons: 30,
    practiceLessons: 0,
    exerciseLessons: 0,
    description: null,
    isRequired: 0,
    chainURI:
      'https://ipfs.io/ipfs/QmNpNPrN9rCS513TtrCTy2ER2NBX9dTzxJogosq1JGRVk5',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 14:59:07',
    prevCourseId: null,
  },
  {
    id: 8,
    knowledgeBlockId: 1,
    courseCode: 'BAA00006',
    name: 'Tâm lý đại cương',
    credits: 2,
    status: 1,
    theoryLessons: 30,
    practiceLessons: 0,
    exerciseLessons: 0,
    description: null,
    isRequired: 0,
    chainURI:
      'https://ipfs.io/ipfs/QmcUSPK8KNN7xwSnEmPzXJSWbDL4gZHRKzfAQ4RkUYoVwj',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 14:59:10',
    prevCourseId: null,
  },
  {
    id: 9,
    knowledgeBlockId: 1,
    courseCode: 'BAA00007',
    name: 'Phương pháp luận sáng tạo',
    credits: 2,
    status: 1,
    theoryLessons: 30,
    practiceLessons: 0,
    exerciseLessons: 0,
    description: null,
    isRequired: 0,
    chainURI:
      'https://ipfs.io/ipfs/QmdLJQHVu2nM8JpXg1BaH5z6X6K1mpLLme5ZSmzR1qNek6',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 14:59:13',
    prevCourseId: null,
  },
  {
    id: 10,
    knowledgeBlockId: 1,
    courseCode: 'MTH00005',
    name: 'Vi tích phân 1',
    credits: 4,
    status: 1,
    theoryLessons: 45,
    practiceLessons: 30,
    exerciseLessons: 0,
    description: null,
    isRequired: 1,
    chainURI:
      'https://ipfs.io/ipfs/QmaFQgAfVehzY3H9cWrGSgyawQuySbyd7oqRXmQbpo6dau',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 14:59:16',
    prevCourseId: null,
  },
  {
    id: 11,
    knowledgeBlockId: 1,
    courseCode: 'MTH00006',
    name: 'Vi tích phân 2',
    credits: 4,
    status: 1,
    theoryLessons: 45,
    practiceLessons: 30,
    exerciseLessons: 0,
    description: null,
    isRequired: 1,
    chainURI:
      'https://ipfs.io/ipfs/QmPNLGiMbhNXHTzqPBcAPKtTX1pZTVUBSURXn934YyT6kY',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 14:59:19',
    prevCourseId: null,
  },
  {
    id: 12,
    knowledgeBlockId: 1,
    courseCode: 'MTH00007',
    name: 'Xác suất thống kê',
    credits: 4,
    status: 1,
    theoryLessons: 45,
    practiceLessons: 30,
    exerciseLessons: 0,
    description: null,
    isRequired: 1,
    chainURI:
      'https://ipfs.io/ipfs/QmRmForSpikdSifWRrcwtZ71aErYHL959L1QW1hUFn1XHP',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 14:59:22',
    prevCourseId: null,
  },
  {
    id: 13,
    knowledgeBlockId: 1,
    courseCode: 'MTH00008',
    name: 'Đại số tuyến tính',
    credits: 4,
    status: 1,
    theoryLessons: 45,
    practiceLessons: 30,
    exerciseLessons: 0,
    description: null,
    isRequired: 1,
    chainURI:
      'https://ipfs.io/ipfs/QmcSUSyvCS8xSyf3hWVZbXdrSjxjGK5GZUrgs2uD8317Jw',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 14:59:25',
    prevCourseId: null,
  },
  {
    id: 14,
    knowledgeBlockId: 1,
    courseCode: 'MTH00009',
    name: 'Toán rời rạc',
    credits: 4,
    status: 1,
    theoryLessons: 45,
    practiceLessons: 30,
    exerciseLessons: 0,
    description: null,
    isRequired: 1,
    chainURI:
      'https://ipfs.io/ipfs/QmYbHUYkh7Mq41xF9vQ8Q1U2YNTAKNYCsG85sAmmX5iEyE',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 14:59:29',
    prevCourseId: null,
  },
  {
    id: 15,
    knowledgeBlockId: 1,
    courseCode: 'MTH00050',
    name: 'Toán học tổ hợp',
    credits: 4,
    status: 1,
    theoryLessons: 45,
    practiceLessons: 30,
    exerciseLessons: 0,
    description: null,
    isRequired: 1,
    chainURI:
      'https://ipfs.io/ipfs/Qmc95cPeRmK4vDs42PqwL5PZaimCTJSo6iHcxKLpWuYxbB',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 14:59:32',
    prevCourseId: null,
  },
  {
    id: 16,
    knowledgeBlockId: 1,
    courseCode: 'CSC00004',
    name: 'Nhập môn Công nghệ thông tin',
    credits: 4,
    status: 1,
    theoryLessons: 45,
    practiceLessons: 30,
    exerciseLessons: 0,
    description: null,
    isRequired: 1,
    chainURI:
      'https://ipfs.io/ipfs/QmcB9xQ4EbiP2RxaHt12W81dCjL7vkTfrh7eJQZkLB4Jha',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 14:59:35',
    prevCourseId: null,
  },
  {
    id: 17,
    knowledgeBlockId: 1,
    courseCode: 'MTH00051',
    name: 'Toán ứng dụng và thống kê',
    credits: 4,
    status: 1,
    theoryLessons: 45,
    practiceLessons: 30,
    exerciseLessons: 0,
    description: null,
    isRequired: 0,
    chainURI:
      'https://ipfs.io/ipfs/QmfRmwQKwm6nKVWyEEV7krtSiaoZSbuygaJr8TkuNopog4',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 14:59:38',
    prevCourseId: null,
  },
  {
    id: 18,
    knowledgeBlockId: 1,
    courseCode: 'MTH00052',
    name: 'Phương pháp tính',
    credits: 4,
    status: 1,
    theoryLessons: 45,
    practiceLessons: 30,
    exerciseLessons: 0,
    description: null,
    isRequired: 0,
    chainURI:
      'https://ipfs.io/ipfs/QmS3aj9rjSNteiC6U9QEDzg4jLfeEp3cEJTx1bMKWgXDgr',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 14:59:41',
    prevCourseId: null,
  },
  {
    id: 19,
    knowledgeBlockId: 1,
    courseCode: 'MTH00053',
    name: 'Lý thuyết số',
    credits: 4,
    status: 1,
    theoryLessons: 45,
    practiceLessons: 30,
    exerciseLessons: 0,
    description: null,
    isRequired: 0,
    chainURI:
      'https://ipfs.io/ipfs/Qme8eFseRb5pEUgpABKuadeNTT8gjVd8QHkAzrzB1V8QHZ',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 14:59:45',
    prevCourseId: null,
  },
  {
    id: 20,
    knowledgeBlockId: 1,
    courseCode: 'MTH00054',
    name: 'Phép tính vị từ',
    credits: 4,
    status: 1,
    theoryLessons: 45,
    practiceLessons: 30,
    exerciseLessons: 0,
    description: null,
    isRequired: 0,
    chainURI:
      'https://ipfs.io/ipfs/QmdgP7ehF4wb9WRJycugtQm7Y3PMi2nMiFqCcacbtkYEYu',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 14:59:51',
    prevCourseId: null,
  },
  {
    id: 21,
    knowledgeBlockId: 2,
    courseCode: 'CSC10001',
    name: 'Nhập môn lập trình',
    credits: 4,
    status: 1,
    theoryLessons: 45,
    practiceLessons: 30,
    exerciseLessons: 0,
    description: null,
    isRequired: 1,
    chainURI:
      'https://ipfs.io/ipfs/QmV61VLEwbwpFgwkZbJYTCkMNZaa1hyYs294KmovcuK4nv',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 14:59:55',
    prevCourseId: null,
  },
  {
    id: 22,
    knowledgeBlockId: 2,
    courseCode: 'CSC10002',
    name: 'Kỹ thuật lập trình',
    credits: 4,
    status: 1,
    theoryLessons: 45,
    practiceLessons: 30,
    exerciseLessons: 0,
    description: null,
    isRequired: 1,
    chainURI:
      'https://ipfs.io/ipfs/QmQvwqv9xT1nKhbRusmyay2inYjmU7pxAktXrYrUf8VstX',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 14:59:59',
    prevCourseId: null,
  },
  {
    id: 23,
    knowledgeBlockId: 2,
    courseCode: 'CSC10003',
    name: 'Phương pháp lập trình hướng đối tượng',
    credits: 4,
    status: 1,
    theoryLessons: 45,
    practiceLessons: 30,
    exerciseLessons: 0,
    description: null,
    isRequired: 1,
    chainURI:
      'https://ipfs.io/ipfs/QmWWniFfJZ61PhDm1H1aZWxHiaep7GkYxenMcpDXmYZQQT',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 15:00:02',
    prevCourseId: null,
  },
  {
    id: 24,
    knowledgeBlockId: 2,
    courseCode: 'CSC10004',
    name: 'Cấu trúc dữ liệu và giải thuật',
    credits: 4,
    status: 1,
    theoryLessons: 45,
    practiceLessons: 30,
    exerciseLessons: 0,
    description: null,
    isRequired: 1,
    chainURI:
      'https://ipfs.io/ipfs/QmRLmaQVfiK6GnXe8H5JhvjxwV26q35NkYGdb3pXFsZr92',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 15:00:05',
    prevCourseId: null,
  },
  {
    id: 25,
    knowledgeBlockId: 2,
    courseCode: 'CSC10006',
    name: 'Cơ sở dữ liệu',
    credits: 4,
    status: 1,
    theoryLessons: 45,
    practiceLessons: 30,
    exerciseLessons: 0,
    description: null,
    isRequired: 1,
    chainURI:
      'https://ipfs.io/ipfs/QmYmBzs7DXv8MUYZUDYDCpZwJ4WMdfa87K1tTRAdvPqVRj',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 15:00:08',
    prevCourseId: null,
  },
  {
    id: 26,
    knowledgeBlockId: 2,
    courseCode: 'CSC10007',
    name: 'Hệ điều hành',
    credits: 4,
    status: 1,
    theoryLessons: 45,
    practiceLessons: 30,
    exerciseLessons: 0,
    description: null,
    isRequired: 1,
    chainURI:
      'https://ipfs.io/ipfs/QmQJ7RbU3Y5RnGXc1igVfEbzZg79HgG3AY5YXivLJwHQhb',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 15:00:11',
    prevCourseId: null,
  },
  {
    id: 27,
    knowledgeBlockId: 2,
    courseCode: 'CSC10008',
    name: 'Mạng máy tính',
    credits: 4,
    status: 1,
    theoryLessons: 45,
    practiceLessons: 30,
    exerciseLessons: 0,
    description: null,
    isRequired: 1,
    chainURI:
      'https://ipfs.io/ipfs/QmeSz7jpnnCnNjrYAkEixZjH8qoV6n5Tx8bsbquvq69Wek',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 15:00:14',
    prevCourseId: null,
  },
  {
    id: 28,
    knowledgeBlockId: 2,
    courseCode: 'CSC10009',
    name: 'Hệ thống máy tính',
    credits: 2,
    status: 1,
    theoryLessons: 30,
    practiceLessons: 0,
    exerciseLessons: 0,
    description: null,
    isRequired: 1,
    chainURI:
      'https://ipfs.io/ipfs/QmNunn4mjTS5unoJ9ezzLoeNZhy2ujMk3rYN9G3TrjJp2e',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 15:00:17',
    prevCourseId: null,
  },
  {
    id: 29,
    knowledgeBlockId: 2,
    courseCode: 'CSC13002',
    name: 'Nhập môn công nghệ phần mềm',
    credits: 4,
    status: 1,
    theoryLessons: 45,
    practiceLessons: 30,
    exerciseLessons: 0,
    description: null,
    isRequired: 1,
    chainURI:
      'https://ipfs.io/ipfs/QmQNBnxaqLvqCiCga3XoTAX74DY7T35pH5MFfsFjEvU45z',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 15:00:20',
    prevCourseId: null,
  },
  {
    id: 30,
    knowledgeBlockId: 2,
    courseCode: 'CSC14003',
    name: 'Cơ sở trí tuệ nhân tạo',
    credits: 4,
    status: 1,
    theoryLessons: 45,
    practiceLessons: 30,
    exerciseLessons: 0,
    description: null,
    isRequired: 1,
    chainURI:
      'https://ipfs.io/ipfs/Qmf1gpa1Bd2qhXa76hHaYFbtBkDEBr7ij7bv7C5xvRAZSh',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 15:00:23',
    prevCourseId: null,
  },
  {
    id: 31,
    knowledgeBlockId: 3,
    courseCode: 'CSC13003',
    name: 'Kiểm thử phần mềm',
    credits: 4,
    status: 1,
    theoryLessons: 45,
    practiceLessons: 30,
    exerciseLessons: 0,
    description: null,
    isRequired: 0,
    chainURI:
      'https://ipfs.io/ipfs/QmQgJmCgDTSAwgXu65n4d4FuJNoLgcEnS7RHkGUuQ4y6Su',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 15:00:27',
    prevCourseId: null,
  },
  {
    id: 32,
    knowledgeBlockId: 3,
    courseCode: 'CSC13005',
    name: 'Phân tích và quản lý yêu cầu phần mềm',
    credits: 4,
    status: 1,
    theoryLessons: 45,
    practiceLessons: 30,
    exerciseLessons: 0,
    description: null,
    isRequired: 0,
    chainURI:
      'https://ipfs.io/ipfs/QmfA1pU8oviBPnGNt5AnA5nJZeM2pSzKxNtnsWE8Pyq5T2',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 15:00:30',
    prevCourseId: null,
  },
  {
    id: 33,
    knowledgeBlockId: 3,
    courseCode: 'CSC13006',
    name: 'Quản lý dự án phần mềm',
    credits: 4,
    status: 1,
    theoryLessons: 45,
    practiceLessons: 30,
    exerciseLessons: 0,
    description: null,
    isRequired: 0,
    chainURI:
      'https://ipfs.io/ipfs/QmQRET9AV8vvRZN4RkvTGpQTKx7bwHLD4SFt7DTrseTkgf',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 15:00:33',
    prevCourseId: null,
  },
  {
    id: 34,
    knowledgeBlockId: 3,
    courseCode: 'CSC13007',
    name: 'Phát triển game',
    credits: 4,
    status: 1,
    theoryLessons: 45,
    practiceLessons: 30,
    exerciseLessons: 0,
    description: null,
    isRequired: 0,
    chainURI:
      'https://ipfs.io/ipfs/QmPtiL69YSt6V7M5rfNi5oZPsuB1GLoU4yWTqmiGqbEUWy',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 15:00:36',
    prevCourseId: null,
  },
  {
    id: 35,
    knowledgeBlockId: 3,
    courseCode: 'CSC13008',
    name: 'Phát triển ứng dụng web',
    credits: 4,
    status: 1,
    theoryLessons: 45,
    practiceLessons: 30,
    exerciseLessons: 0,
    description: null,
    isRequired: 0,
    chainURI:
      'https://ipfs.io/ipfs/QmdPfUPyjaYJgwBQGUiTbRrdEaQZEag9dhx8TLqYP4U1gN',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 15:00:39',
    prevCourseId: null,
  },
  {
    id: 36,
    knowledgeBlockId: 3,
    courseCode: 'CSC13009',
    name: 'Phát triển phần mềm cho thiết bị di động',
    credits: 4,
    status: 1,
    theoryLessons: 45,
    practiceLessons: 30,
    exerciseLessons: 0,
    description: null,
    isRequired: 0,
    chainURI:
      'https://ipfs.io/ipfs/QmSuAaQKt5W6LJ5kAz59yuC7yMENVLd1WK4YH6KGBmKPib',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 15:00:42',
    prevCourseId: null,
  },
  {
    id: 37,
    knowledgeBlockId: 3,
    courseCode: 'CSC13010',
    name: 'Thiết kế phần mềm',
    credits: 4,
    status: 1,
    theoryLessons: 45,
    practiceLessons: 30,
    exerciseLessons: 0,
    description: null,
    isRequired: 0,
    chainURI:
      'https://ipfs.io/ipfs/QmQETeK1dYFSGMahJj1kMc2AaAMoJsK8UhE3eaQe4MRuFh',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 15:00:45',
    prevCourseId: null,
  },
  {
    id: 38,
    knowledgeBlockId: 3,
    courseCode: 'CSC13106',
    name: 'Kiến trúc phần mềm',
    credits: 4,
    status: 1,
    theoryLessons: 45,
    practiceLessons: 30,
    exerciseLessons: 0,
    description: null,
    isRequired: 0,
    chainURI:
      'https://ipfs.io/ipfs/QmZJ4RjEqzuTfJGWTXSj2ajMfqHJwhRMsmxpeCnhwWVHem',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 15:00:48',
    prevCourseId: null,
  },
  {
    id: 39,
    knowledgeBlockId: 3,
    courseCode: 'CSC13112',
    name: 'Thiết kế giao diện',
    credits: 4,
    status: 1,
    theoryLessons: 45,
    practiceLessons: 30,
    exerciseLessons: 0,
    description: null,
    isRequired: 0,
    chainURI:
      'https://ipfs.io/ipfs/QmcChbniEZBRVAfVXB7X6Qg2r54ppWX42aSSkcwRdDLVeZ',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 15:00:51',
    prevCourseId: null,
  },
  {
    id: 40,
    knowledgeBlockId: 3,
    courseCode: 'CSC10101',
    name: 'Kỹ năng mềm',
    credits: 3,
    status: 1,
    theoryLessons: 30,
    practiceLessons: 45,
    exerciseLessons: 0,
    description: null,
    isRequired: 0,
    chainURI:
      'https://ipfs.io/ipfs/QmdRU94Li3pFDXqRnqay5uFyFbKF4yiLsQcYNfahN5vozv',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 15:00:54',
    prevCourseId: null,
  },
  {
    id: 41,
    knowledgeBlockId: 3,
    courseCode: 'CSC10102',
    name: 'Kiến tập nghề nghiệp',
    credits: 2,
    status: 1,
    theoryLessons: 15,
    practiceLessons: 30,
    exerciseLessons: 0,
    description: null,
    isRequired: 0,
    chainURI:
      'https://ipfs.io/ipfs/Qmc7zTYZgatkXYGp5Q4i1XR28d8qfr3A9ceoohkqNQwokh',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 15:00:57',
    prevCourseId: null,
  },
  {
    id: 42,
    knowledgeBlockId: 3,
    courseCode: 'CSC10103',
    name: 'Khởi nghiệp',
    credits: 3,
    status: 1,
    theoryLessons: 30,
    practiceLessons: 30,
    exerciseLessons: 0,
    description: null,
    isRequired: 0,
    chainURI:
      'https://ipfs.io/ipfs/QmYDQWkB4T2hgmk2QFC4TjppnESpWRZN4xiJBy8ocYxk5b',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 15:01:00',
    prevCourseId: null,
  },
  {
    id: 43,
    knowledgeBlockId: 3,
    courseCode: 'CSC10104',
    name: 'Quy hoạch tuyến tính',
    credits: 4,
    status: 1,
    theoryLessons: 45,
    practiceLessons: 30,
    exerciseLessons: 0,
    description: null,
    isRequired: 0,
    chainURI:
      'https://ipfs.io/ipfs/QmYok1UM65Tk9f2rSEVAhxjTgXYgrKigmfWsZdMA7DWTfP',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 15:01:04',
    prevCourseId: null,
  },
  {
    id: 44,
    knowledgeBlockId: 3,
    courseCode: 'CSC10105',
    name: 'Nhập môn tư duy thuật toán',
    credits: 4,
    status: 1,
    theoryLessons: 45,
    practiceLessons: 30,
    exerciseLessons: 0,
    description: null,
    isRequired: 0,
    chainURI:
      'https://ipfs.io/ipfs/QmTM8MNZGoaYdujJY5FR1Bd9NrqsrRERq9uMKUX5rBjW39',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 15:01:08',
    prevCourseId: null,
  },
  {
    id: 45,
    knowledgeBlockId: 3,
    courseCode: 'CSC10106',
    name: 'Thuật toán tổ hợp và ứng dụng',
    credits: 4,
    status: 1,
    theoryLessons: 45,
    practiceLessons: 30,
    exerciseLessons: 0,
    description: null,
    isRequired: 0,
    chainURI:
      'https://ipfs.io/ipfs/QmaPnEgwbVj4yQ7hauRPZZazZe8neypTMaLu3Y54JBoVmA',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 15:01:12',
    prevCourseId: null,
  },
  {
    id: 46,
    knowledgeBlockId: 3,
    courseCode: 'CSC10107',
    name: 'Thực tập thực tế',
    credits: 4,
    status: 1,
    theoryLessons: 30,
    practiceLessons: 60,
    exerciseLessons: 0,
    description: null,
    isRequired: 0,
    chainURI:
      'https://ipfs.io/ipfs/QmWsST6GnSuPYzNnHpicUQAXMEo2RSvpsrBHh8yDxRHh7U',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 15:01:15',
    prevCourseId: null,
  },
  {
    id: 47,
    knowledgeBlockId: 3,
    courseCode: 'CSC13001',
    name: 'Lập trình Windows',
    credits: 4,
    status: 1,
    theoryLessons: 45,
    practiceLessons: 30,
    exerciseLessons: 0,
    description: null,
    isRequired: 0,
    chainURI:
      'https://ipfs.io/ipfs/QmeA2JJr5MMBeTJtG6rRJLTWErwsmqk5iCgopxfyfzLVwt',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 15:01:18',
    prevCourseId: null,
  },
  {
    id: 48,
    knowledgeBlockId: 3,
    courseCode: 'CSC13101',
    name: 'Các chủ đề nâng cao trong Công nghệ phần mềm',
    credits: 4,
    status: 1,
    theoryLessons: 45,
    practiceLessons: 30,
    exerciseLessons: 0,
    description: null,
    isRequired: 0,
    chainURI:
      'https://ipfs.io/ipfs/QmX7Hg5NpqwJsGUWw7oDhtZGnnoFzem9RUVwR11LSbqtAD',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 15:01:22',
    prevCourseId: null,
  },
  {
    id: 49,
    knowledgeBlockId: 3,
    courseCode: 'CSC13102',
    name: 'Lập trình ứng dụng Java',
    credits: 4,
    status: 1,
    theoryLessons: 45,
    practiceLessons: 30,
    exerciseLessons: 0,
    description: null,
    isRequired: 0,
    chainURI:
      'https://ipfs.io/ipfs/QmfK2fvvLqBCm8enuYbu2fTDikS8yCvRT3Yf3udW3icUQS',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 15:01:26',
    prevCourseId: null,
  },
  {
    id: 50,
    knowledgeBlockId: 3,
    courseCode: 'CSC13103',
    name: 'Công nghệ Java cho hệ thống phân tán',
    credits: 4,
    status: 1,
    theoryLessons: 45,
    practiceLessons: 30,
    exerciseLessons: 0,
    description: null,
    isRequired: 0,
    chainURI:
      'https://ipfs.io/ipfs/QmefAz98Y9Hx3QNkSuVwdKZ8y9oYPi1NnoNpXpwv9fdg5R',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 15:01:30',
    prevCourseId: null,
  },
  {
    id: 51,
    knowledgeBlockId: 3,
    courseCode: 'CSC13107',
    name: 'Mẫu thiết kế hướng đối tượng và ứng dụng',
    credits: 4,
    status: 1,
    theoryLessons: 45,
    practiceLessons: 30,
    exerciseLessons: 0,
    description: null,
    isRequired: 0,
    chainURI:
      'https://ipfs.io/ipfs/QmefCLcBZgZVHNSas3W13cJccfK1CrK3RFpxN4JWDDCzDL',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 15:01:33',
    prevCourseId: null,
  },
  {
    id: 52,
    knowledgeBlockId: 3,
    courseCode: 'CSC13108',
    name: 'Mô hình hóa phần mềm',
    credits: 4,
    status: 1,
    theoryLessons: 45,
    practiceLessons: 30,
    exerciseLessons: 0,
    description: null,
    isRequired: 0,
    chainURI:
      'https://ipfs.io/ipfs/QmaP6wpBNvvS3RzNeyFhxndM5sJtz9jBf3zAgDGcZYcs6i',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 15:01:37',
    prevCourseId: null,
  },
  {
    id: 53,
    knowledgeBlockId: 3,
    courseCode: 'CSC14005',
    name: 'Nhập môn học máy',
    credits: 4,
    status: 1,
    theoryLessons: 45,
    practiceLessons: 30,
    exerciseLessons: 0,
    description: null,
    isRequired: 0,
    chainURI:
      'https://ipfs.io/ipfs/QmX1Nrf5EMzWbGu3XXYESUyHJsiBEzVvPBwkNJUH4gUgoC',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 15:01:41',
    prevCourseId: null,
  },
  {
    id: 54,
    knowledgeBlockId: 3,
    courseCode: 'CSC16106',
    name: 'Nhập môn lập trình điều khiển thiết bị thông minh',
    credits: 4,
    status: 1,
    theoryLessons: 45,
    practiceLessons: 30,
    exerciseLessons: 0,
    description: null,
    isRequired: 0,
    chainURI:
      'https://ipfs.io/ipfs/QmZc6Eqi1qRwe5b9oCfgKQfFf8AQ4hzK9j4A5j9y58nSgR',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 15:01:44',
    prevCourseId: null,
  },
  {
    id: 55,
    knowledgeBlockId: 4,
    courseCode: 'CSC10251',
    name: 'Khóa luận tốt nghiệp',
    credits: 10,
    status: 1,
    theoryLessons: 0,
    practiceLessons: 300,
    exerciseLessons: 0,
    description: null,
    isRequired: 0,
    chainURI:
      'https://ipfs.io/ipfs/Qme53bpAFKP7YoTdb8GaM9kkuC6hYtUzjHWiAZkFuXfpDN',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 15:01:48',
    prevCourseId: null,
  },
  {
    id: 56,
    knowledgeBlockId: 4,
    courseCode: 'CSC10252',
    name: 'Thực tập tốt nghiệp',
    credits: 10,
    status: 1,
    theoryLessons: 0,
    practiceLessons: 300,
    exerciseLessons: 0,
    description: null,
    isRequired: 0,
    chainURI:
      'https://ipfs.io/ipfs/QmXJ3A96HZvWrBTduxFhQ8HENqSfevS1zLmtrYyXmaFiJ2',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 15:01:51',
    prevCourseId: null,
  },
  {
    id: 57,
    knowledgeBlockId: 4,
    courseCode: 'CSC10204',
    name: 'Thực tập dự án tốt nghiệp',
    credits: 6,
    status: 1,
    theoryLessons: 0,
    practiceLessons: 180,
    exerciseLessons: 0,
    description: null,
    isRequired: 0,
    chainURI:
      'https://ipfs.io/ipfs/QmeBWAxhnvZrbQET5w8K5YiA4xxYrzD8Bffg68KWb9JypR',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 15:01:54',
    prevCourseId: null,
  },
  {
    id: 58,
    knowledgeBlockId: 4,
    courseCode: 'CSC13114',
    name: 'Phát triển ứng dụng web nâng cao',
    credits: 4,
    status: 1,
    theoryLessons: 45,
    practiceLessons: 30,
    exerciseLessons: 0,
    description: null,
    isRequired: 0,
    chainURI:
      'https://ipfs.io/ipfs/QmRM32hVgtwnWD3MufKGbGxXEo9kxd3bqVZRAUjempmLaU',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 15:01:58',
    prevCourseId: null,
  },
  {
    id: 59,
    knowledgeBlockId: 4,
    courseCode: 'CSC13115',
    name: 'Các công nghệ mới trong phát triển phần mềm',
    credits: 4,
    status: 1,
    theoryLessons: 45,
    practiceLessons: 30,
    exerciseLessons: 0,
    description: null,
    isRequired: 0,
    chainURI:
      'https://ipfs.io/ipfs/QmYRf6GMhumCGGRyL2vuB5oadRchXmiUNYFYnkNeypywUA',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 15:02:02',
    prevCourseId: null,
  },
  {
    id: 60,
    knowledgeBlockId: 4,
    courseCode: 'CSC13116',
    name: 'Đồ án Công nghệ phần mềm',
    credits: 4,
    status: 1,
    theoryLessons: 45,
    practiceLessons: 30,
    exerciseLessons: 0,
    description: null,
    isRequired: 0,
    chainURI:
      'https://ipfs.io/ipfs/QmdJqkzPjc4p9o6Bz8uc1TktgkQ6pRrRsZaW4zspS2Ap8P',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 15:02:05',
    prevCourseId: null,
  },
  {
    id: 61,
    knowledgeBlockId: 4,
    courseCode: 'CSC13117',
    name: 'Phát triển game nâng cao',
    credits: 4,
    status: 1,
    theoryLessons: 45,
    practiceLessons: 30,
    exerciseLessons: 0,
    description: null,
    isRequired: 0,
    chainURI:
      'https://ipfs.io/ipfs/QmdMXbTdtVoZ5y9VvYyac9LnXD27pFfxMK6u7nNWoNgHZ9',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 15:02:09',
    prevCourseId: null,
  },
  {
    id: 62,
    knowledgeBlockId: 4,
    courseCode: 'CSC13118',
    name: 'Phát triển ứng dụng cho thiết bị di động nâng cao',
    credits: 4,
    status: 1,
    theoryLessons: 45,
    practiceLessons: 30,
    exerciseLessons: 0,
    description: null,
    isRequired: 0,
    chainURI:
      'https://ipfs.io/ipfs/Qmf81V1qWT9x4iWj8K25a3A43WPo6mmR7Y8MsiD8D35pob',
    createdAt: '2023-05-22 14:47:46',
    updatedAt: '2023-05-22 15:02:12',
    prevCourseId: null,
  },
];

const data1 = data.filter(({ knowledgeBlockId }) => knowledgeBlockId < 3);

const excelData = [
  'BAA00101,Triết học Mác - Lênin,3,45,0,0,BB,1',
  'BAA00102,Kinh tế chính trị Mác - Lênin,2,30,0,0,BB,1',
  'BAA00103,Chủ nghĩa xã hội khoa học,2,30,0,0,BB,1',
  'BAA00104,Lịch sử Đảng Cộng sản Việt Nam,2,30,0,0,BB,1',
  'BAA00003,Tư tưởng Hồ Chí Minh,2,30,0,0,BB,1',
  'BAA00004,Pháp luật đại cương,3,45,0,0,BB,1',
  'BAA00005,Kinh tế đại cương,2,30,0,0,TC,1',
  'BAA00006,Tâm lý đại cương,2,30,0,0,TC,1',
  'BAA00007,Phương pháp luận sáng tạo,2,30,0,0,TC,1',
  'MTH00005,Vi tích phân 1,4,45,30,0,BB,1',
  'MTH00006,Vi tích phân 2,4,45,30,0,BB,1',
  'MTH00007,Xác suất thống kê,4,45,30,0,BB,1',
  'MTH00008,Đại số tuyến tính,4,45,30,0,BB,1',
  'MTH00009,Toán rời rạc,4,45,30,0,BB,1',
  'MTH00050,Toán học tổ hợp,4,45,30,0,BB,1',
  'CSC00004,Nhập môn Công nghệ thông tin,4,45,30,0,BB,1',
  'MTH00051,Toán ứng dụng và thống kê,4,45,30,0,TC,1',
  'MTH00052,Phương pháp tính,4,45,30,0,TC,1',
  'MTH00053,Lý thuyết số,4,45,30,0,TC,1',
  'MTH00054,Phép tính vị từ,4,45,30,0,TC,1',
  'CSC10001,Nhập môn lập trình,4,45,30,0,BB,2',
  'CSC10002,Kỹ thuật lập trình,4,45,30,0,BB,2',
  'CSC10003,Phương pháp lập trình hướng đối tượng,4,45,30,0,BB,2',
  'CSC10004,Cấu trúc dữ liệu và giải thuật,4,45,30,0,BB,2',
  'CSC10006,Cơ sở dữ liệu,4,45,30,0,BB,2',
  'CSC10007,Hệ điều hành,4,45,30,0,BB,2',
  'CSC10008,Mạng máy tính,4,45,30,0,BB,2',
  'CSC10009,Hệ thống máy tính,2,30,0,0,BB,2',
  'CSC13002,Nhập môn công nghệ phần mềm,4,45,30,0,BB,2',
  'CSC14003,Cơ sở trí tuệ nhân tạo,4,45,30,0,BB,2',
  'CSC13003,Kiểm thử phần mềm,4,45,30,0,TC,3',
  'CSC13005,Phân tích và quản lý yêu cầu phần mềm,4,45,30,0,TC,3',
  'CSC13006,Quản lý dự án phần mềm,4,45,30,0,TC,3',
  'CSC13007,Phát triển game,4,45,30,0,TC,3',
  'CSC13008,Phát triển ứng dụng web,4,45,30,0,TC,3',
  'CSC13009,Phát triển phần mềm cho thiết bị di động,4,45,30,0,TC,3',
  'CSC13010,Thiết kế phần mềm,4,45,30,0,TC,3',
  'CSC13106,Kiến trúc phần mềm,4,45,30,0,TC,3',
  'CSC13112,Thiết kế giao diện,4,45,30,0,TC,3',
  'CSC10101,Kỹ năng mềm,3,30,45,0,TC,3',
  'CSC10102,Kiến tập nghề nghiệp,2,15,30,0,TC,3',
  'CSC10103,Khởi nghiệp,3,30,30,0,TC,3',
  'CSC10104,Quy hoạch tuyến tính,4,45,30,0,TC,3',
  'CSC10105,Nhập môn tư duy thuật toán,4,45,30,0,TC,3',
  'CSC10106,Thuật toán tổ hợp và ứng dụng,4,45,30,0,TC,3',
  'CSC10107,Thực tập thực tế,4,30,60,0,TC,3',
  'CSC13001,Lập trình Windows,4,45,30,0,TC,3',
  'CSC13101,Các chủ đề nâng cao trong Công nghệ phần mềm,4,45,30,0,TC,3',
  'CSC13102,Lập trình ứng dụng Java,4,45,30,0,TC,3',
  'CSC13103,Công nghệ Java cho hệ thống phân tán,4,45,30,0,TC,3',
  'CSC13107,Mẫu thiết kế hướng đối tượng và ứng dụng,4,45,30,0,TC,3',
  'CSC13108,Mô hình hóa phần mềm,4,45,30,0,TC,3',
  'CSC14005,Nhập môn học máy,4,45,30,0,TC,3',
  'CSC16106,Nhập môn lập trình điều khiển thiết bị thông minh,4,45,30,0,TC,3',
  'CSC10251,Khóa luận tốt nghiệp,10,0,300,0,TC,4',
  'CSC10252,Thực tập tốt nghiệp,10,0,300,0,TC,4',
  'CSC10204,Thực tập dự án tốt nghiệp,6,0,180,0,TC,4',
  'CSC13114,Phát triển ứng dụng web nâng cao,4,45,30,0,TC,4',
  'CSC13115,Các công nghệ mới trong phát triển phần mềm,4,45,30,0,TC,4',
  'CSC13116,Đồ án Công nghệ phần mềm,4,45,30,0,TC,4',
  'CSC13117,Phát triển game nâng cao,4,45,30,0,TC,4',
  'CSC13118,Phát triển ứng dụng cho thiết bị di động nâng cao,4,45,30,0,TC,4',
].map((item, index) => {
  const [
    courseCode,
    name,
    credits,
    theoryLessons,
    practiceLessons,
    exerciseLessons,
    courseRequired,
    knowledgeBlockId,
  ] = item.split(',');

  return {
    id: index + 1,
    courseCode,
    name,
    credits,
    isRequired: courseRequired === 'BB',
    knowledgeBlockId,
    theoryLessons,
    practiceLessons,
    exerciseLessons,
  };
});

/*
const splitter2 = (raw) => raw.map((item) => item.split("").reverse().join("").split(" ", 6).map((i) => i.split("").reverse().join(""))).map((item, idx) => { const lastItem=item.at(-1); const lastItemIdx = raw[idx].search(lastItem) + lastItem.length; item[5] = raw[idx].substring(0, lastItemIdx); return item.reverse(); }).map((i) => i.join(','))
 */
