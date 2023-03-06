// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;

import "./CertificateDefinition.sol";
import "./ERC1155BaseContract.sol";
import "./interfaces/INftSchool.sol";
import "./interfaces/INftCertificates.sol";
import "./interfaces/INftIdentities.sol";

/*
    Initial year: Requirements + Course Template (time available to update? --> after year end)
    (Save endCurrentYear) -> Classes -> Register course -> Received Nft Scoreboard
    Course end: Mint Nft complete course <-- Transfer info from Nft Scoreboard to this
    Enough course: Exchange nft graduation from nft courses (payable)
*/
contract NftCertificates is ERC1155BaseContract, INftCertificates {
    using Counters for Counters.Counter;
    uint256 constant NFT_CLASS = 3;
    uint256 constant NFT_SCORE_BOARD = 4;
    uint256 constant NFT_COMPLETE_COURSE = 5;
    uint256 constant NFT_GRADUATION = 6;

    string[] private courseURIs;

    INftIdentities private immutable _nftIdentities;
    INftSchool private immutable _nftSchool;

    uint256 public schoolYearEnd;
    uint256 public registeredStartAt;
    uint256 public registeredEndAt;
    uint256 public yearId;

    mapping(uint256 => bool) private _usableScores;

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

    constructor(address nftIdentities, address nftSchool) ERC1155BaseContract("") {
        _nftIdentities = INftIdentities(nftIdentities);
        _nftSchool = INftSchool(nftSchool);
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

    // (everyone)
    function getOwnedNftCompleteCourse()
        external
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
        external
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

    function _mintNftScoreBoard(
        uint256 classId,
        address studentAddr,
        uint256[] memory requiredScore,
        string memory tokenURI
    ) private returns (uint256) {
        uint256 tokenId = _mintToken(NFT_SCORE_BOARD, tokenURI);
        _createNftScoreBoard(tokenId, classId, studentAddr, requiredScore);

        return tokenId;
    }

    function _createNftScoreBoard(
        uint256 tokenId,
        uint256 classId,
        address studentAddr,
        uint256[] memory requiredScore
    ) private {
        bool classExists = _nftSchool.checkTokenOfTypeExists(tokenId, NFT_CLASS);
        require(
            classExists,
            "Nft requirement must be created before creating nft course template for it"
        );
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
        uint256 tokenId = _mintToken(NFT_COMPLETE_COURSE, tokenURI);
        _createNftCompleteCourse(tokenId, credits, avgScore);

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
        uint256 tokenId = _mintToken(NFT_GRADUATION, tokenURI);
        _createNftGraduation(tokenId);

        return tokenId;
    }

    function _createNftGraduation(uint256 tokenId) private {
        NftGraduation memory nftGraduation = NftGraduation(tokenId);
        _allNftGraduations.push(nftGraduation);
        _posOfTokenIdOfNftType[NFT_GRADUATION][tokenId] = _allNftGraduations
            .length;
    }
}
