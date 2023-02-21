// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NftSchool is ERC721URIStorage, Ownable {
	mapping (address => uint) balances;

	constructor() ERC721("NftSchool", "nftSchool") {}

	function createCourse(courseId, courseName) public onlyOwner {
		_safeMint(to, tokenId);
	}
}
