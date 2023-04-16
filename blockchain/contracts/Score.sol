// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;

import "./ERC1155BaseContract.sol";
import "./interfaces/IScore.sol";

/*
    Initial year: Requirements + Course Template (time available to update? --> after year end)
    (Save endCurrentYear) -> Classes -> Register course -> Received Nft Scoreboard
    Course end: Mint Nft complete course <-- Transfer info from Nft Scoreboard to this
    Enough course: Exchange nft graduation from nft courses (payable)
*/
contract Score is IScore {
    mapping(uint256 => bool) private _usableScores;
    
    constructor() {
        _usableScores[uint256(ScoreType.Midterm)] = true;
        _usableScores[uint256(ScoreType.Practice)] = true;
        _usableScores[uint256(ScoreType.Plus)] = true;
        _usableScores[uint256(ScoreType.Final)] = true;
        _usableScores[uint256(ScoreType.Other)] = true;
    }

    function checkValidScores(uint256[] memory scores)
        external
        view
        returns (bool)
    {
        uint256 numberOfChecks = scores.length;
        for (uint256 idx = 0; idx < numberOfChecks; ++idx) {
            if (!_usableScores[scores[idx]]) {
                return false;
            }
        }

        return true;
    }

}