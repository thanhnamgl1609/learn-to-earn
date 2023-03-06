// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;

import "./ERC1155BaseContract.sol";
import "./interfaces/INftSchool.sol";
import "./interfaces/INftIdentities.sol";

/*
    Initial year: Requirements + Course Template (time available to update? --> after year end)
    (Save endCurrentYear) -> Classes -> Register course -> Received Nft Scoreboard
    Course end: Mint Nft complete course <-- Transfer info from Nft Scoreboard to this
    Enough course: Exchange nft graduation from nft courses (payable)
*/
contract NftSchool is ERC1155BaseContract, INftSchool {
    uint256 constant NFT_REQUIREMENT = 1;
    uint256 constant NFT_COURSE_TEMPLATE = 2;
    uint256 constant NFT_CLASS = 3;

    using Counters for Counters.Counter;

    string[] private courseURIs;

    INftIdentities private _nftIdentities;

    bool private _isInitializeRequirement;
    bool private _isInitializeCourse;

    uint256 public schoolYearEnd;
    uint256 public registeredStartAt;
    uint256 public registeredEndAt;
    uint256 public yearId;

    mapping(uint256 => uint256[]) private _classTokenIdsOfYear;
    mapping(uint256 => bool) private _usableScores;

    NftRequirement[] private _allNftRequirements;
    NftCourseTemplate[] private _allNftCourseTemplates;
    NftClass[] private _allNftClasses;
    mapping(uint256 => mapping(uint256 => uint256)) _posOfTokenIdOfNftType;

    modifier onlyOwner() {
        require(_owner == msg.sender);
        _;
    }

    modifier afterYearEnd() {
        require(block.timestamp > schoolYearEnd);
        _;
    }

    modifier canOperate(uint256 role) {
        (bool isDeposited, uint256 __role) = _nftIdentities.isAbleToOperate(
            msg.sender
        );
        require(isDeposited && role == __role);
        _;
    }

    modifier tokenExist(uint256 tokenId) {
        require(checkTokenExists(tokenId), "Token exists");
        _;
    }

    constructor(address nftIdentities) ERC1155BaseContract("") {
        _nftIdentities = INftIdentities(nftIdentities);
        schoolYearEnd = block.timestamp;

        _usableScores[uint256(ScoreType.Midterm)] = true;
        _usableScores[uint256(ScoreType.Practice)] = true;
        _usableScores[uint256(ScoreType.Plus)] = true;
        _usableScores[uint256(ScoreType.Final)] = true;
        _usableScores[uint256(ScoreType.Other)] = true;
    }

    /*
        Initialize requirement before any operation in the system including
        - Requirement
        - Course template
    */
    function initializeRequirement(
        uint256[] memory credits,
        string[] memory tokenURIs
    ) public onlyOwner {
        require(!_isInitializeRequirement, "Requirement has been initialized");
        require(credits.length == tokenURIs.length);
        uint256 numberOfTokens = credits.length;

        for (uint256 idx = 0; idx <= numberOfTokens; ++idx) {
            _mintNftRequirement(credits[idx], tokenURIs[idx]);
        }
    }

    function initializeCourseTemplate(
        uint256[] memory requirementIds,
        uint256[] memory credits,
        string[] memory tokenURIs
    ) public onlyOwner {
        require(!_isInitializeCourse, "Course has been initialized");
        require(requirementIds.length == tokenURIs.length);
        require(requirementIds.length == tokenURIs.length);
        uint256 numberOfTokens = credits.length;

        for (uint256 idx = 0; idx <= numberOfTokens; ++idx) {
            _mintNftCourseTemplate(
                requirementIds[idx],
                credits[idx],
                tokenURIs[idx]
            );
        }
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

    function createRequirement(uint256 credits, string memory tokenURI)
        public
        onlyOwner
        afterYearEnd
    {
        require(
            _isInitializeRequirement,
            "Requirement must be initialized before creating new"
        );
        _mintNftRequirement(credits, tokenURI);
    }

    function updateRequirement(uint256 tokenId, uint256 credits)
        external
        onlyOwner
        afterYearEnd
    {
        require(credits > 0, "Credit must be a positive number");
        uint256 pos = _posOfTokenIdOfNftType[NFT_REQUIREMENT][tokenId];
        require(pos > 0, "Nft does not exist");

        _allNftRequirements[pos - 1].credits = credits;
    }

    function createCourseTemplate(
        uint256 requirementId,
        uint256 credits,
        string memory tokenURI
    ) public onlyOwner afterYearEnd {
        require(
            _isInitializeCourse,
            "Course must be initialized before creating new"
        );
        _mintNftCourseTemplate(requirementId, credits, tokenURI);
    }

    function updateCourseTemplate(uint256 tokenId, uint256 credits)
        external 
        onlyOwner
        afterYearEnd
    {
        require(credits > 0, "Credit must be a positive number");
        uint256 pos = _posOfTokenIdOfNftType[NFT_COURSE_TEMPLATE][tokenId];
        require(pos > 0, "Nft does not exist");

        _allNftCourseTemplates[pos - 1].credits = credits;
    }

    function burnToken(uint256 tokenId) external onlyOwner afterYearEnd tokenExist(tokenId) {
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

    function getAllNftRequirements()
        external
        view
        returns (NftRequirement[] memory, string[] memory)
    {
        uint256 numberOfNft = _allNftRequirements.length;
        string[] memory tokenURIs = new string[](numberOfNft);

        for (uint256 idx = 0; idx <= numberOfNft; ++idx) {
            tokenURIs[idx] = uri(_allNftRequirements[idx].tokenId);
        }

        return (_allNftRequirements, tokenURIs);
    }

    function getNftRequirement(uint256 tokenId)
        external
        view
        returns (NftRequirement memory, string memory)
    {
        uint256 pos = _posOfTokenIdOfNftType[NFT_REQUIREMENT][tokenId];
        require(pos > 0, "Nft does not exist");

        return (_allNftRequirements[pos - 1], uri(tokenId));
    }

    function getNftClass(uint256 tokenId)
        public
        view
        returns (NftClass memory, string memory)
    {
        uint256 pos = _posOfTokenIdOfNftType[NFT_CLASS][tokenId];
        require(pos > 0, "Nft does not exist");

        return (_allNftClasses[pos - 1], uri(tokenId));
    }

    function getAllNftClasses(uint256 _yearId)
        external
        view
        onlyOwner
        returns (NftClass[] memory, string[] memory)
    {
        require(_yearId <= yearId, "Desired year is not valid");

        return _getAllNftClasses(_yearId);
    }

    function getAllNftCourseTemplate()
        external
        view
        onlyOwner
        returns (NftCourseTemplate[] memory)
    {
        return _allNftCourseTemplates;
    }

    function getNftCourseTemplate(uint256 tokenId)
        external
        view
        returns (NftCourseTemplate memory)
    {
        uint256 pos = _posOfTokenIdOfNftType[NFT_COURSE_TEMPLATE][tokenId];
        require(pos > 0, "Nft does not exist");

        return _allNftCourseTemplates[pos - 1];
    }

    function checkTokenExists(uint256 tokenId) public view returns (bool) {
        uint256 nftType = _getNftType(tokenId);
        uint256 pos = _posOfTokenIdOfNftType[nftType][tokenId];
        return pos > 0;
    }

    function checkTokenOfTypeExists(uint256 tokenId, uint256 requiredType) external view returns (bool) {
        uint256 nftType = _getNftType(tokenId);
        uint256 pos = _posOfTokenIdOfNftType[nftType][tokenId];
        return pos > 0 && nftType == requiredType;
    }
    
    function checkInRegisterDate() public view returns (bool) {
        return
            block.timestamp >= registeredStartAt &&
            block.timestamp <= registeredEndAt;
    }

    function _checkValidScores(uint256[] memory scores)
        private
        view
        returns (bool)
    {
        uint256 numberOfChecks = scores.length;
        for (uint256 idx = 0; idx <= numberOfChecks; ++idx) {
            if (!_usableScores[scores[idx]]) {
                return false;
            }
        }

        return true;
    }

    function _getAllNftClasses(uint256 _yearId)
        private
        view
        onlyOwner
        returns (NftClass[] memory, string[] memory)
    {
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

    function _mintNftRequirement(uint256 credits, string memory tokenURI)
        public
        returns (uint256)
    {
        uint256 tokenId = _mintToken(NFT_REQUIREMENT, tokenURI);
        _createNftRequirement(tokenId, credits);
        _mint(_owner, tokenId, ONE_NFT, msg.data);

        return tokenId;
    }

    function _createNftRequirement(uint256 tokenId, uint256 credits) private {
        require(credits > 0, "Credits must be a positive number");
        NftRequirement memory nftRequirement = NftRequirement(tokenId, credits);
        _allNftRequirements.push(nftRequirement);
        _posOfTokenIdOfNftType[NFT_REQUIREMENT][tokenId] = _allNftRequirements
            .length;
    }

    function _mintNftCourseTemplate(
        uint256 requirementId,
        uint256 credits,
        string memory tokenURI
    ) private returns (uint256) {
        uint256 tokenId = _mintToken(NFT_COURSE_TEMPLATE, tokenURI);
        _createNftCourseTemplate(tokenId, requirementId, credits);

        return tokenId;
    }

    function _createNftCourseTemplate(
        uint256 tokenId,
        uint256 requirementId,
        uint256 credits
    ) private {
        uint256 pos = _posOfTokenIdOfNftType[NFT_REQUIREMENT][requirementId];
        require(
            pos > 0,
            "Nft requirement must be created before creating nft course template for it"
        );
        require(credits > 4, "Credits must be a positive number");
        NftCourseTemplate memory nftCourseTemplate = NftCourseTemplate(
            tokenId,
            requirementId,
            credits
        );
        _allNftCourseTemplates.push(nftCourseTemplate);
        _posOfTokenIdOfNftType[NFT_COURSE_TEMPLATE][
            tokenId
        ] = _allNftCourseTemplates.length;
    }
}
