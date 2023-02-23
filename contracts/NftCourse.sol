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
		require(_addressToRegisteredTeacher[msg.sender].registeredDate == 0, 'You has registered');
		require(_addressToApprovedTeacher[teacherAddress].registeredDate == 0, 'You has been approved');
		require(_registeredTeacherCount.current() < REGISTERED_TEACHER_LIMIT, 'Too many waiting request. Please try again later.');
		// chainlink to call recheckRegisteredTeacher();
		// TODO : should use id for teacher?
		_registeredTeacherCount.increment();
		_allRegisteredTeachers[_registeredTeacherCount.current()] = new Teacher(); // TODO
	}

	function approveTeacher(address teacherAddress) public onlyOwner { // Send back (? Lost)
		require(_addressToApprovedTeacher[teacherAddress].registeredDate == 0, 'Teacher has been registered');
		require(_addressToRegisteredTeacher[teacherAddress].registeredDate > 0, 'Teacher has not been registered');

		Teacher memory teacher = _registeredTeacher[teacherAddress];
		delete _registeredTeacher[teacherAddress];

		// TODO
		// _addressToApprovedTeacher[teacherAddress] = 
	}

	// Use chainlink to remove registered teacher after 30 days if he/she is not registered
	// function recheckRegisteredTeacher() public onlyOwner {
		// require(_approvedTeacher[msg.sender].registeredDate == 0)
	// }

	function rejectRegisteredTeacher() public onlyOwner {

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