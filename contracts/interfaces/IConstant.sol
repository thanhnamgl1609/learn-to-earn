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

    struct NftRequirement {
        uint256 tokenId;
        uint256 credits;
        /*
            Metadata:
                - name
        */
    }

    struct NftCourseTemplate { // cannot be burn if exist any nft classes belongs to it
        uint256 tokenId;
        uint256 requirementId; // cannot be updated
        uint256 credits;
        /*
            Metadata:
                - Requirement name
                - Course name
        */
    }
    
    struct NftClass {
        uint256 tokenId;
        uint256 courseTemplateId; // courseId - requirementId
        uint256 requirementId; // courseId - requirementId
        uint256 credits;
        uint256 registeredStartAt;
        uint256 registeredEndAt;
        uint256 completeAt; // end time - editable
        uint256[] requiredScore; // 1, 2, 3, 4, 5 - some score (like pracice can be unused)
        uint256 maxSize;
        address teacherAddr;
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
        uint256 courseTemplateId;
        uint256 requirementId;
        uint256 credits;
        uint256 completeAt; // end time - editable
        address studentAddr;
        address teacherAddr;
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
        uint256 courseTemplateId;
        uint256 requirementId;
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
}
