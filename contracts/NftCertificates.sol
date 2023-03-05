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

    NftIdentities private _nftIdentities;
    address private _owner;

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
    NftScoreBoard[] private _allNftScoreBoards;
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
        _mintNftRequirement(credits, tokenURI);
    }

    function updateRequirement(uint256 tokenId, uint256 credits)
        public
        onlyOwner
        afterYearEnd
    {
        require(credits > 0, "Credit must be a positive number");
        uint256 pos = _posOfTokenIdOfNftType[NFT_REQUIREMENT][tokenId];
        require(pos > 0, "Nft does not exist");

        _allNftRequirements[pos - 1].credits = credits;
    }

    function burnRequirement(uint256 tokenId) public onlyOwner afterYearEnd {
        uint256 pos = _posOfTokenIdOfNftType[NFT_REQUIREMENT][tokenId];
        require(pos > 0, "Nft does not exist");

        _burn(_owner, tokenId, ONE_NFT);
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
        // TODO
        _mintNftCourseTemplate(requirementId, credits, tokenURI);
    }

    function updateCourseTemplate(uint256 tokenId, uint256 credits)
        public
        onlyOwner
        afterYearEnd
    {
        require(credits > 0, "Credit must be a positive number");
        uint256 pos = _posOfTokenIdOfNftType[NFT_COURSE_TEMPLATE][tokenId];
        require(pos > 0, "Nft does not exist");

        _allNftCourseTemplates[pos - 1].credits = credits;
    }

    function burnCourseTemplate(uint256 tokenId) public onlyOwner afterYearEnd {
        uint256 pos = _posOfTokenIdOfNftType[NFT_COURSE_TEMPLATE][tokenId];
        require(pos > 0, "Nft does not exist");

        _burn(_owner, tokenId, ONE_NFT);
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

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal virtual override {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
        uint256 numberOfTokens = ids.length;

        if (from == address(0)) {
            // mint token
            for (uint256 idx = 0; idx <= numberOfTokens; ++idx) {
                _ownerOfNft[ids[idx]] = to;
            }
        }

        if (to == address(0)) {
            // burn token
            for (uint256 idx = 0; idx <= numberOfTokens; ++idx) {
                delete _ownerOfNft[ids[idx]];
            }
        }
    }

    function _mintNftRequirement(uint256 credits, string memory tokenURI)
        public
        returns (uint256)
    {
        require(credits > 0, "Credits must be a positive number");
        require(!_usedTokenURI[tokenURI], "URI has been used");

        uint256 tokenId = _generateNewTokenId(NFT_REQUIREMENT);
        _createNftRequirement(tokenId, credits);
        _mint(_owner, tokenId, ONE_NFT, msg.data);
        _usedTokenURI[tokenURI] = true;

        return tokenId;
    }

    function _createNftRequirement(uint256 tokenId, uint256 credits) private {
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
        uint256 pos = _posOfTokenIdOfNftType[NFT_REQUIREMENT][requirementId];
        require(
            pos > 0,
            "Nft requirement must be created before creating nft course template for it"
        );
        require(credits > 4, "Credits must be a positive number");
        require(!_usedTokenURI[tokenURI], "URI has been used");

        uint256 tokenId = _generateNewTokenId(NFT_COURSE_TEMPLATE);
        _createNftCourseTemplate(tokenId, requirementId, credits);
        _mint(_owner, tokenId, ONE_NFT, msg.data);
        _usedTokenURI[tokenURI] = true;

        return tokenId;
    }

    function _createNftCourseTemplate(
        uint256 tokenId,
        uint256 requirementId,
        uint256 credits
    ) private {
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

    function _mintNftClass(
        uint256 courseTemplateId,
        uint256 credits,
        uint256 completeAt,
        uint256[] memory requiredScore,
        uint256 maxSize,
        address teacherAddr,
        string memory tokenURI
    ) private returns (uint256) {
        uint256 pos = _posOfTokenIdOfNftType[NFT_COURSE_TEMPLATE][
            courseTemplateId
        ];
        require(
            pos > 0,
            "Nft course template id must be created before creating nft course template for it"
        );
        require(credits > 4, "Credits must be a positive number");
        require(maxSize > 0, "The size of classes must be a positive number");
        require(
            completeAt > registeredEndAt,
            "Class must be completed after registered date"
        );
        require(
            _checkValidScores(requiredScore),
            "Required scores are not valid"
        );
        require(!_usedTokenURI[tokenURI], "URI has been used");

        uint256 tokenId = _generateNewTokenId(NFT_CLASS);
        _createNftClass(
            tokenId,
            courseTemplateId,
            credits,
            completeAt,
            maxSize,
            requiredScore,
            teacherAddr
        );
        _mint(_owner, tokenId, ONE_NFT, msg.data);
        _usedTokenURI[tokenURI] = true;

        return tokenId;
    }

    function _createNftClass(
        uint256 tokenId,
        uint256 courseTemplateId,
        uint256 credits,
        uint256 completeAt,
        uint256 maxSize,
        uint256[] memory requiredScore,
        address teacherAddr
    ) private {
        NftClass memory nftClass = NftClass(
            tokenId,
            courseTemplateId,
            credits,
            completeAt,
            requiredScore,
            new address[](maxSize),
            maxSize,
            teacherAddr
        );
        _allNftClasses.push(nftClass);
        _posOfTokenIdOfNftType[NFT_CLASS][tokenId] = _allNftClasses.length;
    }

    function _mintNftScoreBoard(
        uint256 classId,
        address studentAddr,
        uint256[] memory requiredScore,
        string memory tokenURI
    ) private returns (uint256) {
        uint256 pos = _posOfTokenIdOfNftType[NFT_CLASS][classId];
        require(
            pos > 0,
            "Nft requirement must be created before creating nft course template for it"
        );
        require(!_usedTokenURI[tokenURI], "URI has been used");

        uint256 tokenId = _generateNewTokenId(NFT_SCORE_BOARD);
        _createNftScoreBoard(tokenId, classId, studentAddr, requiredScore);
        _mint(_owner, tokenId, ONE_NFT, msg.data);
        _usedTokenURI[tokenURI] = true;

        return tokenId;
    }

    function _createNftScoreBoard(
        uint256 tokenId,
        uint256 classId,
        address studentAddr,
        uint256[] memory requiredScore
    ) private {
        NftScoreBoard memory nftScoreBoard = NftScoreBoard(
            tokenId,
            classId,
            studentAddr,
            requiredScore,
            new uint256[](requiredScore.length)
        );
        _allNftScoreBoards.push(nftScoreBoard);
        _posOfTokenIdOfNftType[NFT_SCORE_BOARD][tokenId] = _allNftScoreBoards
            .length;
    }

    function _mintNftCompleteCourse(
        uint256 credits,
        uint256 avgScore,
        string memory tokenURI
    ) private returns (uint256) {
        require(
            credits > 0,
            "Nft requirement must be created before creating nft course template for it"
        );
        require(!_usedTokenURI[tokenURI], "URI has been used");

        uint256 tokenId = _generateNewTokenId(NFT_COMPLETE_COURSE);
        _createNftCompleteCourse(tokenId, credits, avgScore);
        _mint(_owner, tokenId, ONE_NFT, msg.data);
        _usedTokenURI[tokenURI] = true;

        return tokenId;
    }

    function _createNftCompleteCourse(
        uint256 tokenId,
        uint256 credits,
        uint256 avgScore
    ) private {
        NftCompleteCourse memory nftCompleteCourse = NftCompleteCourse(
            tokenId,
            credits,
            avgScore
        );
        _allNftCompleteCourses.push(nftCompleteCourse);
        _posOfTokenIdOfNftType[NFT_COMPLETE_COURSE][
            tokenId
        ] = _allNftCompleteCourses.length;
    }

    function _mintNftGraduation(string memory tokenURI)
        private
        returns (uint256)
    {
        require(!_usedTokenURI[tokenURI], "URI has been used");

        uint256 tokenId = _generateNewTokenId(NFT_GRADUATION);
        _createNftGraduation(tokenId);
        _mint(_owner, tokenId, ONE_NFT, msg.data);
        _usedTokenURI[tokenURI] = true;

        return tokenId;
    }

    function _createNftGraduation(uint256 tokenId) private {
        NftGraduation memory nftGraduation = NftGraduation(tokenId);
        _allNftGraduations.push(nftGraduation);
        _posOfTokenIdOfNftType[NFT_GRADUATION][tokenId] = _allNftGraduations
            .length;
    }
}
