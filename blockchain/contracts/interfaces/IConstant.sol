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
        string name;
        uint256 credits;
    }

    struct Course { // cannot be burn if exist any nft classes belongs to it
        uint256 id;
        uint256 knowledgeBlockId; // cannot be updated
        uint256 prevCourseId;
        uint256 credits;
        uint256 status; // 0: opened, 1: closed
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
        uint256 registeredStartAt;
        uint256 registeredEndAt;
        uint256 completeAt; // end time - editable
        uint256[] requiredScore; // 1, 2, 3, 4, 5 - some score (like pracice can be unused)
        uint256 maxSize;
        uint256 teacherTokenId;
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

    struct NftScoreBoard {
        uint256 tokenId;
        uint256 classId;
        uint256 courseId;
        uint256 knowledgeBlockId;
        uint256 credits;
        uint256 completeAt; // end time - editable
        uint256 studentTokenId;
        uint256 teacherTokenId;
        uint256[] requiredScore; // accumulate all score and divide by length to get avarage
        uint256[] scores; // type => score value (GK: 5)
        /*
            Metadata:
                - Student info (name + tokenId)
                - Required Scores (GK, CK, ...)
                - Class info
        */
    }

    struct NftCompleteCourse {
        uint256 tokenId;
        uint256 courseId;
        uint256 knowledgeBlockId;
        uint256 credits;
        uint256 avgScore; // * 100 to keep 2 digits after comma
        /* Metadata:
            - Teacher name - Nft Id?
            - Course name
            - Course group name?
            - Start at
            - CompleteAt (datetime)
            - Credits
            - Scores -- where?
        */
    }

    struct NftGraduation {
        uint256 tokenId;
        /*
            Metadata:
                - Student name
                - Student token ID
                - Courses + Scores (detail?)
                - Final average score
        */
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
