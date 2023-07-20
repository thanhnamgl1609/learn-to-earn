// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./base/Registration.sol";
import "./interfaces/INftIdentities.sol";

contract NftIdentities is INftIdentities, ERC1155URIStorage, Registration {
    using Counters for Counters.Counter;

    uint256 constant INDEX_BITS = 16;
    uint256 constant MAX_NFT_INDEX = uint256(~uint16(0));
    uint256 constant ONE_NFT = 1;

    uint256 constant VISITOR_ID = 99;
    uint256 constant REGISTERED_ID = 100;
    uint256 constant HIGHEST_OPERATOR_ID = 101;

    // Registration vars
    uint256 public registerFee = 0.05 ether;

    address private immutable _schoolAccount;

    mapping(uint256 => Counters.Counter) _maxTokenIdIndexOfRole; // type => max token id
    mapping(uint256 => NftIdentity[]) private _nftsOfRole; // type => Nft
    mapping(uint256 => uint256) private _nftPosOfTokenId; // tokenId => index
    mapping(string => bool) private _usedTokenURI;

    mapping(address => mapping(uint256 => uint256))
        private _mappingRoleToTokenIdOfOwner;
    mapping(address => uint256[]) private _nftsOfOwner; // address => tokenId[]
    mapping(uint256 => uint256) private _posOfNftOfOwner; // tokenId => pos
    mapping(uint256 => address) private _ownerOfNft;

    uint256[] _extendRequestTokenIds;
    mapping(uint256 => uint256) _positionOfRequestTokenId;

    constructor(address schoolAccount) ERC1155("") {
        _owner = msg.sender;
        _hasRole[uint(ROLE.STUDENT)] = true;
        _hasRole[uint(ROLE.TEACHER)] = true;
        _schoolAccount = schoolAccount;
    }

    function getTokenType(uint256 tokenId) public pure returns (uint256) {
        return tokenId >> INDEX_BITS;
    }

    function getNftOfTokenId(
        uint256 tokenId
    ) public view returns (NftIdentityResponse memory) {
        uint256 nftType = getTokenType(tokenId);
        uint256 pos = _nftPosOfTokenId[tokenId];
        require(pos > 0, "NI-ERR-00");
        NftIdentity memory nftIdentity = _nftsOfRole[nftType][pos - 1];

        NftIdentityResponse memory nftIdentityResponse = NftIdentityResponse(
            nftIdentity,
            uri(tokenId),
            getTokenType(tokenId),
            nftIdentity.expiredAt < block.timestamp
        );

        return nftIdentityResponse;
    }

    function ownerOf(uint256 tokenId) external view returns (address) {
        return _ownerOfNft[tokenId];
    }

    function isAbleToOperate(
        address registerAddr,
        uint256 role
    ) public view returns (bool) {
        uint256 tokenId = _mappingRoleToTokenIdOfOwner[registerAddr][role];
        if (tokenId == 0) {
            return false;
        }
        NftIdentity memory nftIdentity = getNftOfTokenId(tokenId).nftIdentity;

        return nftIdentity.expiredAt > block.timestamp;
    }

    // Registration Section: Start
    function registerNftIdentity(
        uint256 role,
        string memory documentURI
    ) public payable {
        require(msg.value == registerFee, "C-ERR-04");
        require(
            role == uint256(ROLE.TEACHER) || role == uint256(ROLE.STUDENT),
            "NI-ERR-01"
        );
        require(!_registeredDocumentURI[documentURI], "C-ERR-05");
        require(_positionOfRegisters[role][msg.sender] == 0, "NI-ERR-02");
        _register(role, documentURI);
        payable(_schoolAccount).transfer(msg.value);
    }

    function grantNftIdentity(
        address targetAccount,
        uint256 role,
        uint256 expiredAt,
        string memory tokenURI
    ) public onlyOwner hasRegistered(targetAccount, role) {
        _mintToken(role, targetAccount, expiredAt, tokenURI);
        _removeFromRegistersList(targetAccount, role);
    }

    function rejectNftIdentityRegistration(
        address to,
        uint256 role
    ) public onlyOwner hasRegistered(to, role) {
        _removeFromRegistersList(to, role);
    }

    function getOwnedNfts() public view returns (NftIdentityResponse[] memory) {
        uint256[] memory tokenIds = _nftsOfOwner[msg.sender];
        uint256 count = tokenIds.length;
        NftIdentityResponse[]
            memory nftIdentityResponse = new NftIdentityResponse[](count);

        for (uint256 idx; idx < count; ++idx) {
            nftIdentityResponse[idx] = getNftOfTokenId(tokenIds[idx]);
        }

        return nftIdentityResponse;
    }

    function getAllMembers(
        uint256 role
    ) external view returns (NftIdentityResponse[] memory) {
        uint256 count = _nftsOfRole[role].length;
        NftIdentityResponse[]
            memory nftIdentitiyResponses = new NftIdentityResponse[](count);

        for (uint256 idx; idx < count; ++idx) {
            nftIdentitiyResponses[idx] = getNftOfTokenId(
                _nftsOfRole[role][idx].tokenId
            );
        }

        return nftIdentitiyResponses;
    }

    function getNftOfMemberWithRole(
        uint256 role,
        address sender
    ) public view returns (NftIdentityResponse memory) {
        uint256 tokenId = _mappingRoleToTokenIdOfOwner[sender][role];

        return getNftOfTokenId(tokenId);
    }

    // Checker Section: Start
    function getNftTokenIdOfRole(
        address checkedAddr,
        uint256 role
    ) public view returns (uint256) {
        return _mappingRoleToTokenIdOfOwner[checkedAddr][role];
    }

    // Checker Section: End

    // Used for members: Section end
    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal virtual override {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
        require(from == address(0) || to == address(0), "C-ERR-06");

        uint256 idsCount = ids.length;
        for (uint256 idx = 0; idx < idsCount; ++idx) {
            uint256 tokenId = ids[idx];
            uint256 role = getTokenType(tokenId);

            if (from != address(0)) {
                // Remove from owner list
                _removeTokenIdFromOwner(from, tokenId);
                delete _mappingRoleToTokenIdOfOwner[from][role];
                delete _ownerOfNft[tokenId];
            } else {}

            if (to != address(0)) {
                _nftsOfOwner[to].push(tokenId);
                _posOfNftOfOwner[tokenId] = _nftsOfOwner[to].length;
                _mappingRoleToTokenIdOfOwner[to][role] = tokenId;
                _ownerOfNft[tokenId] = to;
            } else {
                // burn
                _removeTokenIdFromAllTokens(tokenId);
                _removeTokenIdFromOwner(from, tokenId);
                delete _mappingRoleToTokenIdOfOwner[from][role];
                delete _ownerOfNft[tokenId];
            }
        }
    }

    function _removeTokenIdFromOwner(address owner, uint256 tokenId) private {
        uint256 nftPos = _posOfNftOfOwner[tokenId];
        uint256 nftCount = _nftsOfOwner[owner].length;

        if (nftCount != nftPos) {
            uint256 lastTokenId = _nftsOfOwner[owner][nftCount - 1];
            _nftsOfOwner[owner][nftPos - 1] = lastTokenId;
            _posOfNftOfOwner[lastTokenId] = nftPos;
        }

        _nftsOfOwner[owner].pop();
        delete _posOfNftOfOwner[tokenId];
    }

    function _removeTokenIdFromAllTokens(uint256 tokenId) private {
        uint256 nftPos = _nftPosOfTokenId[tokenId];
        uint256 nftType = getTokenType(tokenId);
        uint256 nftCount = _nftsOfRole[nftType].length;

        if (nftCount != nftPos) {
            NftIdentity memory lastNft = _nftsOfRole[nftType][nftCount - 1];
            _nftsOfRole[nftType][nftPos - 1] = lastNft;
            _nftPosOfTokenId[lastNft.tokenId] = nftPos;
        }
        _nftsOfRole[nftType].pop();
        delete _nftPosOfTokenId[tokenId];
    }

    function _mintToken(
        uint256 role,
        address to,
        uint256 expiredAt,
        string memory tokenURI
    ) private returns (uint256) {
        require(!_usedTokenURI[tokenURI], "C-ERR-05");
        uint256 tokenId = _generateNewTokenId(role);
        _setURI(tokenId, tokenURI);

        _createNftIdentity(to, role, tokenId, expiredAt);
        _mint(to, tokenId, ONE_NFT, msg.data);

        return tokenId;
    }

    function _createNftIdentity(
        address to,
        uint256 role,
        uint256 tokenId,
        uint256 expiredAt
    ) private {
        NftIdentity memory nftIdentity = NftIdentity(tokenId, to, expiredAt);

        _nftsOfRole[role].push(nftIdentity);
        _nftPosOfTokenId[tokenId] = _nftsOfRole[role].length;
    }

    function _generateNewTokenId(uint256 role) private returns (uint256) {
        _maxTokenIdIndexOfRole[role].increment();
        uint256 tokenId = _maxTokenIdIndexOfRole[role].current();

        return (role << INDEX_BITS) | tokenId;
    }
}
