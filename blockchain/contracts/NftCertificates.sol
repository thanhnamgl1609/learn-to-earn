// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;

import "./ERC1155BaseContract.sol";
import "./interfaces/INftClassRegistration.sol";
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

    uint256 public graduationPrice = 1 ether;

    string[] private courseURIs;

    INftIdentities private immutable _nftIdentities;
    INftSchool private immutable _nftSchool;
    INftClassRegistration private immutable _nftClassRegistration;

    uint256 public registeredStartAt;
    uint256 public registeredEndAt;
    uint256 public yearId;

    NftCompleteCourse[] private _allNftCompleteCourses;
    NftGraduation[] private _allNftGraduations;
    mapping(uint256 => mapping(uint256 => uint256)) _posOfTokenIdOfNftType;

    mapping(uint256 => uint256[]) _studentsOfClass;
    mapping(uint256 => mapping(uint256 => uint256)) _posOfStudentInClass;
    mapping(uint256 => uint256[]) private _studentOwnedCompleteCourseNfts;

    mapping(uint256 => uint256[]) _nftCompleteCourseQueue;
    mapping(uint256 => mapping(uint256 => uint256)) _posOfStudentInQueue;

    mapping(uint256 => mapping(uint256 => bool))
        private _completedCoursesOfStudent;
    mapping(address => uint256) private _studentOwnedNftGraduation;

    event NewCompleteCourseCreated(uint256 tokenId);

    modifier onlyOwner() {
        require(_owner == msg.sender);
        _;
    }

    modifier onlyNftSchoolContract() {
        require(msg.sender == address(_nftSchool));
        _;
    }

    modifier canOperate(uint256 role) {
        require(_nftIdentities.isAbleToOperate(msg.sender, role));
        _;
    }

    constructor(
        address nftIdentities,
        address nftSchool,
        address nftClassRegistration
    ) ERC1155BaseContract("") {
        _nftIdentities = INftIdentities(nftIdentities);
        _nftSchool = INftSchool(nftSchool);
        _nftClassRegistration = INftClassRegistration(nftClassRegistration);
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

    // Nft Complete Course Section: Start
    // depositNftClassRegistration group by classId
    // getDepositedNftClassRegistration
    // updateScoreAndGrantCourseComplete -> burnNftClassRegistration

    // deposit all courseCompletes and documents to validate
    // validate (off-chain) -> grantNftGraduation (1 groups or 1 person?)
    // if 1 group, who is enough permission to create this group?

    function checkInQueue(
        uint256 classId,
        uint256 studentTokenId
    ) public view returns (bool) {
        return _posOfStudentInQueue[classId][studentTokenId] > 0;
    }

    function getNftCompleteCourseCreationQueueByClassId(
        uint256 classId
    ) public view returns (uint256[] memory) {
        return _nftCompleteCourseQueue[classId];
    }

    function addToNftCompleteCourseCreationQueue(
        uint256 studentTokenId,
        uint256 tokenId
    ) public {
        NftClassRegistration memory nftClassRegistration = _nftClassRegistration
            .getNftClassRegistration(tokenId);
        Class memory class = _nftSchool.getClassById(
            nftClassRegistration.classId
        );
        NftIdentityResponse memory nftIdentityResponse = _nftIdentities
            .getNftOfMemberWithRole(uint256(ROLE.TEACHER), msg.sender);
        require(!nftIdentityResponse.isExpired, "expired");
        require(
            class.teacherTokenId == nftIdentityResponse.nftIdentity.tokenId,
            "not teacher"
        );
        require(
            _posOfStudentInQueue[nftClassRegistration.classId][
                studentTokenId
            ] == 0,
            "current in queue"
        );
        _nftCompleteCourseQueue[nftClassRegistration.classId].push(
            studentTokenId
        );
        _posOfStudentInQueue[nftClassRegistration.classId][
            studentTokenId
        ] = _nftCompleteCourseQueue[nftClassRegistration.classId].length;
    }

    function grantNftCompleteCourse(
        uint256 studentTokenId,
        uint256 avgScore,
        uint256 classId,
        string memory tokenURI
    ) public {
        require(
            _nftClassRegistration.checkNftClassRegistrationRegained(
                studentTokenId,
                classId
            ),
            "not regained"
        );
        require(checkInQueue(classId, studentTokenId), "not in queue");
        Class memory class = _nftSchool.getClassById(classId);
        NftIdentityResponse memory nftIdentityResponse = _nftIdentities
            .getNftOfMemberWithRole(uint256(ROLE.TEACHER), msg.sender);
        address studentAddr = _nftIdentities.ownerOf(studentTokenId);
        require(
            class.teacherTokenId == nftIdentityResponse.nftIdentity.tokenId,
            "not teacher"
        );
        require(!nftIdentityResponse.isExpired, "expired");
        uint256 tokenId = _mintToken(
            studentAddr,
            NFT_COMPLETE_COURSE,
            tokenURI
        );
        _createNftCompleteCourse(
            tokenId,
            class.courseId,
            class.knowledgeBlockId,
            class.credits,
            avgScore
        );
        _studentOwnedCompleteCourseNfts[studentTokenId].push(tokenId);
        _completedCoursesOfStudent[studentTokenId][class.courseId] = true;
        uint256 pos = _posOfStudentInQueue[classId][studentTokenId];
        uint256 length = _nftCompleteCourseQueue[classId].length;
        if (pos < length) {
            _nftCompleteCourseQueue[classId][pos - 1] = _nftCompleteCourseQueue[
                classId
            ][length - 1];
        }
        _nftCompleteCourseQueue[classId].pop();
        delete _posOfStudentInQueue[classId][studentTokenId];
        emit NewCompleteCourseCreated(tokenId);
    }

    function _createNftCompleteCourse(
        uint256 tokenId,
        uint256 courseId,
        uint256 knowledgeBlockId,
        uint256 credits,
        uint256 score
    ) private {
        NftCompleteCourse memory nftCompleteCourse = NftCompleteCourse(
            tokenId,
            courseId,
            knowledgeBlockId,
            credits,
            score
        );
        _allNftCompleteCourses.push(nftCompleteCourse);
        _posOfTokenIdOfNftType[NFT_COMPLETE_COURSE][
            tokenId
        ] = _allNftCompleteCourses.length;
    }

    // Nft Complete Course Section: End

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
            if (
                _ownerOfNft[NFT_COMPLETE_COURSE][nftCompleteCourseIds[idx]] !=
                msg.sender
            ) {
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
        return _completedCoursesOfStudent[studentTokenId][courseId];
    }

    // (everyone)

    // onlyOwner
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
