pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./NftGraduation.sol";

contract NftCourse is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

	enum CourseType {
		General,
		Foundation,
		Specialized,
		SpecializedElective,
		Elective
	}

	enum CourseStatus {
		InProgress,
		Complete
	}
	private const REGISTERED_TEACHER_LIMIT = 100;

	struct Course {
		uint256 id;
		address teacherAddress;
		uint256 credits;
		uint256 remainNftCounts;
    	uint256 maxNftCounts; // to limit the nft course minted
		string courseGroup; // course group id, course name: uri
		CourseType type;
		CourseStatus status;
	}

	struct Teacher {
		uint256 registeredDate;
		address registeredAddress;
		string metadata;
	}

	struct NftItem {
		uint256 tokenId;
		string studentId;
		uint256 courseId;
	}

	NftGraduation private immutable _graduationContract;
 
	// Course
	Counters.Counter private _courseCount;
	Counters.Counter private _courseIds;
	Course[] private _allCourses;
	mapping(uint256 => uint256) private _idToCourseIndex;

	// Metadata = Course group
	string[] private _courseGroups;
	mapping(string => bool) private _registeredCourseGroups;

	// Nft Course
	// studentId => type => NftCourse?
	NftItem[] private _allNftItems;
	mapping(string => uint256) private _idToNftIndex; // tokenId =>NftItem 
	mapping(string => mapping(type => uint256[])) private _completedCourse;

	// Registered teacher
	Teacher[] _allRegisteredTeachers;
	Teacher[] _allApprovedTeachers;
	mapping(address => uint256) private _addressToRegisteredTeacherIndex;
	mapping(address => uint256) private _addressToApprovedTeacherIndex;
	// mapping(address => Teacher) private _rejectedTeacher;
 
	modifier onlyTeacher(uint256 courseId) {
		require(teacherAddressOf(courseId).registeredAddress, 'access denied');
	}
 
	event TeacherRegistered(string metadata);
 
	constructor() ER721("CourseNFT", "CNFT") {
		_graduationContract = new NftGraduation();
	}
  
	/* Teacher section: start
	Can create smart contract inherit ChainLink to manage teacher
	*/
	function teacherAddressOf(uint256 courseId) {
		Course memory course = _idToCourse[courseId].teacherId;

		return _idToTeacherAddress[teacherId];
	}

	function registerTeacher(string metadata) public { // Use payable? (? Lost)
		require(_addressToRegisteredTeacherIndex[msg.sender] == 0, 'You has registered');
		require(_addressToApprovedTeacher[teacherAddress] == 0, 'You has been approved');
		require(_allRegisteredTeachers.length < REGISTERED_TEACHER_LIMIT, 'Too many waiting request. Please try again later.');
		// Idea:  chainlink to call recheckRegisteredTeacher();

		uint256 currentIndex = _allRegisteredTeachers.length;
		_allRegisteredTeachers[currentIndex] = new Teacher(now(), msg.sender, metadata);
		_addressToApprovedTeacherIndex[msg.sender] = currentIndex;

		// EVENT
	}

	function approveTeacher(address teacherAddress) public onlyOwner { // Send back (? Lost)
		require(_addressToApprovedTeacherIndex[teacherAddress] == 0, 'Teacher has been registered');
		require(_addressToRegisteredTeacherIndex[teacherAddress] > 0, 'Teacher has not been registered');

		uint256 teacherIndex = _addressToRegisteredTeacherIndex[teacherAddress];
		uint256 lastTeacherIndex = _allRegisteredTeachers.length;
		Teacher memory teacher = _allRegisteredTeachers[teacherIndex];

		// remove teacher from register list
		delete _addressToRegisteredTeacherIndex[teacherAddress];
		if (teacherIndex != lastTeacherIndex) {
			Teacher memory lastTeacher = _allRegisteredTeachers[lastTeacherIndex];
			_allRegisteredTeachers[teacherIndex] = lastTeacher;
			_addressToRegisteredTeacherIndex[lastTeacher.registeredAddress] = teacherIndex;
		}
		delete _allRegisteredTeachers[lastTeacherIndex];

		// add teacher to approve list
		uint256 currentIndex = _allApprovedTeachers.length();
		_addressToApprovedTeacherIndex[teacherAddress] = currentIndex;
		_allApprovedTeachers.push(teacher);

		// EVENT
	}

	function removeTeacher(address teacherAddress) public onlyOwner {
		// Check if teacher currently has class?
		uint256 teacherIndex = _addressToApprovedTeacherIndex[teacherAddress];
		uint256 lastTeacherIndex = _allApprovedTeachers.length;
		delete _addressToApprovedTeacherIndex[teacherAddress];
		if (teacherIndex != lastTeacherIndex) {
			Teacher memory lastTeacher = _allApprovedTeachers[lastTeacherIndex];
			_allApprovedTeachers[teacherIndex] = lastTeacher;
			_addressToApprovedTeacherIndex[lastTeacher.registeredAddress] = teacherIndex;
		}
		delete _addressToApprovedTeacherIndex[lastTeacherIndex];

		// EVENT
	}

	// Idea:  Use chainlink to remove registered teacher after 30 days if he/she is not registered
	// function recheckRegisteredTeacher() public onlyOwner {
		// require(_approvedTeacher[msg.sender].registeredDate == 0)
	// }

	function rejectRegisteredTeacher() public onlyOwner {
		// Idea: Add address to blacklist in a particular time => prevent address from registering in a while?
		uint256 teacherIndex = _addressToRegisteredTeacherIndex[teacherAddress];
		uint256 lastTeacherIndex = _allRegisteredTeachers.length;
		delete _addressToRegisteredTeacherIndex[teacherAddress];
		if (teacherIndex != lastTeacherIndex) {
			Teacher memory lastTeacher = _registeredTeacherCount[lastTeacherIndex];
			_allRegisteredTeachers[teacherIndex] = lastTeacher;
			_addressToRegisteredTeacherIndex[lastTeacher.registeredAddress] = teacherIndex;
		}
		delete _addressToRegisteredTeacherIndex[lastTeacherIndex];

		// EVENT
	}
	// Teacher section: end
	

	function createCourse(
		address teacherAddress,
		uint256 credits,
    	uint256 remainNftCounts,
		uint256 maxNftCounts,
		string courseGroup, // -> course group?
		CourseType type
	) public onlyOwner returns (Course) {
		require(_approvedTeacher[teacherAddress] > 0, 'Teacher must register before assignment');

		_courseCount.increment();
		_courseIds.increment();
		uint256 currentId = _courseIds.current();
		uint256 currentIndex = _allCourses.length;
		_idToCourseIndex[currentId] = currentIndex;
		_allCourses.push(
			new Course(
				currentId,
				teacherAddress,
				credits,
				remainNftCounts,
				maxNftCounts,
				courseGroup,
				type,
				CourseStatus.InProgress
			)
		);

		// EVENT
	}

	function completeCourse(
		uint256 courseId,
	) public onlyTeacher(courseId) {
		uint256 couresIndex = _idToCourseIndex[courseId];
		_allCourses[courseId] = CourseStatus.Complete;
	}

	/*
		?? should check an appropriate time?
	*/
	function mintToken() public onlyTeacher(courseId) {

	}
}