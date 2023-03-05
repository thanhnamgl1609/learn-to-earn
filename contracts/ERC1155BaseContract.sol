
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

    constructor (string memory uri) ERC1155(uri) {}

    mapping(uint256 => Counters.Counter) _maxTokenIdIndexOfRole; // type => max token id
    mapping(string => bool) private _usedTokenURI;

    mapping(address => uint256) private _nftOfOwner; // address => tokenId[]

    mapping(uint256 => address) private _ownerOfNft;

    function _getNftType(uint256 tokenId) private pure returns (uint256) {
        return tokenId >> INDEX_BITS;
    }

    function _generateNewTokenId(uint256 nftType) private returns (uint256) {
        _maxTokenIdIndexOfRole[nftType].increment();
        uint256 tokenId = _maxTokenIdIndexOfRole[nftType].current();

        return (nftType << INDEX_BITS) | tokenId;
    }
}
