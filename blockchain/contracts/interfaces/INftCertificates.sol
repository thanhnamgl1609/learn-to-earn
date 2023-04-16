// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;
import "./IConstant.sol";

interface INftCertificates is IConstant {
    function checkCompleteCourse(
        uint256 courseId,
        address studentAddr
    ) external view returns (bool);
}
