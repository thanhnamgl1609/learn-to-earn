
// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;

contract CertificateDefinition {
    uint256 constant INDEX_BITS = 16;
    uint256 constant MAX_NFT_INDEX = uint256(~uint16(0));
    uint256 constant ONE_NFT = 1;

    uint256 constant NFT_COURSE_TEMPLATE = 1;
    uint256 constant NFT_REQUIREMENT = 2;
    uint256 constant NFT_CLASS = 3;
    uint256 constant NFT_COMPLETE_COURSE = 3;
    uint256 constant NFT_GRADUATION = 3;

    struct NftCourseTemplate { // cannot be burn if exist any nft classes belongs to it
        uint256 tokenId;
        uint256 courseName;
        uint256 requirementId; // cannot be updated
        uint256 credits;
    }

    struct NftRequirement {
        uint256 tokenId;
        uint256 credits;
    }
    
    struct NftClass {
        uint256 tokenId;
        uint256 courseTemplateId; // courseId - requirementId
        uint256 credits;
        uint256 completeAt; // end time
        uint256 studentAddresses;
        uint256 teacherAddr;
        /* Metadata:
            - Teacher name - Nft Id?
            - Course name
            - Course group name?
            - CompleteAt (datetime)
            - Credits
            - Student List (Name - Nft Id?)
        */
    }

    struct NftCompleteCourse {
        uint256 tokenId;
        uint256 credits;
        uint256 avgScore;
    }
}