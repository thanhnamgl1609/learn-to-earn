// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./School.sol";
import "./Type.sol";

contract NftCourse is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    struct NftItem {
        uint256 tokenId;
        string studentId;
        uint256 courseId;
    }

	School private immutable _schoolContract;

    Counters.Counter private _tokenIds;
    NftItem[] private _allNftItems;
    mapping(uint256 => uint256) private _idToNftIndex; // tokenId =>NftItem 
    mapping(string => mapping(uint256 => bool)) private _completedCourse;
    mapping(string => uint256[]) private _nftCoursesOfStudent;
    // mapping(string => mapping(CourseType => uint256[])) private _completedCourse;
    mapping(string => bool) private _usedTokenURIs;

    mapping(uint256 => Type.Course) private _idToCourse;
    mapping(string => mapping(uint256 => uint256)) private _creditsOfCourse;
    mapping(string => mapping(string => bool)) private _checkedCourse;
    
    constructor(School schoolContract) ERC721("CourseNFT", "CNFT") {
        _schoolContract = schoolContract;
    }

    modifier onlyTeacher(uint256 courseId) {
        Type.Course memory course = _getCourse(courseId);
        require(course.teacherAddress == msg.sender, "access denied");
        _;
    }

    function getNftCourse(uint256 tokenId) public view returns (NftItem memory) {
        uint256 tokenIndex = _idToNftIndex[tokenId];
        if (tokenIndex == 0) { revert("Not exists nft course"); }

        return _allNftItems[tokenIndex - 1];
    }

    function getNftCourses(string memory studentId) public view returns (NftItem[] memory) {
        uint256[] memory tokenIds = _nftCoursesOfStudent[studentId];
        uint256 nftCount = tokenIds.length;
        NftItem[] memory nftItems = new NftItem[](nftCount);

        for (uint256 index = 0; index < nftCount; ++index) {
            nftItems[index] = getNftCourse(tokenIds[index]);
        }

        return nftItems;
    }

    function getNumberOfNftCourses(string memory studentId) public view returns (uint256) {
        uint256[] memory tokenIds = _nftCoursesOfStudent[studentId];
        uint256 nftCount = tokenIds.length;

        return nftCount;
    }

    function mintToken(
        string memory tokenURI,
        string memory studentId,
        uint256 courseId
        // score?
    ) public onlyTeacher(courseId) returns (uint256)
    {
        require(!_usedTokenURIs[tokenURI], "URI has already existed");
        require(!_completedCourse[studentId][courseId], "Student has been granted");
        require(!_isOutOfNft(courseId), "Out of nft");
        _tokenIds.increment();
        _idToCourse[courseId].nftCounts -= 1;

        uint256 newTokenId = _tokenIds.current();
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        _createNftItem(newTokenId, studentId, courseId);
        _usedTokenURIs[tokenURI] = true;

        return newTokenId;
    }

    function validateNftGradution(
        string memory studentId,
        uint256[] memory tokenIds
    ) public returns (bool) {
        uint256 tokenIdLength = tokenIds.length;
        Type.Requirement[] memory requirements = _schoolContract.getAllRequirements();
        uint256 requirementLength = requirements.length;

        for (uint256 index = 0; index < requirementLength; ++index) {
            Type.Requirement memory requirement = requirements[index];
            _creditsOfCourse[studentId][requirement.courseGroupId] = 0;
        }

        for (uint256 index = 0; index < tokenIdLength; ++index) {
            NftItem memory nftItem = getNftCourse(tokenIds[index]);
            Type.Course memory course = _getCourse(nftItem.courseId);
            if (_checkedCourse[studentId][course.metadata]) {
                revert("Duplicate course");
            }
            _creditsOfCourse[studentId][course.courseGroup] += course.credits;
            _checkedCourse[studentId][course.metadata] = true;
        }

        for (uint256 index = 0; index < requirementLength; ++index) {
            Type.Requirement memory requirement = requirements[index];
            if (_creditsOfCourse[studentId][requirement.courseGroupId] < requirement.credits) {
                return false;
            }
        }

        return true;
    }

    function _isOutOfNft(uint256 courseId) private view returns (bool)
    {
        return _idToCourse[courseId].nftCounts == 0;
    }

    function _createNftItem(
        uint256 tokenId,
        string memory studentId,
        uint256 courseId
    ) private {
        NftItem memory nftItem = NftItem(tokenId, studentId, courseId);
        _allNftItems.push(nftItem);
        _idToNftIndex[tokenId] = _allNftItems.length;
        _nftCoursesOfStudent[studentId].push(tokenId);
        _completedCourse[studentId][courseId] = true;
    }

    function _getCourse(uint256 courseId) private returns (Type.Course memory) {
        if (_idToCourse[courseId].id == 0) {
            _idToCourse[courseId] = _schoolContract.getCourse(courseId);
        }

        return _idToCourse[courseId];
    }
}