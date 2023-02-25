pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./School.sol";

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
    // mapping(string => mapping(CourseType => uint256[])) private _completedCourse;
    mapping(string => bool) private _usedTokenURIs;
    
    constructor(School schoolContract) ERC721("CourseNFT", "CNFT") {
        _schoolContract = schoolContract;
    }

    function getNftCourse(uint256 tokenId) public view returns (NftItem memory) {
        uint256 tokenIndex = _idToNftIndex[tokenId];

        return _allNftItems[tokenIndex];
    }

    // function mintToken(
    //     string memory tokenURI,
    //     string memory studentId,
    //     uint256 courseId
    // ) public onlyTeacher(courseId) returns (uint256)
    // {
        // require(!_usedTokenURIs[tokenURI], "URI has already existed");
        // _tokenIds.increment();

        // uint256 newTokenId = _tokenIds.current();
        // _safeMint(msg.sender, newTokenId);
        // _setTokenURI(newTokenId, tokenURI);
        // _createNftItem(newTokenId, studentId, courseId);
        // _usedTokenURIs[tokenURI] = true;

        // return newTokenId;
    // }

    function _createNftItem(
        uint256 tokenId,
        string memory studentId,
        uint256 courseId
    ) private {
        // NftItem memory nftItem = NftItem(tokenId, studentId, courseId);
        // _allNftItems.push(nftItem);
        // _idToNftIndex[tokenId] = _allNftItems.length;
        // studentId => 
    }

    // function exchangeNftGradution(
    //     string memory studentId,
    //     uint256[] memory tokenIds
    // ) public allowGetNftGraduation {
    //     bool isAllBelongsToStudent = true;
    //     uint256 tokenIdLength = tokenIds.length;
    //     // mapping(uint256 => uint256) tokenIds;

    //     for (uint256 index; index < tokenIdLength; ++index) {
            
    //         isAllBelongsToStudent = false;
    //     }
        
    //     // _graduationContract.mintToken();
    // }
}