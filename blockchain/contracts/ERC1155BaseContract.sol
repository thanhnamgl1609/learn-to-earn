
// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ERC1155BaseContract is ERC1155URIStorage {
    using Counters for Counters.Counter;
    
    uint256 constant INDEX_BITS = 16;
    uint256 constant MAX_NFT_INDEX = uint256(~uint16(0));
    uint256 constant ONE_NFT = 1;

    address internal _owner;

    constructor (string memory uri) ERC1155(uri) {
        _owner = msg.sender;
    }

    mapping(uint256 => Counters.Counter) internal _maxTokenIdIndexOfRole; // type => max token id

    mapping(uint256 => mapping(uint256 => address)) internal _ownerOfNft;

    function _mintToken(address tokenOwner, uint256 nftType, string memory tokenURI) internal returns (uint256) { 
        uint256 tokenId = _generateNewTokenId(nftType);
        _mint(tokenOwner, tokenId, ONE_NFT, msg.data);
        _setURI(tokenId, tokenURI);

        return tokenId;
    }

    function _getNftType(uint256 tokenId) internal pure returns (uint256) {
        return tokenId >> INDEX_BITS;
    }

    function _generateNewTokenId(uint256 nftType) internal returns (uint256) {
        _maxTokenIdIndexOfRole[nftType].increment();
        uint256 tokenId = _maxTokenIdIndexOfRole[nftType].current();

        return (nftType << INDEX_BITS) | tokenId;
    }

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal virtual override {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
        uint256 numberOfTokens = ids.length;

        if (from == address(0)) {
            // mint token
            for (uint256 idx = 0; idx < numberOfTokens; ++idx) {
                uint256 nftType = _getNftType(ids[idx]);
                _ownerOfNft[nftType][ids[idx]] = to;
            }
            return;
        }

        if (to == address(0)) {
            // burn token
            for (uint256 idx = 0; idx <= numberOfTokens; ++idx) {
                uint256 nftType = _getNftType(ids[idx]);
                delete _ownerOfNft[nftType][ids[idx]];
            }
            return;
        }

        if (from != address(0) && to != address(0)) {
            for (uint256 idx = 0; idx <= numberOfTokens; ++idx) {
                uint256 nftType = _getNftType(ids[idx]);
                _ownerOfNft[nftType][ids[idx]] = to;
            }
        }
    }
}
