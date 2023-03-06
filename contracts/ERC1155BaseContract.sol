
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
    mapping(string => bool) internal _usedTokenURI;

    mapping(uint256 => address) internal _ownerOfNft;

    function _mintToken(uint256 nftType, string memory tokenURI) internal returns (uint256) { 
        require(!_usedTokenURI[tokenURI], "URI has been used");
        uint256 tokenId = _generateNewTokenId(nftType);
        _mint(_owner, tokenId, ONE_NFT, msg.data);
        _setURI(tokenId, tokenURI);
        _usedTokenURI[tokenURI] = true;

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
}
