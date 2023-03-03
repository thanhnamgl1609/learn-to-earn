// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
// import "@openzeppelin/contracts/utils/Counters.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";
import "./Registration.sol";

contract NftIdentities is ERC1155URIStorage, Registration {
    uint256 constant INDEX_BITS = 16;
    uint256 constant TYPE_MASK = uint256(~uint16(0)) << 16;
    uint256 constant NF_INDEX_MASK = ~uint16(0);
    uint256 constant ONE_NFT = 1;
    
    address private _owner;

    mapping(uint256 => uint256[]) private _tokenIdsOfType;
    mapping(uint256 => uint256) private _indexOfTokenId;
    
    mapping(address => uint256[]) private _nftsOfOwner;
    mapping(address => mapping(uint256 => uint256)) private _indexOfOwnedNft;

    mapping (uint256 => address) private _ownerOfNft;

    modifier onlyOwner {
        require(msg.sender == _owner);
        _;
    }

    constructor() ERC1155("") {
        _owner = msg.sender;
    }

    function mintToken(uint256 role, address addr, string memory tokenURI) public onlyOwner isAllowedRole(role) isMember(role, addr) {
        
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
        uint256 tokenId = ids[0];
        uint256 nftType = tokenId >> INDEX_BITS;

        if (to == address(0)) {
            // Burn
            _removeTokenIdFromAllTokens(tokenId);
            _removeOwnedTokenIdFromList(to, tokenId);
            delete _ownerOfNft[tokenId];
        } else {
            _tokenIdsOfType[nftType].push(tokenId);
            _indexOfTokenId[tokenId] = _tokenIdsOfType[nftType].length;

            _nftsOfOwner[to].push(tokenId);
            _indexOfOwnedNft[to][tokenId] = _nftsOfOwner[to].length;

            _ownerOfNft[tokenId] = to;
        }
    }

    function _removeTokenIdFromAllTokens(uint256 tokenId) private {
        // TODO: implementation

        // _tokenIdsOfType[nftType].pop(); // (tokenId);
    }

    function _removeOwnedTokenIdFromList(address to, uint256 tokenId) private {
        // TODO: implementation

        // _nftsOfOwner[to].pop(); // (tokenId);
    }
    
    function parseId(uint256 id) private pure returns (uint256[2] memory) {
        uint256 nftType = id >> INDEX_BITS;
        uint256 nftIndex = id & NF_INDEX_MASK;

        return [nftType, nftIndex];
    }
}
