// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;
import "./IConstant.sol";

interface INftIdentities is IConstant {
    function isAbleToOperate(
        address registerAddr,
        uint256 role
    ) external view returns (bool);

    function getNftOfTokenId(
        uint256 tokenId
    ) external view returns (NftIdentityResponse memory);

    function ownerOf(uint256 tokenId) external view returns (address);

    function getNftOfMemberWithRole(
        uint256 role,
        address memberAddr
    ) external view returns (NftIdentityResponse memory);

    function getTokenType(uint256 tokenId) external pure returns (uint256);

    function getNftTokenIdOfRole(
        address checkedAddr,
        uint256 role
    ) external view returns (uint256);
}
