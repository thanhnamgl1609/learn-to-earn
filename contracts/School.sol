// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Type.sol";

contract School is Ownable {
    using Counters for Counters.Counter;

    // enum CourseType {
    //     General,
    //     Foundation,
    //     Specialized,
    //     SpecializedElective,
    //     Elective
    // }

    struct Teacher {
        uint256 registeredDate;
        address registeredAddress;
        string metadata;
    }

    uint8 private REGISTERED_TEACHER_LIMIT = 100;
    bool private _isInitialized;
    bool public canRegistered;
    bool public canGetNftGraduation;
    Type.Requirement[] private _graduationRequirements;
    mapping(uint256 => uint256) private _idToGraduationRequirementIndex;
 
    // Course
    Counters.Counter private _courseCount;
    Counters.Counter private _courseIds;
    Type.Course[] private _allCourses;
    mapping(uint256 => uint256) private _idToCourseIndex;

    // Metadata = Course group
    string[] private _courseGroups;
    mapping(string => bool) private _registeredCourseGroups;
    // Registered teacher
    Teacher[] private _allRegisteredTeachers;
    Teacher[] private _allApprovedTeachers;
    mapping(address => uint256) private _addressToRegisteredTeacherIndex;
    mapping(address => uint256) private _addressToApprovedTeacherIndex;

    modifier onlyInitialized {
        require(_isInitialized, "Contract haven't been initialized yet");
        _;
    }

    modifier allowRegistered {
        require(canRegistered, "It's not time to register");
        _;
    }

    modifier allowGetNftGraduation {
        require(canGetNftGraduation, "It's not time to exchange nft graduation");
        _;
    }
    
    modifier onlyTeacher(uint256 courseId) {
        require(teacherAddressOf(courseId) == address(0), 'access denied');
        _;
    }
    
    constructor() {}

    function initialize(uint256[] memory courseGroupIds, uint256[] memory credits) public onlyOwner {
        require(courseGroupIds.length == credits.length, 'Invalid input');
        // start, stop of year?
        uint256 requirementLength = courseGroupIds.length;
        for (uint256 index = 0; index < requirementLength; ++index) {
            if (credits[index] < 1) {
                revert('Invalid credits input');
            }
            Type.Requirement memory requirement = Type.Requirement(courseGroupIds[index], credits[index]);
            _graduationRequirements.push(requirement);
            _idToGraduationRequirementIndex[requirement.courseGroupId] = _graduationRequirements.length;
        }

        _isInitialized = true;
        canRegistered = true;
        canGetNftGraduation = true;
    }

    function getAllRequirements() public view returns (Type.Requirement[] memory requirements) {
        return _graduationRequirements;
    }

    function getAllRegisteredTeachers() public view onlyOwner returns (Teacher[] memory) {
        return _allRegisteredTeachers;
    }

    function getAllApprovedTeachers() public view returns (Teacher[] memory) {
        return _allApprovedTeachers;
    }

    function getAllCourses() public view returns (Type.Course[] memory) {
        return _allCourses;
    }

    function getCourse(uint256 courseId) public view returns (Type.Course memory) {
        require(_idToCourseIndex[courseId] > 0, "Course is not exist");
        uint256 courseIndex = _idToCourseIndex[courseId];
        Type.Course memory course = _allCourses[courseIndex - 1];

        return course;
    }

    /* Teacher section: start
    Can create smart contract inherit ChainLink to manage teacher
    */
    function teacherAddressOf(uint256 courseId) public view returns (address) {
        Type.Course memory course = getCourse(courseId);

        return course.teacherAddress;
    }

    function registerTeacher(string memory metadata) public allowRegistered { // Use payable? (? Lost)
        require(msg.sender != owner(), "Owner cannot register");
        require(_addressToRegisteredTeacherIndex[msg.sender] == 0, 'You has registered');
        require(_addressToApprovedTeacherIndex[msg.sender] == 0, 'You has been approved');
        require(_allRegisteredTeachers.length < REGISTERED_TEACHER_LIMIT, 'Too many waiting request. Please try again later.');
        // Idea:  chainlink to call recheckRegisteredTeacher() => auto reject after a while;

        uint256 currentIndex = _allRegisteredTeachers.length;
        _allRegisteredTeachers.push(Teacher(block.timestamp, msg.sender, metadata));
        _addressToRegisteredTeacherIndex[msg.sender] = currentIndex + 1;

        // EVENT
    }

    function approveTeacher(address teacherAddress) public onlyOwner { // Send back (? Lost)
        require(_addressToApprovedTeacherIndex[teacherAddress] == 0, 'Teacher has been approved');
        require(_addressToRegisteredTeacherIndex[teacherAddress] > 0, 'Teacher has not been registered');

        uint256 teacherIndex = _addressToRegisteredTeacherIndex[teacherAddress];
        uint256 lastTeacherIndex = _allRegisteredTeachers.length;
        Teacher memory teacher = _allRegisteredTeachers[teacherIndex - 1];

        // remove teacher from register list
        if (teacherIndex != lastTeacherIndex) {
            Teacher memory lastTeacher = _allRegisteredTeachers[lastTeacherIndex];
            _allRegisteredTeachers[teacherIndex - 1] = lastTeacher;
            _addressToRegisteredTeacherIndex[lastTeacher.registeredAddress] = teacherIndex;
        }

        delete _addressToRegisteredTeacherIndex[teacherAddress];
        _allRegisteredTeachers.pop();

        // add teacher to approve list
        uint256 currentIndex = _allApprovedTeachers.length;
        _addressToApprovedTeacherIndex[teacherAddress] = currentIndex + 1;
        _allApprovedTeachers.push(teacher);

        // EVENT
    }

    function removeTeacher(address teacherAddress) public onlyOwner {
        require(_addressToApprovedTeacherIndex[teacherAddress] > 0, "Teacher doesn't exist");
        // Check if teacher currently has class?
        uint256 teacherIndex = _addressToApprovedTeacherIndex[teacherAddress];
        uint256 lastTeacherIndex = _allApprovedTeachers.length;

        if (teacherIndex != lastTeacherIndex) {
            Teacher memory lastTeacher = _allApprovedTeachers[lastTeacherIndex];
            _allApprovedTeachers[teacherIndex - 1] = lastTeacher;
            _addressToApprovedTeacherIndex[lastTeacher.registeredAddress] = teacherIndex;
        }

        delete _addressToApprovedTeacherIndex[teacherAddress];
        _allApprovedTeachers.pop();

        // EVENT
    }

    // Idea:  Use chainlink to remove registered teacher after 30 days if he/she is not registered
    // function recheckRegisteredTeacher() public onlyOwner {
        // require(_approvedTeacher[msg.sender].registeredDate == 0)
    // }

    function rejectTeacher(address teacherAddress) public onlyOwner {
        // Idea: Add address to blacklist in a particular time => prevent address from registering in a while?
        require(_addressToRegisteredTeacherIndex[teacherAddress] > 0, "Teacher doesn't exist");
        uint256 teacherIndex = _addressToRegisteredTeacherIndex[teacherAddress];
        uint256 lastTeacherIndex = _allRegisteredTeachers.length;

        if (teacherIndex != lastTeacherIndex) {
            Teacher memory lastTeacher = _allRegisteredTeachers[lastTeacherIndex];
            _allRegisteredTeachers[teacherIndex - 1] = lastTeacher;
            _addressToRegisteredTeacherIndex[lastTeacher.registeredAddress] = teacherIndex;
        }

        delete _addressToRegisteredTeacherIndex[teacherAddress];
        _allRegisteredTeachers.pop();

        // EVENT
    }
    // Teacher section: end
    

    function createCourse(
        address teacherAddress,
        uint256 credits,
        uint256 nftCounts,
        uint256 courseGroupId, // -> course group?
        string memory metadata
    ) public onlyOwner onlyInitialized returns (uint256) {
        require(_addressToApprovedTeacherIndex[teacherAddress] > 0, 'Teacher must register before assignment');
        require(_idToGraduationRequirementIndex[courseGroupId] > 0, 'Course Group is invalid');
        require(credits > 0, 'Credits must be a positive number');
        require(nftCounts > 0, 'Nft Count must be a positive number');

        _courseCount.increment();
        _courseIds.increment();
        uint256 currentId = _courseIds.current();
        uint256 currentIndex = _allCourses.length;
        Type.Course memory course = Type.Course(
            currentId,
            teacherAddress,
            credits,
            nftCounts,
            courseGroupId,
            metadata,
            Type.CourseStatus.InProgress
        );

        _idToCourseIndex[currentId] = currentIndex + 1;
        _allCourses.push(course);

        // EVENT
        return currentId;
    }

    function completeCourse(
        uint256 courseId
    ) public onlyTeacher(courseId) {
        uint256 courseIndex = _idToCourseIndex[courseId];
        _allCourses[courseIndex].status = Type.CourseStatus.Complete;
    }
}
