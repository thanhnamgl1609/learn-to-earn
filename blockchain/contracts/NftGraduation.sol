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
    uint256 private _requiredAvgScore = 5 ether;

    uint256[] private _requestGraduationQueue;
    mapping(uint256 => uint256) private _posOfRequestInQueue;
    mapping(uint256 => uint256[]) private _requestGraduationCompleteCourseIds;

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

    function requestGraduationCertificate(
        uint256[] memory nftCompleteCourseTokenIds
    ) public payable {
        NftIdentityResponse memory nftIdentityResponse = _nftIdentities
            .getNftOfMemberWithRole(uint256(ROLE.STUDENT), msg.sender);
        require(!nftIdentityResponse.isExpired);
        require(msg.value == requestGraduationCertificatePrice);
        require(_nftCertificates.checkApprovedForAll(msg.sender, _owner));
        uint256 count = nftCompleteCourseTokenIds.length;
        KnowledgeBlock[] memory knowledgeBlocks = _nftSchool
            .getAllKnowledgeBlocks();
        uint256 knowledgeBlockCount = knowledgeBlocks.length;
        uint256 totalScore;
        uint256 credits;
        uint256[] memory totalCredits = new uint256[](knowledgeBlockCount);

        for (uint256 idx; idx < count; ++idx) {
            (NftCompleteCourse memory nftCompleteCourse, ) = _nftCertificates
                .getNftCompleteCourse(nftCompleteCourseTokenIds[idx]);
            require(nftCompleteCourse.status == 1, "not complete");

            totalCredits[
                nftCompleteCourse.knowledgeBlockId
            ] += nftCompleteCourse.credits;
            credits += nftCompleteCourse.credits;
            totalScore += (nftCompleteCourse.avgScore *
                nftCompleteCourse.avgScore);
        }

        // validate number of credits
        for (uint256 idx; idx < knowledgeBlockCount; ++idx) {
            require(
                totalCredits[knowledgeBlockCount] >=
                    knowledgeBlocks[idx].credits,
                "not enough credits"
            );
        }

        uint256 avgScore = totalScore / credits;
        require(avgScore >= _requiredAvgScore);

        _requestGraduationCompleteCourseIds[
            nftIdentityResponse.nftIdentity.tokenId
        ] = nftCompleteCourseTokenIds;
        _requestGraduationQueue.push(nftIdentityResponse.nftIdentity.tokenId);
        _posOfRequestInQueue[
            nftIdentityResponse.nftIdentity.tokenId
        ] = _requestGraduationQueue.length;
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
