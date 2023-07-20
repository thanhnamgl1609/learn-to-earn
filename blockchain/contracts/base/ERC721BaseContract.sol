// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ERC721BaseContract is ERC721URIStorage {
    using Counters for Counters.Counter;

    address internal _owner;

    constructor(string memory uri, string memory symbol) ERC721(uri, symbol) {
        _owner = msg.sender;
    }

    Counters.Counter internal _currentMaxTokenId; // type => max token id

    mapping(uint256 => address) internal _ownerOfNft;

    function _mintToken(
        address tokenOwner,
        string memory tokenURI
    ) internal returns (uint256) {
        uint256 tokenId = _generateNewTokenId();
        _safeMint(tokenOwner, tokenId, msg.data);
        _setTokenURI(tokenId, tokenURI);

        return tokenId;
    }

    function _generateNewTokenId() internal returns (uint256) {
        _currentMaxTokenId.increment();
        uint256 tokenId = _currentMaxTokenId.current();

        return tokenId;
    }
}
