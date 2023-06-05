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
interface IConstant {
    enum ROLE {
        STUDENT,
        TEACHER
    }

    struct KnowledgeBlock {
        uint256 id;
        uint256 credits;
    }

    struct Course {
        // cannot be burn if exist any nft classes belongs to it
        uint256 id;
        uint256 knowledgeBlockId; // cannot be updated
        uint256 prevCourseId;
        uint256 credits;
        uint256 status; // 0: opened, 1: closed
        string courseCode;
        string uri;
        /*
            Metadata:
                - Requirement name
                - Course name
        */
    }

    struct Class {
        uint256 id;
        uint256 courseId; // courseId - requirementId
        uint256 knowledgeBlockId; // courseId - requirementId
        uint256 prevCourseId;
        uint256 credits;
        uint256 completeAt; // end time - editable
        uint256 maxSize;
        uint256 teacherTokenId;
        uint256 semester;
        uint256 registerClassFee;
        string uri;
        /* Metadata:
            - Teacher name - Nft Id?
            - Course name
            - Course group name?
            - CompleteAt (datetime)
            - Credits
            - Student List (Name - Nft Id?)
            - Start at
        */
    }

    struct ClassResponse {
        Class class;
        uint256 numberOfStudents;
    }

    struct NftClassRegistration {
        uint256 tokenId;
        uint256 classId;
        uint256 studentTokenId;
        /*
            Metadata:
                - Student info (name + tokenId)
                - Required Scores (GK, CK, ...)
                - Class info
        */
    }

    struct NftClassRegistrationResponse {
        NftClassRegistration nftClassRegistration;
        Class class;
        string tokenURI;
    }

    struct NftCompleteCourse {
        uint256 tokenId;
        uint256 courseId;
        uint256 knowledgeBlockId;
        uint256 credits;
        uint256 avgScore; // * 100 to keep 2 digits after comma
        uint256 status; // 0: failed; 1: passed
    }

    struct NftGraduation {
        uint256 tokenId;
        uint256 studentTokenId;
    }

    struct NftIdentity {
        uint256 tokenId;
        address register;
        uint256 expiredAt;
    }

    struct NftIdentityResponse {
        NftIdentity nftIdentity;
        string tokenURI;
        uint256 role;
        bool isExpired;
    }
}
