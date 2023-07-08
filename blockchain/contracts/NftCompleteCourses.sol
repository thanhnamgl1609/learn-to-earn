// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;

import "./base/ERC1155BaseContract.sol";
import "./interfaces/INftClassRegistration.sol";
import "./interfaces/ISchool.sol";
import "./interfaces/INftCompleteCourses.sol";
import "./interfaces/INftGraduation.sol";
import "./interfaces/INftIdentities.sol";
import "./utils/ArrayMath.sol";

contract NftCompleteCourses is ERC1155BaseContract, INftCompleteCourses {
    using Counters for Counters.Counter;
    using ArrayMath for uint256[];
    uint256 constant NFT_COMPLETE_COURSE = 1;

    uint256 public graduationPrice = 1 ether;

    bool private _isInitialize;

    INftIdentities private immutable _nftIdentities;
    ISchool private immutable _school;
    INftClassRegistration private immutable _nftClassRegistration;
    INftGraduation private _nftGraduation;

    NftCompleteCourse[] private _allNftCompleteCourses;
    mapping(uint256 => mapping(uint256 => uint256)) _posOfTokenIdOfNftType;

    mapping(uint256 => uint256[]) _studentsOfClass;
    mapping(uint256 => mapping(uint256 => uint256)) _posOfStudentInClass;
    mapping(uint256 => uint256[]) private _studentOwnedCompleteCourseNfts;
    mapping(uint256 => mapping(uint256 => uint256))
        private _posOfOwnedCompleteCourseNft;

    mapping(uint256 => mapping(uint256 => bool))
        private _completedCoursesOfStudent;

    event NewCompleteCourseCreated(uint256 tokenId);

    modifier onlyOwner() {
        require(_owner == msg.sender);
        _;
    }

    modifier onlySchoolContract() {
        require(msg.sender == address(_school));
        _;
    }

    modifier canOperate(uint256 role) {
        require(_nftIdentities.isAbleToOperate(msg.sender, role));
        _;
    }

    constructor(
        address nftIdentities,
        address school,
        address nftClassRegistration
    ) ERC1155BaseContract("") {
        _nftIdentities = INftIdentities(nftIdentities);
        _school = ISchool(school);
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

        for (uint256 idx = 0; idx < numberOfNftCompleteCourses; ++idx) {
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
        require(pos > 0, "[NFT Complete Course] Not exist");

        return (_allNftCompleteCourses[pos - 1], uri(tokenId));
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

    function checkApproveOwnerForAllNft() public view returns (bool) {
        return isApprovedForAll(msg.sender, _owner);
    }

    function checkApprovedForAll(
        address sender,
        address owner
    ) public view returns (bool) {
        return isApprovedForAll(sender, owner);
    }

    function approveOwnerForAllNft(bool approved) public {
        setApprovalForAll(_owner, approved);
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

    function exchangeNftCompleteCourse(
        uint256 nftClassRegistrationTokenId,
        string memory tokenURI
    ) public {
        (
            Class memory class,
            NftIdentity memory nftIdentity
        ) = _nftClassRegistration.regainV2(
                msg.sender,
                nftClassRegistrationTokenId
            );

        uint256 studentTokenId = nftIdentity.tokenId;
        uint256 tokenId = _mintToken(msg.sender, NFT_COMPLETE_COURSE, tokenURI);
        _createNftCompleteCourse(
            tokenId,
            studentTokenId,
            class.courseId,
            class.knowledgeBlockId,
            class.credits
        );
        _studentOwnedCompleteCourseNfts[studentTokenId].push(tokenId);
        _posOfOwnedCompleteCourseNft[studentTokenId][
            tokenId
        ] = _studentOwnedCompleteCourseNfts[studentTokenId].length;
        _completedCoursesOfStudent[studentTokenId][class.courseId] = true;
        emit NewCompleteCourseCreated(tokenId);
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

    function _createNftCompleteCourse(
        uint256 tokenId,
        uint256 studentTokenId,
        uint256 courseId,
        uint256 knowledgeBlockId,
        uint256 credits
    ) private {
        NftCompleteCourse memory nftCompleteCourse = NftCompleteCourse(
            tokenId,
            studentTokenId,
            courseId,
            knowledgeBlockId,
            credits
        );
        _allNftCompleteCourses.push(nftCompleteCourse);
        _posOfTokenIdOfNftType[NFT_COMPLETE_COURSE][
            tokenId
        ] = _allNftCompleteCourses.length;
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

            // Remove from owned nft complete courses list
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

            // Remove from all nft complete courses
            if (posOfNftCompleteCourse < posOfLastNftCompleteCourse) {
                NftCompleteCourse
                    memory lastNftCompleteCourse = _allNftCompleteCourses[
                        posOfLastNftCompleteCourse - 1
                    ];
                _allNftCompleteCourses[
                    posOfNftCompleteCourse - 1
                ] = lastNftCompleteCourse;
                _posOfTokenIdOfNftType[NFT_COMPLETE_COURSE][
                    lastNftCompleteCourse.tokenId
                ] = posOfNftCompleteCourse;
            }
            delete _posOfTokenIdOfNftType[NFT_COMPLETE_COURSE][tokenIds[idx]];
            _allNftCompleteCourses.pop();
        }
    }
}
