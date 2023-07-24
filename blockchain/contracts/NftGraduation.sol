// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;

import "./base/ERC721BaseContract.sol";
import "./interfaces/INftGraduation.sol";
import "./interfaces/INftIdentities.sol";
import "./interfaces/INftCompleteCourses.sol";
import "./interfaces/ISchool.sol";

contract NftGraduation is ERC721BaseContract, INftGraduation {
    ISchool private _school;
    INftIdentities private _nftIdentities;
    INftCompleteCourses private _nftCompleteCourses;

    bool private _isInitialize;

    NftGraduation[] private _allNftGraduations;
    mapping(uint256 => uint256) private _posOfNftGraduationTokenId;
    mapping(uint256 => uint256) private _tokenIdOfStudent;
    mapping(uint256 => bool) private _isExchangeable;

    event GrantNewNftGraduation(uint256 tokenId);

    modifier onlyOwner() {
        require(_owner == msg.sender, "C-ERR-08");
        _;
    }

    constructor(
        address nftIdentities,
        address school,
        address nftCompleteCourse
    ) ERC721BaseContract("NftGraduation", "NCR") {
        _isInitialize = false;
        _nftIdentities = INftIdentities(nftIdentities);
        _school = ISchool(school);
        _nftCompleteCourses = INftCompleteCourses(nftCompleteCourse);
    }

    function getNftGraduation(
        uint256 studentTokenId
    ) public view returns (NftGraduation memory) {
        uint256 tokenId = _tokenIdOfStudent[studentTokenId];
        require(tokenId > 0, "NG-ERR-00");
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
        require(tokenId > 0, "NG-ERR-00");
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

    function setExchangableNftGraduation(
        uint256 studentTokenId,
        bool isAllow
    ) public onlyOwner {
        NftIdentityResponse memory nftIdentityResponse = _nftIdentities
            .getNftOfTokenId(studentTokenId);
        require(!nftIdentityResponse.isExpired, "C-ERR-01");
        _isExchangeable[studentTokenId] = isAllow;
    }

    function checkExchangeable(
        uint256 studentTokenId
    ) public view returns (bool) {
        return _isExchangeable[studentTokenId];
    }

    function grantNftGraduation(
        uint256[] memory tokenIds,
        string memory tokenURI
    ) public {
        NftIdentityResponse memory nftIdentityResponse = _nftIdentities
            .getNftOfMemberWithRole(uint256(ROLE.STUDENT), msg.sender);
        require(!nftIdentityResponse.isExpired, "C-ERR-01");
        require(
            _isExchangeable[nftIdentityResponse.nftIdentity.tokenId],
            "NG-ERR-01"
        );
        _checkEnoughCredits(tokenIds, nftIdentityResponse.nftIdentity.tokenId);
        _nftCompleteCourses.regainNftCompleteCourses(
            nftIdentityResponse.nftIdentity.tokenId,
            tokenIds
        );

        uint256 tokenId = _mintToken(msg.sender, tokenURI);
        NftGraduation memory nftGraduation = NftGraduation(
            tokenId,
            nftIdentityResponse.nftIdentity.tokenId
        );
        _allNftGraduations.push(nftGraduation);
        _posOfNftGraduationTokenId[tokenId] = _allNftGraduations.length;
        _tokenIdOfStudent[nftIdentityResponse.nftIdentity.tokenId] = tokenId;

        emit GrantNewNftGraduation(tokenId);
    }

    function _checkEnoughCredits(
        uint256[] memory tokenIds,
        uint256 studentTokenId
    ) private view {
        uint256 count = tokenIds.length;
        KnowledgeBlock[] memory knowledgeBlocks = _school
            .getAllKnowledgeBlocks();
        uint256 knowledgeBlockCount = knowledgeBlocks.length;
        uint256[] memory totalCredits = new uint256[](knowledgeBlockCount + 1);

        for (uint256 idx; idx < count; ++idx) {
            (NftCompleteCourse memory nftCompleteCourse, ) = _nftCompleteCourses
                .getNftCompleteCourse(tokenIds[idx]);
            require(
                nftCompleteCourse.studentTokenId == studentTokenId,
                "NCR-ERR-04"
            );

            totalCredits[
                nftCompleteCourse.knowledgeBlockId
            ] += nftCompleteCourse.credits;
        }

        // validate number of credits
        for (uint256 idx; idx < knowledgeBlockCount; ++idx) {
            require(
                totalCredits[knowledgeBlocks[idx].id] >=
                    knowledgeBlocks[idx].credits,
                "NG-ERR-02"
            );
        }
    }
}
