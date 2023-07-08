// const assert = require('power-assert');
// const School = artifacts.require('School');
// const NftIdentities = artifacts.require('NftIdentities');
// const { getUnixTime, dateAdd, sleep } = require('./utils');

// const { registerClassFee, classRegistrationInfoURLs } = require('./testdata/common');
// const { KNOWLEDGE_BLOCKS } = require('./testdata/constants');
// const { courseInfoURIs, classInfos } = require('./testdata/2_nft_school');
// const { initTeacher, initStudent } = require('./utils/init');

// const testFuncs = [
//   'createCourse',
//   'getAllCourses',
//   'updateRegisteredTime',
//   'createClass',
//   'getRegisterTime',
//   'getCurrentRegisteredClasses',
// ].join(', ');

// contract(`School ${testFuncs}`, (accounts) => {
//   let _schoolContract;
//   let _nftIdentitiesContract;
//   const courseInfo = [
//     {
//       prevCourseId: 0,
//       knowledgeBlockId: KNOWLEDGE_BLOCKS.GENERAL.id,
//       credits: 4,
//       uri: courseInfoURIs[0],
//     },
//     {
//       prevCourseId: 1,
//       knowledgeBlockId: KNOWLEDGE_BLOCKS.GENERAL.id,
//       credits: 4,
//       uri: courseInfoURIs[0],
//     },
//   ];

//   const registeredTime = {
//     start: dateAdd(new Date(), 1, 's'),
//     end: dateAdd(dateAdd(new Date(), 5, 's'), 10, 'd'),
//   };
//   const registeredTimeUnix = {
//     start: getUnixTime(registeredTime.start),
//     end: getUnixTime(registeredTime.end),
//   };

//   const classInfo = [
//     {
//       courseId: 1,
//       completeAt: getUnixTime(
//         dateAdd(dateAdd(registeredTime.end, 10, 'd'), 2, 'm')
//       ),
//       maxSize: 40,
//       teacherTokenId: 65537,
//       uri: classInfos[0],
//       registeredStartAt: registeredTimeUnix.start,
//       registeredEndAt: registeredTimeUnix.end,
//     },
//   ];

//   before(async () => {
//     _schoolContract = await School.deployed();
//     _nftIdentitiesContract = await NftIdentities.deployed();
//     await initTeacher(_nftIdentitiesContract, [accounts[1], accounts[2]]);
//     await initStudent(_nftIdentitiesContract, [accounts[3], accounts[4]]);
//   });

//   describe('test School.createCourse', () => {
//     describe('cannot create course if not owner', () => {
//       let err;
//       before(async () => {
//         try {
//           await _schoolContract.createCourse(
//             courseInfo[0].prevCourseId,
//             courseInfo[0].knowledgeBlockId,
//             courseInfo[0].credits,
//             courseInfo[0].uri,
//             {
//               from: accounts[1],
//             }
//           );
//         } catch (e) {
//           err = e;
//         }
//       });

//       it('should get error', () => {
//         assert(!!err);
//       });
//     });

//     describe('cannot create course if set invalid previous course id', () => {
//       let err;
//       before(async () => {
//         try {
//           await _schoolContract.createCourse(
//             2,
//             courseInfo[0].knowledgeBlockId,
//             courseInfo[0].credits,
//             courseInfo[0].uri
//           );
//         } catch (e) {
//           err = e;
//         }
//       });

//       it('should get error', () => {
//         assert(!!err);
//       });
//     });

//     describe('should create course successfully', () => {
//       let err = null;
//       before(async () => {
//         try {
//           await _schoolContract.createCourse(
//             courseInfo[0].prevCourseId,
//             courseInfo[0].knowledgeBlockId,
//             courseInfo[0].credits,
//             courseInfo[0].uri
//           );
//         } catch (e) {
//           err = e;
//         }
//       });

//       it('should not get error', () => {
//         assert(!err);
//       });
//     });

//     describe('should create course with previous course id successfully', () => {
//       let err = null;
//       before(async () => {
//         try {
//           await _schoolContract.createCourse(
//             courseInfo[1].prevCourseId,
//             courseInfo[1].knowledgeBlockId,
//             courseInfo[1].credits,
//             courseInfo[1].uri
//           );
//         } catch (e) {
//           err = e;
//         }
//       });

//       it('should not get error', () => {
//         assert(!err);
//       });
//     });
//   });

//   describe('test School.getCourses', () => {
//     let result = [];

//     before(async () => {
//       result = await _schoolContract.getAllCourses();
//     });

//     it('should get 2 courses', () => {
//       assert(result.length === 2);
//     });
//   });

//   describe('test School.updateRegisteredTime', () => {
//     describe('cannot update register time if not owner', () => {
//       let err;

//       before(async () => {
//         try {
//           await _schoolContract.updateRegisteredTime(
//             registeredTimeUnix.start,
//             registeredTimeUnix.end,
//             {
//               from: accounts[1],
//             }
//           );
//         } catch (e) {
//           err = e;
//         }
//       });

//       it('should throw error', () => {
//         assert(!!err);
//       });
//     });

//     describe('cannot update register time if registerEndAt < registerStartAt', () => {
//       let err;

//       before(async () => {
//         try {
//           await _schoolContract.updateRegisteredTime(
//             registeredTimeUnix.end,
//             registeredTimeUnix.start
//           );
//         } catch (e) {
//           err = e;
//         }
//       });

//       it('should throw error', () => {
//         assert(!!err);
//       });
//     });

//     describe('cannot register class if not update register time before', () => {
//       let err;

//       before(async () => {
//         try {
//           await _schoolContract.createClass(
//             classInfo[0].courseId,
//             classInfo[0].completeAt,
//             classInfo[0].maxSize,
//             classInfo[0].teacherTokenId,
//             classInfo[0].uri
//           );
//         } catch (e) {
//           err = e;
//         }
//       });

