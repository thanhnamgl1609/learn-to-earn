// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;
import "./IConstant.sol";

interface INftIdentities is IConstant {
    function isAbleToOperate(
        address registerAddr,
        uint256 role
    ) external view returns (bool);
}
