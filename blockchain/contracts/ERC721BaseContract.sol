
// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ERC721BaseContract is ERC1155URIStorage {
    using Counters for Counters.Counter;

    address internal _owner;

    constructor (string memory uri) ERC1155(uri) {
        _owner = msg.sender;
    }

    Counters.Counter internal _currentMaxTokenId; // type => max token id

    mapping(uint256 => address) internal _ownerOfNft;

    function _mintToken(address tokenOwner, string memory tokenURI) internal returns (uint256) { 
        uint256 tokenId = _generateNewTokenId(nftType);
        _mint(tokenOwner, tokenId, msg.data); // fix it
        _setURI(tokenId, tokenURI);

        return tokenId;
    }

    function _generateNewTokenId() internal returns (uint256) {
        _currentMaxTokenId.increment();
        uint256 tokenId = _currentMaxTokenId.current();

        return tokenId;
    }

    function _beforeTokenTransfer( // fix it
        address operator,
        address from,
        address to,
        uint256 memory id,
        bytes memory data
    ) internal virtual override {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
        uint256 numberOfTokens = ids.length;

        if (from == address(0)) {
            // mint token
            uint256 nftType = _getNftType(id);
            _ownerOfNft[id] = to;
            return;
        }

        if (to == address(0)) {
            delete _ownerOfNft[id];
            return;
        }

        if (from != address(0) && to != address(0)) {
            _ownerOfNft[id] = to;
        }
    }
}
