// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;

library Type {
    enum CourseStatus {
        InProgress,
        Complete
    }

    struct Course {
        uint256 id;
        address teacherAddress;
        uint256 credits;
        uint256 maxNftCounts; // to limit the nft course minted
        uint256 courseGroup; // course group id, course name: uri
        string metadata; // course name
        CourseStatus status;
    }

    struct Requirement {
        uint256 courseGroupId;
        uint256 credits;
    }
}
