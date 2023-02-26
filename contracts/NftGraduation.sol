// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./NftCourse.sol";

contract NftGraduation is ERC721, Ownable {
	using Counters for Counters.Counter;
    struct NftItem {
    	string studentId;
    	uint256 tokenId;
    }

	NftCourse private immutable _courseContract;

    // // Nft Graduation
    Counters.Counter private _tokenIds;
    NftItem[] private _allNftItems;
    mapping(uint256 => uint256) private _idToNftIndex; // tokenId =>NftItem 
    mapping(string => uint256) private _studentIdToNftIndex; // tokenId =>NftItem 

    modifier onlyCourseContract {
    	require(msg.sender == address(_courseContract), 'access denied');
    	_;
    }

    constructor(NftCourse courseContract) ERC721("GraduationNft", "GNFT") {
        _courseContract = courseContract;
    }

    function getAllNftGraduations() public view returns (NftItem[] memory) {
        return _allNftItems;
    }

    function getNftGraduation(string memory studentId) public view returns (NftItem memory){
        uint256 nftIndex = _studentIdToNftIndex[studentId];
        if (nftIndex == 0) {
            revert("Not exists");
        }

        return _allNftItems[nftIndex - 1];
    }

    function exchangeNftGraduation(
        string memory studentId,
		uint256[] memory tokenIds
    ) public returns (NftItem memory) {
        require(_courseContract.validateNftGradution(studentId, tokenIds), "Not credits enough");
		return mintToken(studentId);
    }
    
    function mintToken(string memory studentId) private returns (NftItem memory) {
		require(_studentIdToNftIndex[studentId] == 0, "Student has been granted nft graduation");
        _tokenIds.increment();

        uint256 newTokenId = _tokenIds.current();
        _safeMint(msg.sender, newTokenId);
        return _createNftItem(newTokenId, studentId);
    }

	function _createNftItem(uint256 tokenId, string memory studentId) private returns (NftItem memory) {
        NftItem memory nftItem = NftItem(studentId, tokenId);
        _allNftItems.push(nftItem);
        _idToNftIndex[tokenId] = _allNftItems.length;
		_studentIdToNftIndex[studentId] = _allNftItems.length;

		return nftItem;
	}
}
