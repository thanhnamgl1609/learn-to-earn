// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;
import "./IConstant.sol";

interface INftCompleteCourses is IConstant {
    function checkCompleteCourse(
        uint256 courseId,
        address studentAddr
    ) external view returns (bool);

    function regainNftCompleteCourses(
        uint256 studentTokenId,
        uint256[] memory tokenIds
    ) external;

    function getNftCompleteCourse(
        uint256 tokenId
    ) external view returns (NftCompleteCourse memory, string memory);
}
