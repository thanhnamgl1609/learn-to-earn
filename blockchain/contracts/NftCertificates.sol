// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;

import "./ERC1155BaseContract.sol";
import "./interfaces/INftClassRegistration.sol";
import "./interfaces/INftSchool.sol";
import "./interfaces/INftCertificates.sol";
import "./interfaces/INftGraduation.sol";
import "./interfaces/INftIdentities.sol";
import "./utils/ArrayMath.sol";

contract NftCertificates is ERC1155BaseContract, INftCertificates {
    using Counters for Counters.Counter;
    using ArrayMath for uint256[];
    uint256 constant NFT_COMPLETE_COURSE = 1;
    uint256 constant NFT_GRADUATION = 2;

    uint256 public graduationPrice = 1 ether;

    string[] private courseURIs;

    bool private _isInitialize;

    INftIdentities private immutable _nftIdentities;
    INftSchool private immutable _nftSchool;
    INftClassRegistration private immutable _nftClassRegistration;
    INftGraduation private _nftGraduation;

    uint256 public registeredStartAt;
    uint256 public registeredEndAt;
    uint256 public yearId;

    NftCompleteCourse[] private _allNftCompleteCourses;
    mapping(uint256 => mapping(uint256 => uint256)) _posOfTokenIdOfNftType;

    mapping(uint256 => uint256[]) _studentsOfClass;
    mapping(uint256 => mapping(uint256 => uint256)) _posOfStudentInClass;
    mapping(uint256 => uint256[]) private _studentOwnedCompleteCourseNfts;
    mapping(uint256 => mapping(uint256 => uint256))
        private _posOfOwnedCompleteCourseNft;

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

    function initialize(address nftGraduation) public onlyOwner {
        require(!_isInitialize);
        _isInitialize = true;
        _nftGraduation = INftGraduation(nftGraduation);
    }

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
        uint256 status,
        uint256 classId,
        string memory tokenURI
    ) public {
        require(status == 0 || status == 1);
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
            avgScore,
            status
        );
        _studentOwnedCompleteCourseNfts[studentTokenId].push(tokenId);
        _posOfOwnedCompleteCourseNft[studentTokenId][
            tokenId
        ] = _studentOwnedCompleteCourseNfts[studentTokenId].length;
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
        uint256 score,
        uint256 status
    ) private {
        NftCompleteCourse memory nftCompleteCourse = NftCompleteCourse(
            tokenId,
            courseId,
            knowledgeBlockId,
            credits,
            score,
            status
        );
        _allNftCompleteCourses.push(nftCompleteCourse);
        _posOfTokenIdOfNftType[NFT_COMPLETE_COURSE][
            tokenId
        ] = _allNftCompleteCourses.length;
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

    function checkApprovedForAll(
        address sender,
        address owner
    ) public view returns (bool) {
        return isApprovedForAll(sender, owner);
    }

    function regainNftCompleteCourses(uint256 studentTokenId) public onlyOwner {
        address studentAddr = _nftIdentities.ownerOf(studentTokenId);
        require(
            checkApprovedForAll(studentAddr, _owner),
            "not approved by student"
        );
        uint256[] memory tokenIds = _nftGraduation
            .getNftCompleteCourseForRequestGraduation(studentTokenId);
        uint256 count = tokenIds.length;
        uint256[] memory amounts = new uint256[](count);

        for (uint256 idx; idx < count; ++idx) {
            amounts[idx] = 1;
        }

        _burnBatch(studentAddr, tokenIds, amounts);
        _removeFromAllNftCompleteCourses(studentTokenId, tokenIds);
    }

    function _removeFromAllNftCompleteCourses(
        uint256 studentTokenId,
        uint256[] memory tokenIds
    ) public {
        uint256 count = tokenIds.length;

        for (uint256 idx; idx < count; ++idx) {
            uint256 posOfNftCompleteCourse = _posOfTokenIdOfNftType[
                NFT_COMPLETE_COURSE
            ][tokenIds[idx]];
            uint256 posOfLastNftCompleteCourse = _allNftCompleteCourses.length;

            NftCompleteCourse
                memory deletedNftCompleteCourse = _allNftCompleteCourses[
                    posOfNftCompleteCourse - 1
                ];
            delete _completedCoursesOfStudent[studentTokenId][
                deletedNftCompleteCourse.courseId
            ];

            uint256 posOfOwnedCompleteCourse = _posOfOwnedCompleteCourseNft[
                studentTokenId
            ][tokenIds[idx]];
            uint256 posOfLastOwnedCompleteCourse = _studentOwnedCompleteCourseNfts[
                    studentTokenId
                ].length;
            if (posOfOwnedCompleteCourse < posOfLastOwnedCompleteCourse) {
                uint256 lastTokenId = _studentOwnedCompleteCourseNfts[
                    studentTokenId
                ][posOfLastOwnedCompleteCourse - 1];
                _studentOwnedCompleteCourseNfts[studentTokenId][
                    posOfOwnedCompleteCourse - 1
                ] = lastTokenId;
                _posOfOwnedCompleteCourseNft[studentTokenId][
                    lastTokenId
                ] = posOfOwnedCompleteCourse;
            }
            _studentOwnedCompleteCourseNfts[studentTokenId].pop();

            if (posOfNftCompleteCourse < posOfLastNftCompleteCourse) {
                NftCompleteCourse
                    memory nftCompleteCourse = _allNftCompleteCourses[
                        posOfLastNftCompleteCourse - 1
                    ];
                _allNftCompleteCourses[
                    posOfNftCompleteCourse - 1
                ] = nftCompleteCourse;
                _posOfTokenIdOfNftType[NFT_COMPLETE_COURSE][
                    nftCompleteCourse.tokenId
                ] = posOfNftCompleteCourse;
            }
            delete _posOfTokenIdOfNftType[NFT_COMPLETE_COURSE][tokenIds[idx]];
        }
    }

    function checkAllNftCompleteCoursesRegained(
        uint256[] memory tokenIds
    ) public view returns (bool) {
        uint256 count = tokenIds.length;

        for (uint256 idx; idx < count; ++idx) {
            if (
                _posOfTokenIdOfNftType[NFT_COMPLETE_COURSE][tokenIds[idx]] > 0
            ) {
                return false;
            }
        }

        return true;
    }
}
