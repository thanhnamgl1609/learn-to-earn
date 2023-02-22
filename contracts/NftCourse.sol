pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./NftGraduation.sol";

contract NftSchool is ERC721URIStorage, Ownable {
	enum CourseType {
		General,
		Foundation,
		Specialized,
		SpecializedElective,
		Elective
	}
	
	struct CourseGroup {
		uint256 id;
		string name;
		CourseType type;
	}

	struct Course {
		uint256 id;
		uint256 teacherId;
		uint256 groupId; // belongs to CourseGroupId?
		uint256 credits;
    	uint256 size; // to limit the nft course minted
	}

	struct Teacher {
		string name;
	}

	struct NftItem {
		uint256 tokenId;
		string studentId;
		uint256 courseId;
	}

	NftGraduation private immutable _graduationContract;
 
	// Course
	Course[] private _allCourses;
	mapping(id => Course) private _idToCourse;

	// Course
	Course[] private _allCourses;
	mapping(id => Course) private _idToCourse;

	// Nft Course
	// studentId => type => NftCourse?
	NftItem[] private _allNftItems;
	mapping(string => NftItem) private _idToNftItem; // tokenId =>NftItem 
	mapping(string => mapping(type => uint256[])) private _completedCourse;

	mapping(uint256 => address) private _idToTeacherAddress;
 
	modifier onlyTeacher(uint256 courseId) {
		require(teacherAddressOf(courseId).registeredAddress, 'access denied');
	}
 
	constructor() ER721("CourseNFT", "CNFT") {
		_graduationContract = new NftGraduation();
	}
  
	function teacherAddressOf(uint256 courseId) {
		Course memory course = _idToCourse[courseId].teacherId;

		return _idToTeacherAddress[teacherId];
	}

	/*
		Register teacher + register course
		> Create course => Teacher can access the course
	*/
	function registerTeacher() public onlyOwner {

	}
	
	function createCourseGroup() public onlyOwner {

	}

	function createCourse() public onlyOwner {

	} 

	/*
		?? should check an appropriate time?
	*/
	function mintToken() public onlyTeacher(courseId) {

	}
}