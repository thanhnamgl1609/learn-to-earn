// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Registration.sol";
import "./interfaces/INftIdentities.sol";

contract NftIdentities is ERC1155URIStorage, Registration, INftIdentities {
    using Counters for Counters.Counter;

    struct NftIdentity {
        uint256 tokenId;
        address register;
        uint256 expiredAt;
    }

    uint256 constant INDEX_BITS = 16;
    uint256 constant MAX_NFT_INDEX = uint256(~uint16(0));
    uint256 constant ONE_NFT = 1;

    uint256 constant VISITOR_ID = 99;
    uint256 constant REGISTERED_ID = 100;
    uint256 constant HIGHEST_OPERATOR_ID = 101;
    address private _owner;

    // Registration vars
    uint256 public registerFee = 0.05 ether;
    mapping(address => uint256) _tokenIdOfRegisters;

    mapping(uint256 => Counters.Counter) _maxTokenIdIndexOfRole; // type => max token id
    mapping(uint256 => NftIdentity[]) private _nftsOfRole; // type => Nft
    mapping(uint256 => uint256) private _nftPosOfTokenId; // tokenId => index
    mapping(string => bool) private _usedTokenURI;

    mapping(address => uint256) private _nftOfOwner; // address => tokenId[]

    mapping(uint256 => address) private _ownerOfNft;

    uint256[] _extendRequestTokenIds;
    mapping(uint256 => uint256) _positionOfRequestTokenId;

    modifier onlyOwner() {
        require(msg.sender == _owner);
        _;
    }

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

    modifier ownZeroNft(address addr) {
        require(_nftOfOwner[addr] == 0);
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

    // Used for everyone: Section start
    function getNftInfo(
        uint256 tokenId
    ) public view returns (NftIdentity memory, string memory) {
        string memory tokenURI = uri(tokenId);
        NftIdentity memory nftIdentity = getNftOfTokenId(tokenId);

        return (nftIdentity, tokenURI);
    }

    function getNftOfTokenId(
        uint256 tokenId
    ) public view returns (NftIdentity memory) {
        uint256 nftType = _getNftType(tokenId);
        uint256 pos = _nftPosOfTokenId[tokenId];
        require(pos > 0, "Nft is not exist");

        return _nftsOfRole[nftType][pos - 1];
    }

    function getAllNftIdentityRegistration(
        uint256 role
    ) public view onlyOwner returns (RegistrationInfo[] memory) {
        return _getAllRegistration(role);
    }

    function getRegisteredInfo() public view returns (RegistrationInfo memory) {
        return _getRegisteredInfo();
    }

    function getAllExtendExpiredRequest()
        public
        view
        onlyOwner
        returns (NftIdentity[] memory, string[] memory)
    {
        uint256 numberOfRequests = _extendRequestTokenIds.length;
        NftIdentity[] memory nftIdentities = new NftIdentity[](
            numberOfRequests
        );
        string[] memory tokenURIs = new string[](numberOfRequests);

        for (uint256 index = 0; index < numberOfRequests; ++index) {
            uint256 tokenId = _extendRequestTokenIds[index];
            NftIdentity memory nftIdentity;
            string memory tokenURI;
            (nftIdentity, tokenURI) = getNftInfo(tokenId);

            nftIdentities[index] = nftIdentity;
            tokenURIs[index] = tokenURI;
        }

        return (nftIdentities, tokenURIs);
    }

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
    function requestExtendExpiredNft() public {
        uint256 tokenId = _nftOfOwner[msg.sender];
        require(tokenId > 0);
        NftIdentity memory nftIdentity = getNftOfTokenId(tokenId);
        require(nftIdentity.expiredAt < block.timestamp);

        safeTransferFrom(msg.sender, _owner, tokenId, ONE_NFT, msg.data);
        _extendRequestTokenIds.push(tokenId);
        _positionOfRequestTokenId[tokenId] = _extendRequestTokenIds.length;
    }

    // Used for student: Section start

    // Used for other contracts: Section start
    function isAbleToOperate(
        address registerAddr
    ) public view returns (bool, uint256) {
        uint256 tokenId = _tokenIdOfRegisters[registerAddr];
        if (tokenId == 0) {
            return (false, 0);
        }
        NftIdentity memory nftIdentity = getNftOfTokenId(tokenId);

        return (nftIdentity.expiredAt > block.timestamp, _getNftType(tokenId));
    }

    // Used for other contracts: Section end

    // Used for owner: Section start
    function registerNftIdentity(
        uint256 role,
        string memory documentURI
    ) public payable {
        require(msg.value == registerFee, "fee required");
        require(role == uint256(ROLE.TEACHER), "role teacher");
        _register(role, documentURI);
    }

    function grantNftIdentity(
        address targetAccount,
        uint256 expiredAt,
        string memory tokenURI
    ) public hasRegistered(targetAccount) onlyOwner {
        uint256 role = _getRegisteredRole(targetAccount);
        _mintToken(role, targetAccount, expiredAt, tokenURI);
        _removeFromRegistersList(targetAccount);
    }

    function rejectNftIdentityRegistration(address to)
        public
        onlyOwner
        hasRegistered(to)
    {
        require(_registeredAddr[to] > 0);
        _removeFromRegistersList(to);
    }

    function extendExpiredNft(
        uint256 tokenId,
        uint256 nextExpiredAt
    ) public onlyOwner tokenOwnByContract(tokenId) isAfterNow(nextExpiredAt) {
        // For approve extend expired request
        uint256 nftType = _getNftType(tokenId);
        uint256 pos = _nftPosOfTokenId[tokenId];
        require(pos > 0, "Nft is not exist");

        _nftsOfRole[nftType][pos - 1].expiredAt = nextExpiredAt;
    }

    function burnNft(
        uint256 tokenId
    ) public onlyOwner tokenOwnByContract(tokenId) {
        // For reject extend expired request
        _burn(_owner, tokenId, ONE_NFT);
    }

    // Used for owner: Section start

    // Used for members: Section start
    function getOwnedNft()
        public
        view
        returns (NftIdentity memory, string memory, bool, bool)
    {
        uint256 tokenId = _tokenIdOfRegisters[msg.sender];
        NftIdentity memory nftIdentity = getNftOfTokenId(tokenId);
        string memory tokenURI = uri(tokenId);
        bool isExpired = nftIdentity.expiredAt <= block.timestamp;
        bool isExpiredRequest = _positionOfRequestTokenId[tokenId] > 0;

        return (nftIdentity, tokenURI, isExpired, isExpiredRequest);
    }

    function getRole() public view returns (uint256) {
        if (msg.sender == _owner) {
            return uint256(HIGHEST_OPERATOR_ID);
        }

        if (_registeredAddr[msg.sender] > 0) {
            return uint256(REGISTERED_ID);
        }

        uint256 tokenId = _tokenIdOfRegisters[msg.sender];
        if (tokenId == 0) {
            return uint256(VISITOR_ID);
        }

        uint256 role = _getNftType(tokenId);

        return role;
    }

    function depositNftIdentity() public {
        uint256 tokenId = _nftOfOwner[msg.sender];
        require(tokenId > 0, "Invalid operation");
        NftIdentity memory nftIdentity = getNftOfTokenId(tokenId);

        if (nftIdentity.expiredAt > block.timestamp) {
            safeTransferFrom(msg.sender, _owner, tokenId, ONE_NFT, msg.data);
        } else {
            // If NFT haven't extend but try to operate
            _burn(msg.sender, tokenId, ONE_NFT);
        }
    }

    function withdrawNftIdentity() public {
        uint256 tokenId = _tokenIdOfRegisters[msg.sender];
        require(tokenId > 0, "Haven't owned any nfts yet");
        require(_ownerOfNft[tokenId] == _owner, "Nft hasn't been deposited");

        safeTransferFrom(_owner, msg.sender, tokenId, ONE_NFT, msg.data);
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

        uint256 tokenId = ids[0];

        if (from != address(0)) {
            delete _nftOfOwner[from];
            delete _ownerOfNft[tokenId];
        }

        if (to != address(0)) {
            _nftOfOwner[to] = tokenId;
            _ownerOfNft[tokenId] = to;
        } else {
            // burn
            _removeTokenIdFromAllTokens(tokenId);
            delete _tokenIdOfRegisters[from];
        }
    }

    function _removeTokenIdFromAllTokens(uint256 tokenId) private {
        uint256 nftPos = _nftPosOfTokenId[tokenId];
        uint256 nftType = _getNftType(tokenId);
        uint256 nftCount = _nftsOfRole[nftType].length;

        if (nftCount != nftPos) {
            NftIdentity memory lastNft = _nftsOfRole[nftType][nftCount - 1];
            _nftsOfRole[nftType][nftPos - 1] = lastNft;
            _nftPosOfTokenId[lastNft.tokenId] = nftPos;
        }
        _nftsOfRole[nftType].pop();
        delete _nftPosOfTokenId[tokenId];
    }

    function _mintTokens(
        uint256 role,
        address[] memory to,
        uint256[] memory expiredAt,
        string[] memory tokenURI
    ) private allowedRole(role) canGenerateNewTokens(role, to.length) {
        require(to.length == expiredAt.length, "Invalid params");
        require(to.length == tokenURI.length, "Invalid params");
        uint256 targetCount = to.length;

        for (uint256 index = 0; index < targetCount; ++index) {
            if (_nftOfOwner[to[index]] > 0) {
                revert("Nft Identity must be unique");
            }
            _mintToken(role, to[index], expiredAt[index], tokenURI[index]);
        }
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

        _createNftIdentity(to, tokenId, expiredAt);
        _mint(to, tokenId, ONE_NFT, msg.data);

        return tokenId;
    }

    function _createNftIdentity(address to, uint256 tokenId, uint256 expiredAt) private {
        uint256 nftType = _getNftType(tokenId);
        NftIdentity memory nftIdentity = NftIdentity(
            tokenId,
            msg.sender,
            expiredAt
        );

        _nftsOfRole[nftType].push(nftIdentity);
        _nftPosOfTokenId[tokenId] = _nftsOfRole[nftType].length;
        _tokenIdOfRegisters[to] = tokenId;
    }

    function _getNftType(uint256 tokenId) private pure returns (uint256) {
        return tokenId >> INDEX_BITS;
    }

    function _generateNewTokenId(uint256 role) private returns (uint256) {
        _maxTokenIdIndexOfRole[role].increment();
        uint256 tokenId = _maxTokenIdIndexOfRole[role].current();

        return (role << INDEX_BITS) | tokenId;
    }
}
