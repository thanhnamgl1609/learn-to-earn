const assert = require('power-assert');
const ethers = require('ethers');
const NftSchool = artifacts.require('NftSchool');
const NftIdentities = artifacts.require('NftIdentities');
const { getUnixTime, dateAdd } = require('./utils');

const { KNOWLEDGE_BLOCKS, SCORE_TYPES } = require('./testdata/constants');
const { courseInfoURIs, classInfos } = require('./testdata/2_nft_school');
const { initTeacher } = require('./utils/init');

const testFuncs = [].join(', ');

contract(`NftSchool ${testFuncs}`, (accounts) => {
  let _nftSchoolContract;
  let _nftIdentitiesContract;
  const courseInfo = [
    {
      prevCourseId: 0,
      knowledgeBlockId: KNOWLEDGE_BLOCKS.GENERAL.id,
      credits: 4,
      uri: courseInfoURIs[0],
    },
    {
      prevCourseId: 1,
      knowledgeBlockId: KNOWLEDGE_BLOCKS.GENERAL.id,
      credits: 4,
      uri: courseInfoURIs[0],
    },
  ];

  const registeredTime = {
    start: dateAdd(new Date(), 1, 'month'),
    end: dateAdd(dateAdd(new Date(), 1, 'month'), 10, 'd'),
  };
  const registeredTimeUnix = {
    start: getUnixTime(registeredTime.start),
    end: getUnixTime(registeredTime.end),
  };

  const classInfo = [
    {
      courseId: 1,
      completeAt: getUnixTime(
        dateAdd(dateAdd(registeredTime.end, 10, 'd'), 2, 'm')
      ),
      requiredScores: [
        SCORE_TYPES.Midterm.id,
        SCORE_TYPES.Practice.id,
        SCORE_TYPES.Final.id,
      ],
      maxSize: 40,
      teacherTokenId: 65537,
      uri: classInfos[0],
    },
  ];

  before(async () => {
    _nftSchoolContract = await NftSchool.deployed();
    _nftIdentitiesContract = await NftIdentities.deployed();
    await initTeacher(_nftIdentitiesContract, accounts);
  });

  describe('test NftSchool.createCourse', () => {
    describe('cannot create course if not owner', () => {
      let err;
      before(async () => {
        try {
          await _nftSchoolContract.createCourse(
            courseInfo[0].prevCourseId,
            courseInfo[0].knowledgeBlockId,
            courseInfo[0].credits,
            courseInfo[0].uri,
            {
              from: accounts[1],
            }
          );
        } catch (e) {
          err = e;
        }
      });

      it('should get error', () => {
        assert(!!err);
      });
    });

    describe('cannot create course if set invalid previous course id', () => {
      let err;
      before(async () => {
        try {
          await _nftSchoolContract.createCourse(
            2,
            courseInfo[0].knowledgeBlockId,
            courseInfo[0].credits,
            courseInfo[0].uri
          );
        } catch (e) {
          err = e;
        }
      });

      it('should get error', () => {
        assert(!!err);
      });
    });

    describe('should create course successfully', () => {
      let err = null;
      before(async () => {
        try {
          await _nftSchoolContract.createCourse(
            courseInfo[0].prevCourseId,
            courseInfo[0].knowledgeBlockId,
            courseInfo[0].credits,
            courseInfo[0].uri
          );
        } catch (e) {
          err = e;
        }
      });

      it('should not get error', () => {
        assert(!err);
      });
    });

    describe('should create course with previous course id successfully', () => {
      let err = null;
      before(async () => {
        try {
          await _nftSchoolContract.createCourse(
            courseInfo[1].prevCourseId,
            courseInfo[1].knowledgeBlockId,
            courseInfo[1].credits,
            courseInfo[1].uri
          );
        } catch (e) {
          err = e;
        }
      });

      it('should not get error', () => {
        assert(!err);
      });
    });
  });

  describe('test NftSchool.getCourses', () => {
    let result = [];

    before(async () => {
      result = await _nftSchoolContract.getAllCourses();
    });

    it('should get 2 courses', () => {
      assert(result.length === 2);
    });
  });

  describe('test NftSchool.updateRegisteredTime', () => {
    describe('cannot update register time if not owner', () => {
      let err;

      before(async () => {
        try {
          await _nftSchoolContract.updateRegisteredTime(
            registeredTimeUnix.start,
            registeredTimeUnix.end,
            {
              from: accounts[1],
            }
          );
        } catch (e) {
          err = e;
        }
      });

      it('should throw error', () => {
        assert(!!err);
      });
    });

    describe('cannot update register time if registerEndAt < registerStartAt', () => {
      let err;

      before(async () => {
        try {
          await _nftSchoolContract.updateRegisteredTime(
            registeredTimeUnix.end,
            registeredTimeUnix.start
          );
        } catch (e) {
          err = e;
        }
      });

      it('should throw error', () => {
        assert(!!err);
      });
    });

    describe('cannot register class if not update register time before', () => {
      let err;

      before(async () => {
        try {
          await _nftSchoolContract.createClass(
            classInfo[0].courseId,
            classInfo[0].completeAt,
            classInfo[0].requiredScores,
            classInfo[0].maxSize,
            classInfo[0].teacherTokenId,
            classInfo[0].uri
          );
        } catch (e) {
          err = e;
        }
      });

      it('should throw error', () => {
        assert(!!err);
      });
    });

    describe('should update register time successfully', () => {
      let err;
      let result;

      before(async () => {
        try {
          await _nftSchoolContract.updateRegisteredTime(
            registeredTimeUnix.start,
            registeredTimeUnix.end
          );
        } catch (e) {
          err = e;
        }

        result = await _nftSchoolContract.getRegisterTime();
      });

      it('should update successfully', () => {
        assert(!err);
      });

      it('should update correctly register start time', () => {
        const actual = {
          start: result[0].toNumber(),
          end: result[1].toNumber(),
        };
        assert.deepEqual(actual, registeredTimeUnix);
      });
    });
  });

  describe('test NftSchool.createClass', () => {
    describe('cannot create class if not owner', () => {
      let err;
      before(async () => {
        try {
          await _nftSchoolContract.createClass(
            classInfo[0].courseId,
            classInfo[0].completeAt,
            classInfo[0].requiredScores,
            classInfo[0].maxSize,
            classInfo[0].teacherTokenId,
            classInfo[0].uri,
            {
              from: accounts[1],
            }
          );
        } catch (e) {
          err = e;
        }
      });

      it('should throw error', () => {
        assert(!!err);
      });
    });

    describe('cannot create class if relating to invalid course', () => {
      let err;
      before(async () => {
        try {
          await _nftSchoolContract.createClass(
            1000,
            classInfo[0].completeAt,
            classInfo[0].requiredScores,
            classInfo[0].maxSize,
            classInfo[0].teacherTokenId,
            classInfo[0].uri
          );
        } catch (e) {
          err = e;
        }
      });

      it('should throw error', () => {
        assert(!!err);
      });
    });

    describe('cannot create class if invalid complete time', () => {
      let err;
      before(async () => {
        try {
          await _nftSchoolContract.createClass(
            classInfo[0].courseId,
            getUnixTime(new Date()),
            classInfo[0].requiredScores,
            classInfo[0].maxSize,
            classInfo[0].teacherTokenId,
            classInfo[0].uri
          );
        } catch (e) {
          err = e;
        }
      });

      it('should throw error', () => {
        assert(!!err);
      });
    });

    describe('cannot create class if invalid required score', () => {
      let err;
      before(async () => {
        try {
          await _nftSchoolContract.createClass(
            classInfo[0].courseId,
            classInfo[0].completeAt,
            [1000],
            classInfo[0].maxSize,
            1000,
            classInfo[0].uri
          );
        } catch (e) {
          err = e;
        }
      });

      it('should throw error', () => {
        assert(!!err);
      });
    });

    describe('cannot create class if assign to invalid teacher', () => {
      let err;
      before(async () => {
        try {
          await _nftSchoolContract.createClass(
            classInfo[0].courseId,
            classInfo[0].completeAt,
            classInfo[0].requiredScores,
            classInfo[0].maxSize,
            1000,
            classInfo[0].uri
          );
        } catch (e) {
          err = e;
        }
      });

      it('should throw error', () => {
        assert(!!err);
      });
    });

    describe('create class successfully', () => {
      let err;
      let result;
      before(async () => {
        try {
          await _nftSchoolContract.createClass(
            classInfo[0].courseId,
            classInfo[0].completeAt,
            classInfo[0].requiredScores,
            classInfo[0].maxSize,
            classInfo[0].teacherTokenId,
            classInfo[0].uri
          );
        } catch (e) {
          err = e;
        }

        result = await _nftSchoolContract.getCurrentRegisteredClasses();
      });

      it('should create successfully', () => {
        assert(!err);
      });

      it('should create correctly class', () => {
        const actualClass = result[0];
        const actual = {
          courseId: parseInt(actualClass.courseId),
          completeAt: parseInt(actualClass.completeAt),
          requiredScores: actualClass.requiredScore.map((scoreType) =>
            parseInt(scoreType)
          ),
          maxSize: parseInt(actualClass.maxSize),
          teacherTokenId: parseInt(actualClass.teacherTokenId),
          uri: actualClass.uri,
        };
        assert.deepEqual(actual, classInfo[0]);
      });
    });
  });
});
