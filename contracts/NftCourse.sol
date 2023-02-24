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
	private const REGISTERED_TEACHER_LIMIT = 100;

	struct Course {
		uint256 id;
		address teacherAddress;
		uint256 credits;
    	uint256 size; // to limit the nft course minted
		string metaData; // teacher name + course name
		CourseType type;
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
	Course[] private _allCourses;
	mapping(id => Course) private _idToCourseIndex;

	// Nft Course
	// studentId => type => NftCourse?
	NftItem[] private _allNftItems;
	mapping(string => uint256) private _idToNftIndex; // tokenId =>NftItem 
	mapping(string => mapping(type => uint256[])) private _completedCourse;

	// Registered teacher
    Counters.Counter private _registeredTeacherCount;
    Counters.Counter private _approvedTeacherCount;
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
		require(_registeredTeacherCount.current() < REGISTERED_TEACHER_LIMIT, 'Too many waiting request. Please try again later.');
		// Idea:  chainlink to call recheckRegisteredTeacher();

		_registeredTeacherCount.increment();
		uint256 currentIndex = _registeredTeacherCount.current();
		_allRegisteredTeachers[currentIndex] = new Teacher(now(), msg.sender, metadata);
		_addressToApprovedTeacherIndex[msg.sender] = currentIndex;
	}

	function approveTeacher(address teacherAddress) public onlyOwner { // Send back (? Lost)
		require(_addressToApprovedTeacherIndex[teacherAddress] == 0, 'Teacher has been registered');
		require(_addressToRegisteredTeacherIndex[teacherAddress] > 0, 'Teacher has not been registered');

		uint256 teacherIndex = _addressToRegisteredTeacherIndex[teacherAddress];
		uint256 lastTeacherIndex = _registeredTeacherCount.current();
		Teacher memory teacher = _allRegisteredTeachers[teacherIndex];

		// remove teacher from register list
		delete _addressToRegisteredTeacherIndex[teacherAddress];
		if (teacherIndex != lastTeacherIndex) {
			Teacher memory lastTeacher = _allRegisteredTeachers[lastTeacherIndex];
			_allRegisteredTeachers[teacherIndex] = lastTeacher;
			_addressToRegisteredTeacherIndex[lastTeacher.teacherAddress] = teacherIndex;
		}
		delete _allRegisteredTeachers[lastTeacherIndex];

		// add teacher to approve list
		_approvedTeacherCount.increment();
		uint256 currentIndex = _approvedTeacherCount.current();
		_addressToApprovedTeacherIndex[teacherAddress] = currentIndex;
		_allApprovedTeachers.push(teacher);
	}

	function removeTeacher(address teacherAddress) public onlyOwner {
		// Check if teacher currently has class?
		uint256 teacherIndex = _addressToApprovedTeacherIndex[teacherAddress];
		uint256 lastTeacherIndex = _approvedTeacherCount.current();
		delete _addressToApprovedTeacherIndex[teacherAddress];
		if (teacherIndex != lastTeacherIndex) {
			Teacher memory lastTeacher = _allApprovedTeachers[lastTeacherIndex];
			_allApprovedTeachers[teacherIndex] = lastTeacher;
			_addressToApprovedTeacherIndex[lastTeacher.teacherAddress] = teacherIndex;
		}
		delete _addressToApprovedTeacherIndex[lastTeacherIndex];
	}

	// Idea:  Use chainlink to remove registered teacher after 30 days if he/she is not registered
	// function recheckRegisteredTeacher() public onlyOwner {
		// require(_approvedTeacher[msg.sender].registeredDate == 0)
	// }

	function rejectRegisteredTeacher() public onlyOwner {
		// Idea: Add address to blacklist in a particular time => prevent address from registering in a while?
		uint256 teacherIndex = _addressToApprovedTeacherIndex[teacherAddress];
		uint256 lastTeacherIndex = _approvedTeacherCount.current();
		delete _addressToApprovedTeacherIndex[teacherAddress];
		if (teacherIndex != lastTeacherIndex) {
			Teacher memory lastTeacher = _allApprovedTeachers[lastTeacherIndex];
			_allApprovedTeachers[teacherIndex] = lastTeacher;
			_addressToApprovedTeacherIndex[lastTeacher.teacherAddress] = teacherIndex;
		}
		delete _addressToApprovedTeacherIndex[lastTeacherIndex];
	}
	// Teacher section: end
	

	function createCourse() public onlyOwner {

	} 

	/*
		?? should check an appropriate time?
	*/
	function mintToken() public onlyTeacher(courseId) {

	}
}