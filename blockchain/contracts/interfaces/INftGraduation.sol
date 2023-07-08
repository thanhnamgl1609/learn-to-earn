// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;
import "./IConstant.sol";

interface INftGraduation is IConstant {
    function getNftCompleteCourseForRequestGraduation(
        uint256 studentTokenId
    ) external view returns (uint256[] memory);
}
