// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;

import "./ERC1155BaseContract.sol";
import "./utils/IdentityGenerator.sol";
import "./interfaces/INftSchool.sol";
import "./interfaces/INftIdentities.sol";
import "./interfaces/INftCertificates.sol";

contract NftSchool is INftSchool, IdentityGenerator {
    using Counters for Counters.Counter;

    uint256 constant COURSE_ID = 1;
    uint256 constant CLASS_ID = 2;
    uint256 constant REGISTERED_TIME_ID = 3;

    uint256 constant NFT_COURSE_REGISTRATION_ID = 0;

    uint256 public minimumGraduationScore = 500;

    string[] private courseURIs;

    address private _owner;
    
    INftIdentities private _nftIdentities;
    INftCertificates private _nftCertificates;

    bool public _isInitialize;

    event NewClassCreated(uint256 id);

    mapping(uint256 => uint256) private _registeredStartAt;
    mapping(uint256 => uint256) private _registeredEndAt;

    mapping(uint256 => uint256[]) private _classIdsOfSemeter;
    mapping(uint256 => mapping(string => uint256)) private _idOfURIOfType;

    Course[] private _allCourses;
    mapping(uint256 => uint256) _posOfCourses;

    KnowledgeBlock[] private _knowledgeBlocks;

    Class[] private _allClasses;
    mapping(uint256 => uint256) private _posOfClasses;
    mapping(uint256 => uint256[]) private _assignedClassesOfTeacher;

    modifier onlyOwner() {
        require(_owner == msg.sender);
        _;
    }

    constructor(
        address nftIdentities,
        string[] memory knowledgeBlockNames,
        uint256[] memory knowledgeBlockCredits
    ) {
        _owner = msg.sender;
        _nftIdentities = INftIdentities(nftIdentities);

        uint256 knowledgeBlockCount = knowledgeBlockNames.length;
        for (uint256 idx = 0; idx < knowledgeBlockCount; ++idx) {
            _knowledgeBlocks.push(
                KnowledgeBlock(
                    idx + 1,
                    knowledgeBlockNames[idx],
                    knowledgeBlockCredits[idx]
                )
            );
        }
    }

    function initialize(address nftCertificates) public onlyOwner {
        require(!_isInitialize);
        _isInitialize = true;
        _nftCertificates = INftCertificates(nftCertificates);
    }

    // Knowledge Block: Start
    function getAllKnowledgeBlocks()
        external
        view
        returns (KnowledgeBlock[] memory)
    {
        return _knowledgeBlocks;
    }

    // Knowledge Block: End

    // Register time Section: Start
    function updateRegisteredTime(
        uint256 semesterId,
        uint256 registeredStartAt,
        uint256 registeredEndAt
    ) external onlyOwner {
        require(registeredEndAt > registeredStartAt);
        _registeredStartAt[semesterId] = registeredStartAt;
        _registeredEndAt[semesterId] = registeredEndAt;
    }

    function getRegisterTime(
        uint256 semesterId
    ) external view returns (uint256, uint256) {
        return (_registeredStartAt[semesterId], _registeredEndAt[semesterId]);
    }

    // Register time Section: End

    // Course Block: Start
    function getAllCourses() external view onlyOwner returns (Course[] memory) {
        return _allCourses;
    }

    function getCourseById(uint256 id) public view returns (Course memory) {
        uint256 pos = _posOfCourses[id];
        require(pos > 0);

        return _allCourses[pos - 1];
    }

    function getCourseIdByURI(
        string memory tokenURI
    ) public view returns (uint256) {
        return _idOfURIOfType[COURSE_ID][tokenURI];
    }

    function createCourse(
        uint256 prevCourseId,
        uint256 knowledgeBlockId,
        uint256 credits,
        string memory uri
    ) public onlyOwner returns (uint256) {
        require(knowledgeBlockId <= _knowledgeBlocks.length);
        require(credits > 0);
        require(prevCourseId == 0 || _posOfCourses[prevCourseId] > 0);
        require(_idOfURIOfType[COURSE_ID][uri] == 0);
        uint256 id = generateNewId(COURSE_ID);
        _allCourses.push(
            Course(id, knowledgeBlockId, prevCourseId, credits, 1, uri)
        );
        _idOfURIOfType[COURSE_ID][uri] = id;
        _posOfCourses[id] = _allCourses.length;

        return id;
    }

    // Course Block: End

    // Class Block: Start
    function getClassById(
        uint256 id
    ) public view returns (Class memory) {
        uint256 pos = _posOfClasses[id];
        require(pos > 0);

        return _allClasses[pos - 1];
    }

    function getAllClasses()
        external
        view
        onlyOwner
        returns (Class[] memory)
    {
        uint256 length = _allClasses.length;
        Class[] memory classes = new Class[](length);

        for (uint256 idx; idx < length; ++idx) {
            classes[idx] = _allClasses[idx];
        }

        return classes;
    }

    function getClassBySemester(
        uint256 semester
    ) external view returns (Class[] memory) {
        uint256[] memory ids = _classIdsOfSemeter[semester];
        uint256 count = ids.length;
        Class[] memory classes = new Class[](count);

        for (uint256 idx; idx < count; ++idx) {
            classes[idx] = _allClasses[_posOfClasses[ids[idx]] - 1];
        }

        return classes;
    }

    function getAssignedClasses(
        uint256 teacherTokenId
    ) external view returns (Class[] memory) {
        uint256 count = _assignedClassesOfTeacher[teacherTokenId].length;
        Class[] memory result = new Class[](count);

        for (uint256 idx; idx < count; ++idx) {
            result[idx] = getClassById(_assignedClassesOfTeacher[teacherTokenId][idx]);
        }

        return result;
    }

    function createClass(
        uint256 courseId,
        uint256 completeAt,
        uint256 maxSize,
        uint256 teacherTokenId,
        uint256 semester,
        uint256 registerClassFee,
        string memory uri
    ) public onlyOwner returns (uint256) {
        Course memory course = getCourseById(courseId);
        // get nft => check expired date > completeAt
        NftIdentityResponse memory nftTeacher = _nftIdentities.getNftOfTokenId(
            teacherTokenId
        );
        uint256 nftTeacherRole = _nftIdentities.getTokenType(teacherTokenId);

        require(nftTeacherRole == uint256(ROLE.TEACHER));
        require(nftTeacher.nftIdentity.expiredAt > completeAt);
        uint256 id = generateNewId(CLASS_ID);
        _allClasses.push(
            Class(
                id,
                courseId,
                course.knowledgeBlockId,
                course.prevCourseId,
                course.credits,
                completeAt,
                maxSize,
                teacherTokenId,
                semester,
                registerClassFee,
                uri
            )
        );
        _posOfClasses[id] = _allClasses.length;
        _classIdsOfSemeter[semester].push(id);
        _assignedClassesOfTeacher[teacherTokenId].push(id);
        emit NewClassCreated(id);

        return id;
    }

    function getRegisterFeeClassById(
        uint256 tokenId
    ) public view returns (uint256) {
        uint256 pos = _posOfClasses[tokenId];
        require(pos > 0);

        return _allClasses[pos - 1].registerClassFee;
    }
    // Class Block: End
}
