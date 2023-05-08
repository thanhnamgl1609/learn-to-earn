// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;
import "./IConstant.sol";

interface INftSchool is IConstant {
    function minimumGraduationScore() external view returns (uint256);
    function getClassById(uint256 id) external view returns (ClassResponse memory);
    function getAllKnowledgeBlocks()
        external
        view
        returns (KnowledgeBlock[] memory);
}