//       it('should throw error', () => {
//         assert(!!err);
//       });
//     });

//     describe('should update register time successfully', () => {
//       let err;
//       let result;

//       before(async () => {
//         try {
//           await _schoolContract.updateRegisteredTime(
//             registeredTimeUnix.start,
//             registeredTimeUnix.end
//           );
//         } catch (e) {
//           err = e;
//         }

//         result = await _schoolContract.getRegisterTime();
//       });

//       it('should update successfully', () => {
//         assert(!err);
//       });

//       it('should update correctly register start time', () => {
//         const actual = {
//           start: result[0].toNumber(),
//           end: result[1].toNumber(),
//         };
//         assert.deepEqual(actual, registeredTimeUnix);
//       });
//     });
//   });

//   describe('test School.createClass', () => {
//     describe('cannot create class if not owner', () => {
//       let err;
//       before(async () => {
//         try {
//           await _schoolContract.createClass(
//             classInfo[0].courseId,
//             classInfo[0].completeAt,
//             classInfo[0].maxSize,
//             classInfo[0].teacherTokenId,
//             classInfo[0].uri,
//             {
//               from: accounts[1],
//             }
//           );
//         } catch (e) {
//           err = e;
//         }
//       });

//       it('should throw error', () => {
//         assert(!!err);
//       });
//     });

//     describe('cannot create class if relating to invalid course', () => {
//       let err;
//       before(async () => {
//         try {
//           await _schoolContract.createClass(
//             1000,
//             classInfo[0].completeAt,
//             classInfo[0].maxSize,
//             classInfo[0].teacherTokenId,
//             classInfo[0].uri
//           );
//         } catch (e) {
//           err = e;
//         }
//       });

//       it('should throw error', () => {
//         assert(!!err);
//       });
//     });

//     describe('cannot create class if invalid complete time', () => {
//       let err;
//       before(async () => {
//         try {
//           await _schoolContract.createClass(
//             classInfo[0].courseId,
//             getUnixTime(new Date()),
//             classInfo[0].maxSize,
//             classInfo[0].teacherTokenId,
//             classInfo[0].uri
//           );
//         } catch (e) {
//           err = e;
//         }
//       });

//       it('should throw error', () => {
//         assert(!!err);
//       });
//     });

//     describe('cannot create class if assign to invalid teacher', () => {
//       let err;
//       before(async () => {
//         try {
//           await _schoolContract.createClass(
//             classInfo[0].courseId,
//             classInfo[0].completeAt,
//             classInfo[0].maxSize,
//             1000,
//             classInfo[0].uri
//           );
//         } catch (e) {
//           err = e;
//         }
//       });

//       it('should throw error', () => {
//         assert(!!err);
//       });
//     });

//     describe('create class successfully', () => {
//       let err;
//       let result;
//       before(async () => {
//         try {
//           await _schoolContract.createClass(
//             classInfo[0].courseId,
//             classInfo[0].completeAt,
//             classInfo[0].maxSize,
//             classInfo[0].teacherTokenId,
//             classInfo[0].uri
//           );
//         } catch (e) {
//           err = e;
//         }

//         result = await _schoolContract.getCurrentRegisteredClasses();
//       });

//       it('should create successfully', () => {
//         assert(!err);
//       });

//       it('should create correctly class', () => {
//         const actualClass = result[0];
//         const actual = {
//           courseId: parseInt(actualClass.courseId),
//           completeAt: parseInt(actualClass.completeAt),
//           maxSize: parseInt(actualClass.maxSize),
//           teacherTokenId: parseInt(actualClass.teacherTokenId),
//           uri: actualClass.uri,
//           registeredStartAt: parseInt(actualClass.registeredStartAt),
//           registeredEndAt: parseInt(actualClass.registeredEndAt),
//         };
//         assert.deepEqual(actual, classInfo[0]);
//         classInfo[0].id = actualClass.id;
//       });
//     });
//   });

//   describe('test School.registerClass', () => {
//     describe('can register class', () => {
//       let error;

//       before(async () => {
//         try {
//           await sleep(async () => {
//             await _schoolContract.registerClass(
//               classInfo[0].id,
//               classRegistrationInfoURLs[0],
//               {
//                 from: accounts[3],
//                 value: registerClassFee,
//               }
//             );
//           }, 5000);
//         } catch (e) {
//           error = e;
//         }
//       });

//       it('should not throw error', () => {
//         assert(!error);
//       });
//     });

//     describe('cannot register invalid class', () => {
//       let error;

//       before(async () => {
//         try {
//           await _schoolContract.registerClass(1000, classRegistrationInfoURLs[0], {
//             from: accounts[3],
//             value: registerClassFee,
//           });
//         } catch (e) {
//           error = e;
//         }
//       });

//       it('should throw error', () => {
//         assert(!!error);
//       });
//     });

//     describe('cannot register the same course again', () => {
//       let error;

//       before(async () => {
//         try {
//           await _schoolContract.registerClass(
//             classInfo[0].id,
//             classRegistrationInfoURLs[0],
//             {
//               from: accounts[3],
//               value: registerClassFee,
//             }
//           );
//         } catch (e) {
//           error = e;
//         }
//       });

//       it('should throw error', () => {
//         assert(!!error);
//       });
//     });
//   });

//   describe('test School.getRegisteredClasses', () => {
//     let result;

//     before(async () => {
//       result = await _schoolContract.getRegisteredClasses({
//         from: accounts[3],
//       });
//     });

//     it('should returns 1 class', () => {
//       assert(result.length === 1);
//     });
//   });
// });
