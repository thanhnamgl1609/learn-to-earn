// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;

import "./CertificateDefinition.sol";
import "./ERC1155BaseContract.sol";
import "./NftIdentities.sol";

/*
    Initial year: Requirements + Course Template (time available to update? --> after year end)
    (Save endCurrentYear) -> Classes -> Register course -> Received Nft Scoreboard
    Course end: Mint Nft complete course <-- Transfer info from Nft Scoreboard to this
    Enough course: Exchange nft graduation from nft courses (payable)
*/
contract NftCertificates is ERC1155BaseContract, CertificateDefinition {
    using Counters for Counters.Counter;

    string[] private courseURIs;
    mapping(string => uint256) credits;

    NftIdentities private _nftIdentities;
    address private _owner;

    bool private _isInitializeRequirement;
    bool private _isInitializeCourse;

    uint256 public schoolYearEnd;
    uint256 public registeredStartAt;
    uint256 public registeredEndAt;
    uint256 public yearId;

    mapping(uint256 => uint256[]) private _classTokenIdsOfYear;

    NftRequirement[] private _allNftRequirements;
    NftCourseTemplate[] private _allNftCourseTemplates;
    NftClass[] private _allNftClasses;
    NftCompleteCourse[] private _allNftCompleteCourses;
    NftGraduation[] private _allNftGraduations;
    mapping(uint256 => mapping(uint256 => uint256)) _posOfTokenIdOfNftType;

    mapping(address => uint256[]) private _studentOwnedCompleteCourseNfts;
    mapping(address => uint256) private _studentOwnedNftGraduation;

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

    constructor(NftIdentities nftIdentities) ERC1155BaseContract("") {
        _nftIdentities = nftIdentities;
        _owner = msg.sender;
        schoolYearEnd = block.timestamp;
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
    }

    function initializeCourse(
        uint256[] memory credits,
        string[] memory tokenURIs
    ) public onlyOwner {
        require(!_isInitializeCourse, "Course has been initialized");
    }

    function initializeYear(
        uint256 _schoolYearEnd,
        uint256 _registeredStartAt,
        uint256 _registeredEndAt
    ) public {
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

    function createRequirement(uint256 credits, string memory tokenURI)
        public
        onlyOwner
        afterYearEnd
    {
        require(
            _isInitializeRequirement,
            "Requirement must be initialized before creating new"
        );
        // TODO
    }

    function updateRequirement(uint256 tokenId, uint256 credits)
        public
        onlyOwner
        afterYearEnd
    {
        // TODO
    }

    function burnRequirement(uint256 tokenId) public onlyOwner afterYearEnd {
        // TODO
    }

    function createCourse(uint256 credits, string memory tokenURI)
        public
        onlyOwner
        afterYearEnd
    {
        require(
            _isInitializeCourse,
            "Course must be initialized before creating new"
        );
        // TODO
    }

    function updateCourse(uint256 tokenId, uint256 credits)
        public
        onlyOwner
        afterYearEnd
    {
        // TODO
    }

    function burnCourse(uint256 tokenId) public onlyOwner {
        // TODO
        // require
    }

    // (everyone)
    function getRegisteredClasses()
        public
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
        public
        view
        returns (NftRequirement[] memory)
    {
        return _allNftRequirements;
    }

    function getNftRequirement(uint256 tokenId)
        public
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

    function getOwnedNftCompleteCourse()
        public
        view
        returns (NftCompleteCourse[] memory, string[] memory)
    {
        uint256 numberOfNftCompleteCourses = _studentOwnedCompleteCourseNfts[
            msg.sender
        ].length;
        require(
            numberOfNftCompleteCourses > 0,
            "You haven't completed any courses"
        );

        NftCompleteCourse[] memory nfts = new NftCompleteCourse[](
            numberOfNftCompleteCourses
        );
        string[] memory nftURIs = new string[](numberOfNftCompleteCourses);

        for (uint256 idx = 0; idx <= numberOfNftCompleteCourses; ++idx) {
            (nfts[idx], nftURIs[idx]) = getNftCompleteCourse(
                _studentOwnedCompleteCourseNfts[msg.sender][idx]
            );
        }

        return (nfts, nftURIs);
    }

    function getNftCompleteCourse(uint256 tokenId)
        public
        view
        returns (NftCompleteCourse memory, string memory)
    {
        uint256 pos = _posOfTokenIdOfNftType[NFT_COMPLETE_COURSE][tokenId];
        require(pos > 0, "Nft does not exist");

        return (_allNftCompleteCourses[pos - 1], uri(tokenId));
    }

    function getOwnedNftGraduation()
        public
        view
        returns (NftGraduation memory, string memory)
    {
        uint256 tokenId = _studentOwnedNftGraduation[msg.sender];

        return getNftGraduation(tokenId);
    }

    function getNftGraduation(uint256 tokenId)
        public
        view
        returns (NftGraduation memory, string memory)
    {
        uint256 pos = _posOfTokenIdOfNftType[NFT_GRADUATION][tokenId];
        require(pos > 0, "Nft does not exist");

        return (_allNftGraduations[pos - 1], uri(tokenId));
    }

    // (everyone)

    // onlyOwner
    function getAllNftClasses(uint256 _yearId)
        public
        view
        onlyOwner
        returns (NftClass[] memory, string[] memory)
    {
        require(_yearId <= yearId, "Desired year is not valid");

        return _getAllNftClasses(_yearId);
    }

    function getAllNftCourseTemplate()
        public
        view
        onlyOwner
        returns (NftCourseTemplate[] memory)
    {
        return _allNftCourseTemplates;
    }

    function getNftCourseTemplate(uint256 tokenId)
        public
        view
        returns (NftCourseTemplate memory)
    {
        uint256 pos = _posOfTokenIdOfNftType[NFT_COURSE_TEMPLATE][tokenId];
        require(pos > 0, "Nft does not exist");

        return _allNftCourseTemplates[pos - 1];
    }

    function checkInRegisterDate() public view returns (bool) {
        return
            block.timestamp >= registeredStartAt &&
            block.timestamp <= registeredEndAt;
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
}
