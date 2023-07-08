// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;
import "./IConstant.sol";

interface ISchool is IConstant {
    function minimumGraduationScore() external view returns (uint256);

    function getAllKnowledgeBlocks()
        external
        view
        returns (KnowledgeBlock[] memory);

    function getRegisterTime(
        uint256 semesterId
    ) external view returns (uint256, uint256);

    function getClassById(uint256 id) external view returns (Class memory);

    function getClassBySemester(
        uint256 semester
    ) external view returns (Class[] memory);

    function getAssignedClasses(
        uint256 teacherTokenId
    ) external view returns (Class[] memory);
}
