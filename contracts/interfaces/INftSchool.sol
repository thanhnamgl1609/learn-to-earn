// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;
import "./IConstant.sol";

interface INftSchool is IConstant {
    function checkTokenOfTypeExists(uint256 tokenId, uint256 requiredType) external view returns (bool);
    function getNftClass(uint256 tokenId) external view returns (NftClass memory, string memory);
}
