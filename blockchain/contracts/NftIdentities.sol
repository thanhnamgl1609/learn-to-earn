// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Registration.sol";
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

    modifier isAfterNow(uint256 timestamp) {
        require(timestamp > block.timestamp);
        _;
    }

    modifier canGenerateNewTokens(uint256 role, uint256 amount) {
        uint256 currentIndex = _maxTokenIdIndexOfRole[role].current() +
            amount -
            1;
        require(currentIndex | MAX_NFT_INDEX == MAX_NFT_INDEX);
        _;
    }

    modifier ownNft(uint256 tokenId) {
        require(_ownerOfNft[tokenId] == msg.sender);
        _;
    }

    modifier tokenOwnByContract(uint256 tokenId) {
        require(_ownerOfNft[tokenId] == _owner);
        _;
    }

    constructor() ERC1155("") {
        _owner = msg.sender;
        _hasRole[uint(ROLE.STUDENT)] = true;
        _hasRole[uint(ROLE.TEACHER)] = true;
    }

    function getTokenType(uint256 tokenId) public pure returns (uint256) {
        return tokenId >> INDEX_BITS;
    }

    function getNftOfTokenId(
        uint256 tokenId
    ) public view returns (NftIdentityResponse memory) {
        uint256 nftType = getTokenType(tokenId);
        uint256 pos = _nftPosOfTokenId[tokenId];
        require(pos > 0, "Nft is not exist");
        NftIdentity memory nftIdentity = _nftsOfRole[nftType][pos - 1];

        NftIdentityResponse memory nftIdentityResponse = NftIdentityResponse(
            nftIdentity,
            uri(tokenId),
            getTokenType(tokenId),
            nftIdentity.expiredAt < block.timestamp
        );

        return nftIdentityResponse;
    }

    // function getAllExtendExpiredRequest()
    //     public
    //     view
    //     onlyOwner
    //     returns (NftIdentity[] memory, string[] memory)
    // {
    //     uint256 numberOfRequests = _extendRequestTokenIds.length;
    //     NftIdentity[] memory nftIdentities = new NftIdentity[](
    //         numberOfRequests
    //     );
    //     string[] memory tokenURIs = new string[](numberOfRequests);

    //     for (uint256 index = 0; index < numberOfRequests; ++index) {
    //         uint256 tokenId = _extendRequestTokenIds[index];
    //         NftIdentity memory nftIdentity;
    //         string memory tokenURI;
    //         (nftIdentity, tokenURI) = getNftInfo(tokenId);

    //         nftIdentities[index] = nftIdentity;
    //         tokenURIs[index] = tokenURI;
    //     }

    //     return (nftIdentities, tokenURIs);
    // }

    // Used for everyone: Section end

    // Used for teacher: Section start
    /*
        Teacher: if expired => request to extend =>
            - Accept: Reset expired date
            - Reject: Burn token
        Student: if expired => Extend year end? (graduated won't own nft) => request to extend =>
            - Accept: Reset expired date
            - Reject: Burn token
    */
    // function requestExtendExpiredNft() public {
    //     uint256 tokenId = _nftOfOwner[msg.sender];
    //     require(tokenId > 0);
    //     NftIdentity memory nftIdentity = getNftOfTokenId(tokenId);
    //     require(nftIdentity.expiredAt < block.timestamp);

    //     safeTransferFrom(msg.sender, _owner, tokenId, ONE_NFT, msg.data);
    //     _extendRequestTokenIds.push(tokenId);
    //     _positionOfRequestTokenId[tokenId] = _extendRequestTokenIds.length;
    // }

    // Used for student: Section start

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
        require(msg.value == registerFee);
        require(role == uint256(ROLE.TEACHER) || role == uint256(ROLE.STUDENT));
        require(!_registeredDocumentURI[documentURI], "Document URI exist");
        require(_positionOfRegisters[role][msg.sender] == 0, "Has registered");
        _register(role, documentURI);
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

    // Registration Section: End

    // function extendExpiredNft(
    //     uint256 tokenId,
    //     uint256 nextExpiredAt
    // ) public onlyOwner tokenOwnByContract(tokenId) isAfterNow(nextExpiredAt) {
    //     // For approve extend expired request
    //     uint256 nftType = getTokenType(tokenId);
    //     uint256 pos = _nftPosOfTokenId[tokenId];
    //     require(pos > 0, "Nft is not exist");

    //     _nftsOfRole[nftType][pos - 1].expiredAt = nextExpiredAt;
    // }

    function burnNft(
        uint256 tokenId
    ) public onlyOwner tokenOwnByContract(tokenId) {
        // For reject extend expired request
        _burn(_owner, tokenId, ONE_NFT);
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
        require(
            from == address(0) || to == address(0),
            "Only mint or burn is allowed"
        );

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
        require(!_usedTokenURI[tokenURI], "Token URI has already used");
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
