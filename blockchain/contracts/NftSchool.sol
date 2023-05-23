// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;

import "./ERC1155BaseContract.sol";
import "./utils/IdentityGenerator.sol";
import "./interfaces/INftSchool.sol";
import "./interfaces/INftIdentities.sol";
import "./interfaces/INftCertificates.sol";

contract NftSchool is ERC1155BaseContract, INftSchool, IdentityGenerator {
    using Counters for Counters.Counter;

    uint256 constant COURSE_ID = 1;
    uint256 constant CLASS_ID = 2;
    uint256 constant REGISTERED_TIME_ID = 3;

    uint256 constant NFT_COURSE_REGISTRATION_ID = 0;

    uint256 public minimumGraduationScore = 500;

    string[] private courseURIs;

    INftIdentities private _nftIdentities;
    INftCertificates private _nftCertificates;

    bool public _isInitialize;
    uint256 public registerClassFee = 0.5 ether;

    event NewClassCreated(uint256 id);

    mapping(uint256 => uint256) private _registeredStartAt;
    mapping(uint256 => uint256) private _registeredEndAt;

    mapping(uint256 => uint256[]) private _classIdByRegisterTime;
    mapping(uint256 => mapping(string => uint256)) private _idOfURIOfType;

    Course[] private _allCourses;
    mapping(uint256 => uint256) _posOfCourses;

    KnowledgeBlock[] private _knowledgeBlocks;

    Class[] private _allClasses;
    mapping(uint256 => uint256) private _posOfClasses;
    mapping(uint256 => uint256[]) private _assignedClassesOfTeacher;

    NftClassRegistration[] private _allNftClassRegistrations;
    mapping(uint256 => uint256) private _posOfNftClassRegistrationTokenId;
    mapping(uint256 => uint256[]) private _registeredClassTokenIdOfStudent; // REMOVE when have certificate?
    mapping(uint256 => mapping(uint256 => uint256))
        private _registeredCourseOfStudent; // REMOVE when have certificate?
    mapping(uint256 => uint256[]) private _registeredTokenIdOfClass; // KEEP

    mapping(uint256 => mapping(uint256 => uint256)) _posOfTokenIdOfNftType;

    modifier onlyOwner() {
        require(_owner == msg.sender);
        _;
    }

    constructor(
        address nftIdentities,
        string[] memory knowledgeBlockNames,
        uint256[] memory knowledgeBlockCredits
    ) ERC1155BaseContract("") {
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
    ) public view returns (uint256, uint256) {
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
    ) public view returns (ClassResponse memory) {
        uint256 pos = _posOfClasses[id];
        require(pos > 0);

        return _getClassByIdx(pos - 1);
    }

    function getAllClasses()
        external
        view
        onlyOwner
        returns (ClassResponse[] memory)
    {
        uint256 length = _allClasses.length;
        ClassResponse[] memory classResponses = new ClassResponse[](length);

        for (uint256 idx; idx < length; ++idx) {
            classResponses[idx] = _getClassByIdx(idx);
        }

        return classResponses;
    }

    function getCurrentRegisteredClasses(
        uint256 semester
    ) external view returns (ClassResponse[] memory) {
        uint256[] memory ids = _classIdByRegisterTime[semester];
        uint256 count = ids.length;
        ClassResponse[] memory classes = new ClassResponse[](count);

        for (uint256 idx; idx < count; ++idx) {
            classes[idx] = _getClassByIdx(_posOfClasses[ids[idx]] - 1);
        }

        return classes;
    }

    function getAssignedClasses(
        uint256 tokenId
    ) external view returns (ClassResponse[] memory) {
        uint256 count = _assignedClassesOfTeacher[tokenId].length;
        ClassResponse[] memory result = new ClassResponse[](count);

        for (uint256 idx; idx < count; ++idx) {
            result[idx] = getClassById(_assignedClassesOfTeacher[tokenId][idx]);
        }

        return result;
    }

    function createClass(
        uint256 courseId,
        uint256 completeAt,
        uint256 maxSize,
        uint256 teacherTokenId,
        uint256 semester,
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
                uri
            )
        );
        _posOfClasses[id] = _allClasses.length;
        _classIdByRegisterTime[semester].push(id);
        _assignedClassesOfTeacher[teacherTokenId].push(id);
        emit NewClassCreated(id);

        return id;
    }

    function _getClassByIdx(
        uint256 idx
    ) private view returns (ClassResponse memory) {
        return
            ClassResponse(
                _allClasses[idx],
                _registeredTokenIdOfClass[_allClasses[idx].id].length
            );
    }

    // Class Block: End

    // Register class block: start
    // function getRegisteredClasses()
    //     public
    //     view
    //     returns (NftClassRegistrationResponse[] memory)
    // {
    //     NftIdentityResponse memory nftIdentityResponse = _nftIdentities
    //         .getNftOfMemberWithRole(uint256(ROLE.STUDENT), msg.sender);
    //     uint256 studentTokenId = nftIdentityResponse.nftIdentity.tokenId;
    //     uint256[]
    //         memory nftClassRegistrationTokenIds = _registeredClassTokenIdOfStudent[
    //             studentTokenId
    //         ];
    //     uint256 count = nftClassRegistrationTokenIds.length;

    //     NftClassRegistrationResponse[]
    //         memory nftClassRegistrationResponses = new NftClassRegistrationResponse[](
    //             count
    //         );

    //     for (uint256 idx = 0; idx < count; ++idx) {
    //         NftClassRegistration
    //             memory nftClassRegistration = getNftClassRegistration(
    //                 nftClassRegistrationTokenIds[idx]
    //             );

    //         nftClassRegistrationResponses[idx] = NftClassRegistrationResponse(
    //             nftClassRegistration,
    //             getClassById(nftClassRegistration.classId).class,
    //             uri(nftClassRegistration.tokenId)
    //         );
    //     }

    //     return nftClassRegistrationResponses;
    // }

    // function getNftClassRegistration(
    //     uint256 tokenId
    // ) public view returns (NftClassRegistration memory) {
    //     uint256 posOfNft = _posOfNftClassRegistrationTokenId[tokenId];
    //     require(posOfNft > 0);

    //     return _allNftClassRegistrations[posOfNft - 1];
    // }

    // function getStudentListOfClass(
    //     uint256 id
    // ) public view returns (NftIdentityResponse[] memory) {
    //     uint256 count = _registeredClassTokenIdOfStudent[id].length;
    //     NftIdentityResponse[] memory result = new NftIdentityResponse[](count);

    //     for (uint256 idx; idx < count; ++idx) {
    //         result[idx] = _nftIdentities.getNftOfTokenId(
    //             _registeredClassTokenIdOfStudent[id][idx]
    //         );
    //     }

    //     return result;
    // }

    // function registerClass(uint256 classId, string memory uri) public payable {
    //     NftIdentityResponse memory nftIdentityResponse = _nftIdentities
    //         .getNftOfMemberWithRole(uint256(ROLE.STUDENT), msg.sender);
    //     uint256 studentTokenId = nftIdentityResponse.nftIdentity.tokenId;
    //     Class memory class = getClassById(classId).class;

    //     require(!nftIdentityResponse.isExpired);
    //     require(_registeredTokenIdOfClass[class.id].length < class.maxSize);
    //     require(block.timestamp >= class.registeredStartAt);
    //     require(block.timestamp <= class.registeredEndAt);
    //     require(
    //         class.prevCourseId == 0 ||
    //             _nftCertificates.checkCompleteCourse(
    //                 class.prevCourseId,
    //                 msg.sender
    //             )
    //     );
    //     require(
    //         _registeredCourseOfStudent[studentTokenId][class.courseId] == 0
    //     );
    //     require(msg.value == registerClassFee);
    //     uint256 tokenId = _mintToken(
    //         msg.sender,
    //         NFT_COURSE_REGISTRATION_ID,
    //         uri
    //     );
    //     _allNftClassRegistrations.push(
    //         NftClassRegistration(tokenId, classId, studentTokenId)
    //     );
    //     _posOfNftClassRegistrationTokenId[tokenId] = _allNftClassRegistrations
    //         .length;
    //     _registeredClassTokenIdOfStudent[studentTokenId].push(tokenId);
    //     _registeredCourseOfStudent[studentTokenId][class.courseId] = tokenId;
    //     _registeredTokenIdOfClass[class.id].push(tokenId);
    // }
}
