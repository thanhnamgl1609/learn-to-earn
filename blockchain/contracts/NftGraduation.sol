// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;

import "./ERC721BaseContract.sol";
import "./interfaces/INftGraduation.sol";
import "./interfaces/INftIdentities.sol";
import "./interfaces/INftCertificates.sol";
import "./interfaces/INftSchool.sol";

contract NftGraduation is ERC721BaseContract, INftGraduation {
    uint256 public requestGraduationCertificatePrice = 0.5 ether;

    INftSchool private _nftSchool;
    INftIdentities private _nftIdentities;
    INftCertificates private _nftCertificates;

    bool private _isInitialize;

    uint256[] private _requestGraduationQueue;
    mapping(uint256 => uint256) private _posOfRequestInQueue;
    mapping(uint256 => uint256[]) private _requestGraduationCompleteCourseIds;
    mapping(uint256 => string) private _requestGraduationURI;
    mapping(uint256 => uint256) private _posOfRequestGraduationCompleteCourseId;
    mapping(uint256 => mapping(uint256 => uint256))
        private _posOfCompleteCourseInRequest;
    mapping(uint256 => mapping(uint256 => uint256))
        private totalAcquiredCreditsOfStudent;

    NftGraduation[] private _allNftGraduations;
    mapping(uint256 => uint256) private _posOfNftGraduationTokenId;
    mapping(uint256 => uint256) private _tokenIdOfStudent;

    event GrantNewNftGraduation(uint256 tokenId);

    modifier onlyOwner() {
        require(_owner == msg.sender);
        _;
    }

    constructor(
        address nftIdentities,
        address nftSchool,
        address nftCertificates
    ) ERC721BaseContract("NftGraduation", "NCR") {
        _isInitialize = false;
        _nftIdentities = INftIdentities(nftIdentities);
        _nftSchool = INftSchool(nftSchool);
        _nftCertificates = INftCertificates(nftCertificates);
    }

    function getNftCompleteCourseForRequestGraduation(
        uint256 studentTokenId
    ) public view returns (uint256[] memory) {
        return _requestGraduationCompleteCourseIds[studentTokenId];
    }

    function getAllRequestGraduationStudents()
        public
        view
        onlyOwner
        returns (uint256[] memory)
    {
        return _requestGraduationQueue;
    }

    function getRequestGraduationDetail(
        uint256 studentTokenId
    ) public view returns (uint256[] memory, string memory) {
        return (
            _requestGraduationCompleteCourseIds[studentTokenId],
            _requestGraduationURI[studentTokenId]
        );
    }

    function checkRequestInQueue(
        uint256 studentTokenId
    ) public view returns (bool) {
        return _posOfRequestInQueue[studentTokenId] > 0;
    }

    function getNftGraduation(
        uint256 studentTokenId
    ) public view returns (NftGraduation memory) {
        uint256 tokenId = _tokenIdOfStudent[studentTokenId];
        require(tokenId > 0);
        uint256 pos = _posOfNftGraduationTokenId[tokenId];

        return _allNftGraduations[pos - 1];
    }

    function getOwnedNftGraduation()
        public
        view
        returns (NftGraduation memory)
    {
        uint256 studentTokenId = _nftIdentities.getNftTokenIdOfRole(
            msg.sender,
            uint256(ROLE.STUDENT)
        );
        uint256 tokenId = _tokenIdOfStudent[studentTokenId];
        require(tokenId > 0);
        uint256 pos = _posOfNftGraduationTokenId[tokenId];

        return _allNftGraduations[pos - 1];
    }

    function getAllGraduations()
        public
        view
        onlyOwner
        returns (NftGraduation[] memory)
    {
        return _allNftGraduations;
    }

    function requestGraduationCertificate(
        uint256[] memory nftCompleteCourseTokenIds,
        string memory uri
    ) public payable {
        NftIdentityResponse memory nftIdentityResponse = _nftIdentities
            .getNftOfMemberWithRole(uint256(ROLE.STUDENT), msg.sender);
        require(!nftIdentityResponse.isExpired, "identity expired");
        require(msg.value == requestGraduationCertificatePrice);
        require(
            _nftCertificates.checkApprovedForAll(msg.sender, _owner),
            "not approve"
        );
        require(
            _posOfRequestInQueue[nftIdentityResponse.nftIdentity.tokenId] == 0,
            "current in queue"
        );
        uint256 count = nftCompleteCourseTokenIds.length;
        KnowledgeBlock[] memory knowledgeBlocks = _nftSchool
            .getAllKnowledgeBlocks();
        uint256 knowledgeBlockCount = knowledgeBlocks.length;
        uint256 studentTokenId = nftIdentityResponse.nftIdentity.tokenId;

        for (uint256 idx; idx < count; ++idx) {
            (NftCompleteCourse memory nftCompleteCourse, ) = _nftCertificates
                .getNftCompleteCourse(nftCompleteCourseTokenIds[idx]);
            require(
                nftCompleteCourse.studentTokenId == studentTokenId,
                "Not your Nft Complete Course"
            );
            require(
                _posOfCompleteCourseInRequest[studentTokenId][
                    nftCompleteCourse.courseId
                ] == 0,
                "Duplicate course"
            );

            totalAcquiredCreditsOfStudent[studentTokenId][
                nftCompleteCourse.knowledgeBlockId
            ] += nftCompleteCourse.credits;
            _requestGraduationCompleteCourseIds[studentTokenId].push(
                nftCompleteCourseTokenIds[idx]
            );
            _posOfCompleteCourseInRequest[studentTokenId][
                nftCompleteCourse.courseId
            ] = _requestGraduationCompleteCourseIds[studentTokenId].length;
        }

        // validate number of credits
        for (uint256 idx; idx < knowledgeBlockCount; ++idx) {
            require(
                totalAcquiredCreditsOfStudent[studentTokenId][
                    knowledgeBlocks[idx].id
                ] >= knowledgeBlocks[idx].credits,
                "not enough credits"
            );
        }

        _requestGraduationQueue.push(studentTokenId);
        _requestGraduationURI[studentTokenId] = uri;
        _posOfRequestInQueue[studentTokenId] = _requestGraduationQueue.length;
    }

    function grantNftGraduation(
        uint256 studentTokenId,
        string memory tokenURI
    ) public onlyOwner {
        require(
            _posOfRequestInQueue[studentTokenId] > 0,
            "Student didn't request graduation certificate"
        );
        uint256[]
            memory nftCompleteCourseTokenIds = _requestGraduationCompleteCourseIds[
                studentTokenId
            ];
        require(
            _nftCertificates.checkAllNftCompleteCoursesRegained(
                nftCompleteCourseTokenIds
            ),
            "Not regained"
        );
        uint256 tokenId = _mintToken(msg.sender, tokenURI);
        NftGraduation memory nftGraduation = NftGraduation(
            tokenId,
            studentTokenId
        );
        _allNftGraduations.push(nftGraduation);
        _posOfNftGraduationTokenId[tokenId] = _allNftGraduations.length;
        _tokenIdOfStudent[studentTokenId] = tokenId;

        delete _requestGraduationCompleteCourseIds[studentTokenId];
        delete _requestGraduationURI[studentTokenId];
        uint256 pos = _posOfRequestInQueue[studentTokenId];
        uint256 lastRequestQueuePos = _requestGraduationQueue.length;
        if (pos < lastRequestQueuePos) {
            _requestGraduationQueue[pos - 1] = _requestGraduationQueue[
                lastRequestQueuePos - 1
            ];
            _posOfRequestInQueue[
                _requestGraduationQueue[lastRequestQueuePos - 1]
            ] = pos;
        }
        _requestGraduationQueue.pop();
        delete _posOfRequestInQueue[studentTokenId];

        emit GrantNewNftGraduation(tokenId);
    }
}
