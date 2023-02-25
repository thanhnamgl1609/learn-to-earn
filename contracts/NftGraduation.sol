// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./School.sol";

contract NftGraduation is ERC721URIStorage, Ownable {
    struct NftItem {
    	uint256 studentId;
    	uint256 tokenId;
    }

	School private immutable _schoolContract;

    // // Nft Graduation
    NftItem[] private _allNftItem;
    mapping(string => NftItem) private _idToNftItem;

    // modifier onlyCourseContract {
    // 	require(msg.sender == _courseContract, 'access denied');
    // 	_;
    // }

    constructor(School schoolContract) ERC721("GraduationNft", "GNFT") {
        _schoolContract = schoolContract;
    }

    // function mintToken() public onlyCourseContract {

    // }
}
