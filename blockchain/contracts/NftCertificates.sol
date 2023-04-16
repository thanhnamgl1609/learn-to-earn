// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;

import "./ERC1155BaseContract.sol";
import "./interfaces/INftSchool.sol";
import "./interfaces/INftCertificates.sol";
import "./interfaces/INftIdentities.sol";
import "./utils/ArrayMath.sol";

/*
    - Register class -> NftScoreboard
    - Exchange Nft Complete Course
    - Exchange Nft Graduation
*/
contract NftCertificates is ERC1155BaseContract, INftCertificates {
    using Counters for Counters.Counter;
    using ArrayMath for uint256[];
    uint256 constant NFT_CLASS = 3;
    uint256 constant NFT_SCORE_BOARD = 4;
    uint256 constant NFT_COMPLETE_COURSE = 5;
    uint256 constant NFT_GRADUATION = 6;

    uint256 public registeredPrice = 1 ether;
    uint256 public graduationPrice = 1 ether;

    string[] private courseURIs;

    INftIdentities private immutable _nftIdentities;
    INftSchool private immutable _nftSchool;

    uint256 public schoolYearEnd;
    uint256 public registeredStartAt;
    uint256 public registeredEndAt;
    uint256 public yearId;

    NftScoreBoard[] private _allNftScoreBoards;
    NftCompleteCourse[] private _allNftCompleteCourses;
    NftGraduation[] private _allNftGraduations;
    mapping(uint256 => mapping(uint256 => uint256)) _posOfTokenIdOfNftType;

    mapping(uint256 => uint256[]) _studentsOfClass;
    mapping(uint256 => mapping(uint256 => uint256)) _posOfStudentInClass;
    mapping(uint256 => uint256[]) private _studentOwnedCompleteCourseNfts;
    mapping(uint256 => mapping(uint256 => bool))
        private _completedCourseOfStudent;
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
        require(_nftIdentities.isAbleToOperate(msg.sender, role));
        _;
    }

    constructor(
        address nftIdentities,
        address nftSchool
    ) ERC1155BaseContract("") {
        _nftIdentities = INftIdentities(nftIdentities);
        _nftSchool = INftSchool(nftSchool);
        schoolYearEnd = block.timestamp;
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
        uint256 studentTokenId = _nftIdentities
            .getNftOfMemberWithRole(uint256(ROLE.STUDENT), msg.sender)
            .nftIdentity
            .tokenId;
        uint256 numberOfNftCompleteCourses = _studentOwnedCompleteCourseNfts[
            studentTokenId
        ].length;
        require(numberOfNftCompleteCourses > 0);

        NftCompleteCourse[] memory nfts = new NftCompleteCourse[](
            numberOfNftCompleteCourses
        );
        string[] memory nftURIs = new string[](numberOfNftCompleteCourses);

        for (uint256 idx = 0; idx <= numberOfNftCompleteCourses; ++idx) {
            (nfts[idx], nftURIs[idx]) = getNftCompleteCourse(
                _studentOwnedCompleteCourseNfts[studentTokenId][idx]
            );
        }

        return (nfts, nftURIs);
    }

    function getNftCompleteCourse(
        uint256 tokenId
    ) public view returns (NftCompleteCourse memory, string memory) {
        uint256 pos = _posOfTokenIdOfNftType[NFT_COMPLETE_COURSE][tokenId];
        require(pos > 0);

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

    function getNftGraduation(
        uint256 tokenId
    ) public view returns (NftGraduation memory, string memory) {
        uint256 pos = _posOfTokenIdOfNftType[NFT_GRADUATION][tokenId];
        require(pos > 0);

        return (_allNftGraduations[pos - 1], uri(tokenId));
    }

    function getNftScoreBoard(
        uint256 tokenId
    ) public view returns (NftScoreBoard memory, string memory) {
        uint256 pos = _posOfTokenIdOfNftType[NFT_SCORE_BOARD][tokenId];
        require(pos > 0);

        return (_allNftScoreBoards[pos - 1], uri(tokenId));
    }

    function registerClass(
        uint256 classId,
        string memory tokenURI
    ) public payable {
        require(msg.value == registeredPrice);
        _mintNftScoreBoard(classId, tokenURI);
    }

    function updateScores(
        uint256 scoreBoardId,
        uint256[] memory requireScore,
        uint256[] memory scores
    ) public canOperate(uint256(ROLE.TEACHER)) {
        // Require time to update
        uint256 pos = _posOfTokenIdOfNftType[NFT_SCORE_BOARD][scoreBoardId];
        uint256 nftIdentityTokenId = _nftIdentities
            .getNftOfMemberWithRole(uint256(ROLE.TEACHER), msg.sender)
            .nftIdentity
            .tokenId;
        require(pos > 0);
        require(_allNftScoreBoards[pos - 1].completeAt < block.timestamp);
        require(
            _allNftScoreBoards[pos - 1].teacherTokenId == nftIdentityTokenId
        );
        uint256 scoreLength = requireScore.length;

        for (uint256 idx = 0; idx < scoreLength; ++idx) {
            _allNftScoreBoards[pos - 1].scores[requireScore[idx]] = scores[idx];
        }
    }

    function exchangeCompleteCourse(
        uint256 scoreBoardId,
        string memory tokenURI
    ) public payable canOperate(uint256(ROLE.TEACHER)) {
        _mintNftCompleteCourse(scoreBoardId, tokenURI);
    }

    function exchangeGraduation(
        uint256[] memory nftCompleteCourseIds,
        string memory tokenURI
    ) public payable canOperate(uint256(ROLE.STUDENT)) {
        require(msg.value == graduationPrice);
        require(_studentOwnedNftGraduation[msg.sender] == 0);
        uint256 numOfCompleteCourses = nftCompleteCourseIds.length;
        KnowledgeBlock[] memory knowledgeBlocks = _nftSchool
            .getAllKnowledgeBlocks();
        uint256 numOfKnowledgeBlocks = knowledgeBlocks.length;
        uint256[] memory acquiredCreditsByKnowledgeBlockId = new uint256[](
            numOfKnowledgeBlocks
        );
        uint256 acquiredCredits;
        uint256 totalScore;

        for (uint256 idx = 0; idx < numOfCompleteCourses; ++idx) {
            if (_ownerOfNft[nftCompleteCourseIds[idx]] != msg.sender) {
                revert();
            }
            // _TODO: Check duplicate course
            (
                NftCompleteCourse memory nftCompleteCourse,

            ) = getNftCompleteCourse(nftCompleteCourseIds[idx]);
            acquiredCreditsByKnowledgeBlockId[
                nftCompleteCourse.knowledgeBlockId
            ] += nftCompleteCourse.credits;
            acquiredCredits += nftCompleteCourse.credits;
            totalScore += (nftCompleteCourse.avgScore *
                nftCompleteCourse.credits);
        }

        for (uint256 idx = 0; idx < numOfKnowledgeBlocks; ++idx) {
            if (
                acquiredCreditsByKnowledgeBlockId[knowledgeBlocks[idx].id] <
                knowledgeBlocks[idx].credits
            ) {
                // If not enough credits of this knowledge block, revert
                revert();
            }
        }

        uint256 avgScore = totalScore / acquiredCredits;
        if (avgScore <= _nftSchool.minimumGraduationScore()) {
            revert();
        }

        _mintNftGraduation(tokenURI);
    }

    function checkCompleteCourse(
        uint256 courseId,
        address studentAddr
    ) public view returns (bool) {
        uint256 studentTokenId = _nftIdentities
            .getNftOfMemberWithRole(uint256(ROLE.STUDENT), studentAddr)
            .nftIdentity
            .tokenId;
        return _completedCourseOfStudent[studentTokenId][courseId];
    }

    // (everyone)

    // onlyOwner
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
        string memory tokenURI
    ) private returns (uint256) {
        Class memory classInfo = _nftSchool.getClassById(classId);
        uint256 tokenId = _mintToken(
            _nftIdentities.ownerOf(classInfo.teacherTokenId),
            NFT_SCORE_BOARD,
            tokenURI
        );
        require(_posOfStudentInClass[classId][tokenId] == 0);
        _createNftScoreBoard(
            tokenId,
            classId,
            classInfo,
            _nftIdentities
                .getNftOfMemberWithRole(uint256(ROLE.STUDENT), msg.sender)
                .nftIdentity
                .tokenId
        );

        return tokenId;
    }

    function _createNftScoreBoard(
        uint256 tokenId,
        uint256 classId,
        Class memory classInfo,
        uint256 studentTokenId
    ) private {
        // TODO: position of student in class = 0
        require(_studentsOfClass[classId].length < classInfo.maxSize);
        NftScoreBoard memory nftScoreBoard = NftScoreBoard(
            tokenId,
            classId,
            classInfo.courseId,
            classInfo.knowledgeBlockId,
            classInfo.credits,
            classInfo.completeAt,
            studentTokenId,
            classInfo.teacherTokenId,
            classInfo.requiredScore,
            new uint256[](classInfo.requiredScore.length)
        );
        _allNftScoreBoards.push(nftScoreBoard);
        _studentsOfClass[classId].push(studentTokenId);
        _posOfTokenIdOfNftType[NFT_SCORE_BOARD][tokenId] = _allNftScoreBoards
            .length;
        _posOfStudentInClass[classId][studentTokenId] = _studentsOfClass[
            classId
        ].length;
    }

    function _mintNftCompleteCourse(
        uint256 scoreBoardId,
        string memory tokenURI
    ) private returns (uint256) {
        uint256 scoreBoardPos = _posOfTokenIdOfNftType[NFT_SCORE_BOARD][
            scoreBoardId
        ];
        NftScoreBoard memory nftScoreBoard = _allNftScoreBoards[
            scoreBoardId - 1
        ];
        uint256 teacherTokenId = _nftIdentities
            .getNftOfMemberWithRole(uint256(ROLE.TEACHER), msg.sender)
            .nftIdentity
            .tokenId;
        require(scoreBoardPos > 0);
        require(nftScoreBoard.teacherTokenId == teacherTokenId);
        require(nftScoreBoard.completeAt > block.timestamp);
        address studentAddr = _nftIdentities.ownerOf(
            nftScoreBoard.studentTokenId
        );
        uint256 tokenId = _mintToken(
            studentAddr,
            NFT_COMPLETE_COURSE,
            tokenURI
        );
        _burn(msg.sender, scoreBoardId, ONE_NFT);
        _createNftCompleteCourse(tokenId, nftScoreBoard);
        _studentOwnedCompleteCourseNfts[nftScoreBoard.studentTokenId].push(
            tokenId
        );
        _completedCourseOfStudent[nftScoreBoard.studentTokenId][
            nftScoreBoard.courseId
        ] = true;

        return tokenId;
    }

    function _createNftCompleteCourse(
        uint256 tokenId,
        NftScoreBoard memory nftScoreBoard
    ) private {
        // TODO: CHECK average satisfied minimum score
        NftCompleteCourse memory nftCompleteCourse = NftCompleteCourse(
            tokenId,
            nftScoreBoard.courseId,
            nftScoreBoard.knowledgeBlockId,
            nftScoreBoard.credits,
            nftScoreBoard.scores.average()
        );
        _allNftCompleteCourses.push(nftCompleteCourse);
        _posOfTokenIdOfNftType[NFT_COMPLETE_COURSE][
            tokenId
        ] = _allNftCompleteCourses.length;
    }

    function _mintNftGraduation(
        string memory tokenURI
    ) private returns (uint256) {
        uint256 tokenId = _mintToken(msg.sender, NFT_GRADUATION, tokenURI);
        _createNftGraduation(tokenId);
        _studentOwnedNftGraduation[msg.sender] = tokenId;

        return tokenId;
    }

    function _createNftGraduation(uint256 tokenId) private {
        NftGraduation memory nftGraduation = NftGraduation(tokenId);
        _allNftGraduations.push(nftGraduation);
        _posOfTokenIdOfNftType[NFT_GRADUATION][tokenId] = _allNftGraduations
            .length;
    }
}
