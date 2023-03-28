// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;

/*
    Core creation flows: Requirement => Course template => class => complete course => graduation
    Removable:
        - Requirement <- need course template remove before
        - Course Template <- need all class belongs to done
        - Class <- Need to complete
    Editable:
        - Requirement {}
*/
interface IScore {
    enum ScoreType {
        Midterm,
        Practice,
        Plus,
        Final,
        Other
    }

    function checkValidScores(uint256[] memory scores)
        external
        view
        returns (bool);
}
