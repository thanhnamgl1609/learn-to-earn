// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;


library ArraySearch {
    function findIndex(uint256[] memory arr, uint256 item) public pure returns (uint256) {
        uint256 len = arr.length;
        uint256 res = arr.length;
        
        for (uint256 idx; idx < len; ++idx) {
            if (arr[idx] == item) {
                res = idx;
                break;
            }
        }

        return res;
    }
}
