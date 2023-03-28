// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;


library ArrayMath {
    function average(uint256[] memory arr) public pure returns (uint256) {
        uint256 len = arr.length;
        uint256 result = 0;

        for (uint256 idx; idx < len; ++idx) {
            result += arr[idx]; 
        }

        return result / len;
    }
}
