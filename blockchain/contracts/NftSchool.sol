// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;

import "./ERC1155BaseContract.sol";
import "./utils/IdentityGenerator.sol";
import "./interfaces/INftSchool.sol";
import "./interfaces/INftIdentities.sol";
import "./interfaces/INftCertificates.sol";
import "./interfaces/IScore.sol";

/*
    Initial year: Requirements + Course Template (time available to update? --> after year end)
    (Save endCurrentYear) -> Classes -> Register course -> Received Nft Scoreboard
    Course end: Mint Nft complete course <-- Transfer info from Nft Scoreboard to this
    Enough course: Exchange nft graduation from nft courses (payable)
*/
/*
    - Initial year
    - Requirements, course templates, classes
*/
contract NftSchool is ERC1155BaseContract, INftSchool, IdentityGenerator {
    using Counters for Counters.Counter;

    uint256 constant COURSE_ID = 1;
    uint256 constant CLASS_ID = 2;
    uint256 constant REGISTERED_TIME_ID = 3;

    uint256 constant NFT_COURSE_REGISTRATION_ID = 1;

    uint256 public minimumGraduationScore = 500;

    string[] private courseURIs;

    INftIdentities private _nftIdentities;
    INftCertificates private _nftCertificates;
    IScore private _scoreContract;

    bool public _isInitialize;

    mapping(uint256 => uint256) private _registeredStartAt;
    mapping(uint256 => uint256) private _registeredEndAt;

    mapping(uint256 => uint256[]) private _classIdByRegisterTime;

    Course[] private _allCourses;
    mapping(uint256 => uint256) _posOfCourses;

    KnowledgeBlock[] private _knowledgeBlocks;

    Class[] private _allClasses;
    mapping(uint256 => uint256) _posOfClasses;

    mapping(uint256 => mapping(uint256 => uint256)) _posOfTokenIdOfNftType;

    modifier isInitialized() {
        require(_isInitialize);
        _;
    }

    modifier onlyOwner() {
        require(_owner == msg.sender);
        _;
    }

    modifier canOperate(uint256 role) {
        require(_nftIdentities.isAbleToOperate(msg.sender, role));
        _;
    }

    modifier tokenExist(uint256 tokenId) {
        require(checkTokenExists(tokenId), "Token exists");
        _;
    }

    // modifier isStudent() {
    //     require(_nftIdentities.isRole(msg.sender, uint256(ROLE.STUDENT)));
    //     _;
    // }

    constructor(
        address nftIdentities,
        address scoreAddr,
        string[] memory knowledgeBlockNames,
        uint256[] memory knowledgeBlockCredits
    ) ERC1155BaseContract("") {
        _nftIdentities = INftIdentities(nftIdentities);
        _scoreContract = IScore(scoreAddr);

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

    // Register time Section: Start
    function updateRegisteredTime(
        uint256 registeredStartAt,
        uint256 registeredEndAt
    ) external onlyOwner {
        uint256 currentRegisterTimeId = getCurrentId(REGISTERED_TIME_ID);
        require(
            _classIdByRegisterTime[currentRegisterTimeId].length == 0 ||
                _registeredEndAt[currentRegisterTimeId] <= block.timestamp
        );
        require(registeredEndAt > registeredStartAt);
        uint256 nextRegisterTimeId = generateNewId(REGISTERED_TIME_ID);
        _registeredStartAt[nextRegisterTimeId] = registeredStartAt;
        _registeredEndAt[nextRegisterTimeId] = registeredEndAt;
    }

    function getRegisterTime() public view returns (uint256, uint256) {
        uint256 currentRegisteredTimeId = getCurrentId(REGISTERED_TIME_ID);

        return (
            _registeredStartAt[currentRegisteredTimeId],
            _registeredEndAt[currentRegisteredTimeId]
        );
    }

    // Register time Section: End

    // Course Block: Start
    function getAllCourses() external view onlyOwner returns (Course[] memory) {
        return _allCourses;
    }

    function getCourseById(uint256 id) public view returns (Course memory) {
        uint256 pos = _posOfCourses[id];
        require(pos > 0, "Nft does not exist");

        return _allCourses[pos - 1];
    }

    function createCourse(
        uint256 prevCourseId,
        uint256 knowledgeBlockId,
        uint256 credits,
        string memory uri
    ) public onlyOwner returns (uint256) {
        require(
            knowledgeBlockId <= _knowledgeBlocks.length,
            "Knowledge block doesn't exist"
        );
        require(credits > 0, "Credits must be a positive number");
        require(prevCourseId == 0 || _posOfCourses[prevCourseId] > 0);
        uint256 id = generateNewId(COURSE_ID);
        _allCourses.push(
            Course(id, knowledgeBlockId, prevCourseId, credits, 1, uri)
        );
        _posOfCourses[id] = _allCourses.length;

        return id;
    }

    function updateCourse(uint256 id, uint256 credits) external onlyOwner {
        require(credits > 0, "Credit must be a positive number");
        uint256 pos = _posOfCourses[id];
        require(pos > 0, "Nft does not exist");

        _allCourses[pos - 1].credits = credits;
    }

    // Course Block: End

    // Class Block: Start
    function getClassById(uint256 id) public view returns (Class memory) {
        uint256 pos = _posOfClasses[id];
        require(pos > 0, "Class does not exist");

        return _allClasses[pos - 1];
    }

    function getAllClasses() external view onlyOwner returns (Class[] memory) {
        return _allClasses;
    }

    function getCurrentRegisteredClasses()
        external
        view
        returns (Class[] memory)
    {
        uint256 currentRegisterTimeId = getCurrentId(REGISTERED_TIME_ID);
        require(
            msg.sender == _owner || checkInRegisterDate(currentRegisterTimeId),
            "It's not time to register class"
        );
        return _getClassesByRegisteredTime(currentRegisterTimeId);
    }

    function createClass(
        uint256 courseId,
        uint256 completeAt,
        uint256[] memory requiredScores,
        uint256 maxSize,
        uint256 teacherTokenId,
        string memory uri
    ) public onlyOwner returns (uint256) {
        Course memory course = getCourseById(courseId);
        uint256 currentRegisterTimeId = getCurrentId(REGISTERED_TIME_ID);
        uint256 nftTeacherRole = _nftIdentities.getTokenType(teacherTokenId);

        require(completeAt > _registeredEndAt[currentRegisterTimeId]);
        require(
            _registeredStartAt[currentRegisterTimeId] > block.timestamp,
            "Update registered date before creating class"
        );
        require(nftTeacherRole == uint256(ROLE.TEACHER));
        require(
            _scoreContract.checkValidScores(requiredScores),
            "Required scores are not valid"
        );
        uint256 id = generateNewId(CLASS_ID);
        _allClasses.push(
            Class(
                id,
                courseId,
                course.knowledgeBlockId,
                course.prevCourseId,
                course.credits,
                _registeredStartAt[currentRegisterTimeId],
                _registeredEndAt[currentRegisterTimeId],
                completeAt,
                requiredScores,
                maxSize,
                teacherTokenId,
                uri
            )
        );
        _posOfClasses[id] = _allClasses.length;
        _classIdByRegisterTime[currentRegisterTimeId].push(id);

        return id;
    }

    function _getClassesByRegisteredTime(
        uint256 registeredId
    ) private view returns (Class[] memory) {
        uint256[] memory ids = _classIdByRegisterTime[registeredId];
        uint256 count = ids.length;
        Class[] memory classes = new Class[](count);

        for (uint256 idx; idx < count; ++idx) {
            uint256 pos = _posOfClasses[ids[idx]];
            classes[idx] = _allClasses[pos - 1];
        }

        return classes;
    }

    // Class Block: End

    // Register class block: start
    // function registerClass(uint256 classId) public payable isStudent {
    //     // Require complete previous class
    //     Class memory class = getClassById(classId);
    //     require(
    //         class.registeredStartAt >= block.timestamp &&
    //             class.registeredEndAt <= block.timestamp
    //     );
    //     require(
    //         class.prevCourseId == 0 ||
    //             _nftCertificates.checkCompleteCourse(
    //                 class.prevCourseId,
    //                 msg.sender
    //             )
    //     );
    // }

    // Register class block: end

    // Knowledge Block: Start
    function getAllKnowledgeBlocks()
        external
        view
        returns (KnowledgeBlock[] memory)
    {
        return _knowledgeBlocks;
    }

    function getKnowledgeBlockById(
        uint256 id
    ) external view returns (KnowledgeBlock memory) {
        return _knowledgeBlocks[id - 1];
    }

    // Knowledge Block: End
    function checkTokenExists(uint256 tokenId) public view returns (bool) {
        uint256 nftType = _getNftType(tokenId);
        uint256 pos = _posOfTokenIdOfNftType[nftType][tokenId];
        return pos > 0;
    }

    function checkTokenOfTypeExists(
        uint256 tokenId,
        uint256 requiredType
    ) external view returns (bool) {
        uint256 nftType = _getNftType(tokenId);
        uint256 pos = _posOfTokenIdOfNftType[nftType][tokenId];
        return pos > 0 && nftType == requiredType;
    }

    function checkInRegisterDate(
        uint256 currentRegisterTimeId
    ) public view returns (bool) {
        return
            block.timestamp >= _registeredStartAt[currentRegisterTimeId] &&
            block.timestamp <= _registeredEndAt[currentRegisterTimeId];
    }
}
