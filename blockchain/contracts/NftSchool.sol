// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;

import "./ERC1155BaseContract.sol";
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
contract NftSchool is ERC1155BaseContract, INftSchool {
    using Counters for Counters.Counter;

    uint256 constant NFT_COURSE = 1;
    uint256 constant NFT_CLASS = 2;

    uint256 public minimumGraduationScore = 500;

    string[] private courseURIs;

    INftIdentities private _nftIdentities;
    INftCertificates private _nftCertificates;
    IScore private _scoreContract;

    bool public _isInitialize;

    uint256 public schoolYearEnd;
    uint256 public registeredStartAt;
    uint256 public registeredEndAt;
    uint256 public yearId;

    mapping(uint256 => uint256[]) private _classTokenIdsOfYear;

    KnowledgeBlock[] private _knowledgeBlocks;
    NftCourse[] private _allNftCourses;
    NftClass[] private _allNftClasses;
    mapping(uint256 => mapping(uint256 => uint256)) _posOfTokenIdOfNftType;

    modifier isInitialized() {
        require(_isInitialize);
        _;
    }

    modifier onlyOwner() {
        require(_owner == msg.sender);
        _;
    }

    modifier afterYearEnd() {
        require(block.timestamp > schoolYearEnd);
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

    constructor(
        address nftIdentities,
        address scoreAddr,
        string[] memory knowledgeBlockNames,
        uint256[] memory knowledgeBlockCredits
    ) ERC1155BaseContract("") {
        _nftIdentities = INftIdentities(nftIdentities);
        _scoreContract = IScore(scoreAddr);
        schoolYearEnd = block.timestamp;

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

    function initializeYear(
        uint256 _schoolYearEnd,
        uint256 _registeredStartAt,
        uint256 _registeredEndAt
    ) public onlyOwner afterYearEnd {
        require(
            _registeredEndAt > _registeredStartAt,
            "End time must be after start time"
        );
        require(
            _schoolYearEnd > _registeredEndAt,
            "Registered date must be before year end"
        );
        schoolYearEnd = _schoolYearEnd;
        registeredStartAt = _registeredStartAt;
        registeredEndAt = _registeredEndAt;
        yearId += 1;
    }

    function updateRegisteredTime(
        uint256 _registeredStartAt,
        uint256 _registeredEndAt
    ) external onlyOwner {
        require(
            _registeredEndAt > _registeredStartAt,
            "End time must be after start time"
        );
        require(
            schoolYearEnd > _registeredEndAt,
            "Registered date must be before year end"
        );
        registeredStartAt = _registeredStartAt;
        registeredEndAt = _registeredEndAt;
    }

    function createCourse(
        uint256 knowledgeBlock,
        uint256 credits,
        string memory tokenURI
    ) public onlyOwner afterYearEnd {
        _mintNftCourse(knowledgeBlock, credits, tokenURI);
    }

    function updateCourse(
        uint256 tokenId,
        uint256 credits
    ) external onlyOwner afterYearEnd {
        require(credits > 0, "Credit must be a positive number");
        uint256 pos = _posOfTokenIdOfNftType[NFT_COURSE][tokenId];
        require(pos > 0, "Nft does not exist");

        _allNftCourses[pos - 1].credits = credits;
    }

    function burnToken(
        uint256 tokenId
    ) external onlyOwner afterYearEnd tokenExist(tokenId) {
        _burn(_owner, tokenId, ONE_NFT);
    }

    // (everyone)
    function getRegisteredClasses()
        external
        view
        returns (NftClass[] memory, string[] memory)
    {
        require(
            msg.sender == _owner || checkInRegisterDate(),
            "It's not time to register class"
        );

        return _getAllNftClasses(yearId);
    }

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

    function getNftClass(
        uint256 tokenId
    ) public view returns (NftClass memory, string memory) {
        uint256 pos = _posOfTokenIdOfNftType[NFT_CLASS][tokenId];
        require(pos > 0, "Nft does not exist");

        return (_allNftClasses[pos - 1], uri(tokenId));
    }

    function getAllNftClasses(
        uint256 _yearId
    ) external view onlyOwner returns (NftClass[] memory, string[] memory) {
        require(_yearId <= yearId, "Desired year is not valid");

        return _getAllNftClasses(_yearId);
    }

    function getAllCourses()
        external
        view
        onlyOwner
        returns (NftCourse[] memory)
    {
        return _allNftCourses;
    }

    function getCourse(
        uint256 tokenId
    ) public view returns (NftCourse memory, string memory) {
        uint256 pos = _posOfTokenIdOfNftType[NFT_COURSE][tokenId];
        require(pos > 0, "Nft does not exist");

        return (_allNftCourses[pos - 1], uri(tokenId));
    }

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

    function checkInRegisterDate() public view returns (bool) {
        return
            block.timestamp >= registeredStartAt &&
            block.timestamp <= registeredEndAt;
    }

    function _getAllNftClasses(
        uint256 _yearId
    ) private view onlyOwner returns (NftClass[] memory, string[] memory) {
        uint256 numberOfClasses = _classTokenIdsOfYear[_yearId].length;
        NftClass[] memory nftClasses = new NftClass[](numberOfClasses);
        string[] memory tokenURIs = new string[](numberOfClasses);

        for (uint256 idx = 0; idx <= numberOfClasses; ++idx) {
            (nftClasses[idx], tokenURIs[idx]) = getNftClass(
                _classTokenIdsOfYear[yearId][idx]
            );
        }

        return (nftClasses, tokenURIs);
    }

    function _mintNftCourse(
        uint256 knowledgeBlockId,
        uint256 credits,
        string memory tokenURI
    ) private returns (uint256) {
        uint256 tokenId = _mintToken(_owner, NFT_COURSE, tokenURI);
        _createNftCourse(tokenId, knowledgeBlockId, credits);

        return tokenId;
    }

    function _createNftCourse(
        uint256 tokenId,
        uint256 knowledgeBlockId,
        uint256 credits
    ) private {
        require(
            knowledgeBlockId <= _knowledgeBlocks.length,
            "Knowledge block doesn't exist"
        );
        require(credits > 0, "Credits must be a positive number");
        NftCourse memory nftCourse = NftCourse(
            tokenId,
            knowledgeBlockId,
            credits,
            1
        );
        _allNftCourses.push(nftCourse);
        _posOfTokenIdOfNftType[NFT_COURSE][tokenId] = _allNftCourses.length;
    }

    function _mintNftClass(
        uint256 courseId,
        uint256 credits,
        uint256 completeAt,
        uint256[] memory requiredScores,
        uint256 maxSize,
        address teacher,
        string memory tokenURI
    ) private returns (uint256) {
        uint256 tokenId = _mintToken(_owner, NFT_CLASS, tokenURI);
        _createNftClass(
            tokenId,
            courseId,
            credits,
            completeAt,
            requiredScores,
            maxSize,
            teacher
        );

        return tokenId;
    }

    function _createNftClass(
        uint256 tokenId,
        uint256 courseId,
        uint256 credits,
        uint256 completeAt,
        uint256[] memory requiredScores,
        uint256 maxSize,
        address teacher
    ) private {
        require(
            registeredStartAt > block.timestamp,
            "Update registered date before creating class"
        );
        (NftCourse memory nftCourse, ) = getCourse(tokenId);
        require(credits > 0, "Credits must be a positive number");
        require(
            _scoreContract.checkValidScores(requiredScores),
            "Required scores are not valid"
        );
        NftClass memory nftClass = NftClass(
            tokenId,
            courseId,
            nftCourse.knowledgeBlockId,
            credits,
            registeredStartAt,
            registeredEndAt,
            completeAt,
            requiredScores,
            maxSize,
            teacher
        );
        _allNftClasses.push(nftClass);
        _posOfTokenIdOfNftType[NFT_CLASS][tokenId] = _allNftClasses.length;
    }
}
