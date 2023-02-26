const School = artifacts.require('School');
const NftCourse = artifacts.require('NftCourse');
const NftGraduation = artifacts.require('NftGraduation');

contract('NftCourse', (accounts) => {
  const smartContractOwner = accounts[0];
  const teacherAddresses = [accounts[1], accounts[2]];
  const courseGroupIds = [1, 2];
  const courseGroupCreditRequirements = [5, 8];
  const courses = [
    {
      id: 1,
      teacherAddress: teacherAddresses[0],
      credits: 2,
      nftCounts: 1, // -> To check max number of nfts?
      courseGroupId: 1,
      metadata: 'http://test-data/course/1', // { name: "OOP Programming" }
    },
    {
      id: 2,
      teacherAddress: teacherAddresses[0],
      credits: 4,
      nftCounts: 4,
      courseGroupId: 1,
      metadata: 'http://test-data/course/2', // { name: "Programming Technique" } -> Check duplicate
    },
    {
      id: 3,
      teacherAddress: teacherAddresses[1],
      credits: 4,
      nftCounts: 4,
      courseGroupId: 1,
      metadata: 'http://test-data/course/3', // { name: "Programming Technique" }
    },
    {
      id: 4,
      teacherAddress: teacherAddresses[0],
      credits: 4,
      nftCounts: 3,
      courseGroupId: 1,
      metadata: 'http://test-data/course/2', // { name: "Programming Technique" }
    },
    {
      id: 5,
      teacherAddress: teacherAddresses[1],
      credits: 4,
      nftCounts: 3,
      courseGroupId: 2,
      metadata: 'http://test-data/course/4', // { name: "Programming Technique" }
    },
    {
      id: 6,
      teacherAddress: teacherAddresses[0],
      credits: 4,
      nftCounts: 3,
      courseGroupId: 2,
      metadata: 'http://test-data/course/5', // { name: "Programming Technique" }
    },
  ];
  const teacherOfCourse = courses.reduce(
    (prev, course) => ({
      ...prev,
      [course.id]: course.teacherAddress,
    }),
    {}
  );
  const nftMetadata = Array(10)
    .fill(' ')
    .map((_, index) => 'http://test-data/nft/' + index);
  const studentIds = ['1001', '1002', '1003'];
  let _schoolContract = null;
  let _contract = null;
  let _nftGraduation = null;

  before(async () => {
    _schoolContract = await School.deployed();
    _contract = await NftCourse.deployed();
    _nftGraduation = await NftGraduation.deployed();
    await _schoolContract.initialize(
      courseGroupIds,
      courseGroupCreditRequirements
    );
    // Teacher registration
    await Promise.all(
      teacherAddresses.map((from, index) =>
        _schoolContract.registerTeacher(
          `http://test-data/teacher/${index + 1}`,
          { from }
        )
      )
    );
    await Promise.all(
      teacherAddresses.map((approved) =>
        _schoolContract.approveTeacher(approved, { from: smartContractOwner })
      )
    );

    // Course creation
    const coursePromises = courses.map(
      ({ teacherAddress, credits, nftCounts, courseGroupId, metadata }) =>
        _schoolContract.createCourse(
          teacherAddress,
          credits,
          nftCounts,
          courseGroupId,
          metadata
        )
    );

    for (const coursePromise of coursePromises) {
      await coursePromise;
    }
  });

  it('only teacher of course can grant nft', async () => {
    let err;
    try {
      await _contract.mintToken(nftMetadata[0], studentIds[0], 1, {
        from: teacherAddresses[1],
      });
    } catch (e) {
      err = e;
    }
    assert(!!err);
  });

  it('cannot grant more than maximum', async () => {
    let error;
    try {
      await _contract.mintToken(nftMetadata[1], studentIds[0], courses[0].id, {
        from: teacherOfCourse[courses[0].id],
      });
      await _contract.mintToken(nftMetadata[2], studentIds[1], courses[0].id, {
        from: teacherOfCourse[courses[0].id],
      });
    } catch (e) {
      error = e;
    }
    assert(!!error);
  });

  it('get all nfts of a student', async () => {
    await _contract.mintToken(nftMetadata[3], studentIds[0], courses[1].id, {
      from: teacherOfCourse[courses[1].id],
    });
    const nftCourses = await _contract.getNftCourses(studentIds[0]);

    assert.equal(nftCourses.length, 2);
  });

  it('cannot get nft graduation if not enough credits', async () => {
    let err;
    try {
      await _nftGraduation.exchangeNftGraduation(studentIds[0], [1, 2]);
    } catch (e) {
      err = e;
    }
    assert(!!err);
  });

  it('cannot use 2 identical courses to get nft graduation', async () => {
    await _contract.mintToken(nftMetadata[4], studentIds[0], courses[3].id, {
      from: teacherOfCourse[courses[3].id],
    });
    await _contract.mintToken(nftMetadata[5], studentIds[0], courses[4].id, {
      from: teacherOfCourse[courses[4].id],
    });
    await _contract.mintToken(nftMetadata[6], studentIds[0], courses[5].id, {
      from: teacherOfCourse[courses[5].id],
    });
    let error;
    try {
      await _nftGraduation.exchangeNftGraduation(studentIds[0], [2, 3, 4, 5]);
    } catch (e) {
      error = e;
    }

    assert(!!error);
  });

  it('get graduation successful', async () => {
    await _nftGraduation.exchangeNftGraduation(studentIds[0], [1, 3, 4, 5]);
    const nftGraduation = await _nftGraduation.getNftGraduation(studentIds[0]);

    assert(!!nftGraduation);
  });

  it('cannot get nft item again', async () => {
    let err;
    try {
      await _nftGraduation.exchangeNftGraduation(studentIds[0], [1, 3, 4, 5]);
    } catch (e) {
      err = e; 
    }

    assert(!!err);
  });

  it('grant at most 1 nft for 1 student in 1 course', async () => {
    let error;
    await _contract.mintToken(nftMetadata[7], studentIds[1], courses[1].id, {
      from: teacherOfCourse[courses[1].id],
    });
    try {
      await _contract.mintToken(nftMetadata[8], studentIds[1], courses[1].id, {
        from: teacherOfCourse[courses[1].id],
      });
    } catch (e) {
      error = e;
    }

    assert(!!error);
  });

  it('1 metadata cannot be granted for many nfts', async () => {
    try {
      await _contract.mintToken(nftMetadata[7], studentIds[2], courses[1].id, {
        from: teacherOfCourse[courses[1].id],
      });
    } catch (e) {
      error = e;
    }

    assert(!!error);
  });

});
