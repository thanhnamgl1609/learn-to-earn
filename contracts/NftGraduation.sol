// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NftGraduation is ERC721URIStorage, Ownable {
	struct NftItem {
		uint256 studentId;
		uint256 tokenId;
	}
 
	address private immutable _courseContract;
 
	// Nft Graduation
	NftItem[] private _allNftItem;
	mapping(string => NftItem) private _idToNftItem;


	modifier onlyCourseContract {
		require(msg.sender === _courseContract, 'access denied');
	}

	constructor() ERC721("GraduationNft", "GNFT") {
		_courseContract = msg.sender;
	}

	function mintToken() public onlyCourseContract {

	}	
}
