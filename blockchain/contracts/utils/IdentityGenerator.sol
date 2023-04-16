// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;

/*
    - Register class -> NftScoreboard
    - Exchange Nft Complete Course
    - Exchange Nft Graduation
*/
contract IdentityGenerator {
    mapping(uint256 => uint256) currentIds;

    function generateNewId(uint256 category) internal returns (uint256) {
        currentIds[category] += 1;

        return currentIds[category];
    }

    function getCurrentId(uint256 category) internal view returns (uint256) {
        return currentIds[category];
    }
}
