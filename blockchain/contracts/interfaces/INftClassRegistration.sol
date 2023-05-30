// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;
import "./IConstant.sol";

interface INftClassRegistration is IConstant {
    function getStudentListOfClass(
        uint256 classId
    ) external view returns (NftIdentityResponse[] memory);

    function getNftClassRegistration(
        uint256 tokenId
    ) external view returns (NftClassRegistration memory);

    function checkNftClassRegistrationRegained(
        uint256 studentTokenId,
        uint256 classId
    ) external view returns (bool);
}
