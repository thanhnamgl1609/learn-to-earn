// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;

import "./base/ERC721BaseContract.sol";
import "./interfaces/INftClassRegistration.sol";
import "./interfaces/INftIdentities.sol";
import "./interfaces/INftCompleteCourses.sol";
import "./interfaces/ISchool.sol";

contract NftClassRegistration is ERC721BaseContract, INftClassRegistration {
    ISchool private _school;
    INftIdentities private _nftIdentities;
    INftCompleteCourses private _nftCompleteCoures;

    bool private _isInitialize;
    address private immutable _schoolAccount;

    NftClassRegistration[] private _allNftClassRegistrations;
    mapping(uint256 => uint256) private _posOfNftClassRegistrationTokenId;
    // REMOVE when have certificate
    mapping(uint256 => uint256[]) private _registeredClassTokenIdsOfStudent;
    mapping(uint256 => mapping(uint256 => uint256))
        private _registeredCourseOfStudent;
    mapping(uint256 => uint256[]) private _studentTokenIdsOfClass; // KEEP
    mapping(uint256 => bool) private _allowedExchangeToken;

    event NewClassRegistrationCreated(uint256 classId);
    event ClassRegistrationRegained(uint256 classId);

    modifier onlyOwner() {
        require(_owner == msg.sender);
        _;
    }

    modifier onlyNftCompleteCourses() {
        require(msg.sender == address(_nftCompleteCoures));
        _;
    }

    constructor(
        address nftIdentities,
        address school,
        address schoolAccount
    ) ERC721BaseContract("NftClassRegistration", "NCR") {
        _isInitialize = false;
        _nftIdentities = INftIdentities(nftIdentities);
        _school = ISchool(school);
        _schoolAccount = schoolAccount;
    }

    function initialize(address nftCompleteCoures) public onlyOwner {
        require(!_isInitialize);
        _isInitialize = true;
        _nftCompleteCoures = INftCompleteCourses(nftCompleteCoures);
    }

    // Register class block: start
    function getRegisteredClasses()
        public
        view
        returns (NftClassRegistration[] memory)
    {
        NftIdentityResponse memory nftIdentityResponse = _nftIdentities
            .getNftOfMemberWithRole(uint256(ROLE.STUDENT), msg.sender);
        uint256 studentTokenId = nftIdentityResponse.nftIdentity.tokenId;
        uint256[]
            memory nftClassRegistrationTokenIds = _registeredClassTokenIdsOfStudent[
                studentTokenId
            ];
        uint256 count = nftClassRegistrationTokenIds.length;

        NftClassRegistration[]
            memory nftClassRegistrations = new NftClassRegistration[](count);

        for (uint256 idx = 0; idx < count; ++idx) {
            nftClassRegistrations[idx] = getNftClassRegistration(
                nftClassRegistrationTokenIds[idx]
            );
        }

        return nftClassRegistrations;
    }

    function getNftClassRegistration(
        uint256 tokenId
    ) public view returns (NftClassRegistration memory) {
        uint256 posOfNft = _posOfNftClassRegistrationTokenId[tokenId];
        require(posOfNft > 0, "NCR-ERR-00");

        return _allNftClassRegistrations[posOfNft - 1];
    }

    function getStudentListOfClass(
        uint256 classId
    ) public view returns (NftIdentityResponse[] memory) {
        uint256 count = _studentTokenIdsOfClass[classId].length;
        NftIdentityResponse[] memory result = new NftIdentityResponse[](count);

        for (uint256 idx; idx < count; ++idx) {
            result[idx] = _nftIdentities.getNftOfTokenId(
                _studentTokenIdsOfClass[classId][idx]
            );
        }

        return result;
    }

    function getNumberOfRegisteredStudent(
        uint256 classId
    ) external view returns (uint256) {
        return _studentTokenIdsOfClass[classId].length;
    }

    function allowRequestNftCompleteCourse(
        uint256 tokenId,
        bool isAllowed
    ) public {
        NftClassRegistration
            memory nftClassRegistration = getNftClassRegistration(tokenId);
        NftIdentityResponse memory nftIdentityResponse = _nftIdentities
            .getNftOfMemberWithRole(uint256(ROLE.TEACHER), msg.sender);
        Class memory class = _school.getClassById(nftClassRegistration.classId);
        require(
            !isAllowed ||
                _registeredCourseOfStudent[nftClassRegistration.studentTokenId][
                    class.courseId
                ] >
                0,
            "NCR-ERR-02"
        );
        require(class.completeAt > block.timestamp, "NCR-ERR-03");
        require(!nftIdentityResponse.isExpired, "C-ERR-01");
        require(
            class.teacherTokenId == nftIdentityResponse.nftIdentity.tokenId,
            "C-ERR-02"
        );
        _allowedExchangeToken[tokenId] = isAllowed;

        if (!isAllowed) {
            delete _registeredCourseOfStudent[
                nftClassRegistration.studentTokenId
            ][class.courseId];
        }
    }

    function allowRequestNftCompleteCourses(
        uint256[] memory tokenIds,
        bool[] memory allowedList
    ) public {
        require(tokenIds.length == allowedList.length, "C-ERR-03");
        uint256 count = tokenIds.length;
        NftIdentityResponse memory nftIdentityResponse = _nftIdentities
            .getNftOfMemberWithRole(uint256(ROLE.TEACHER), msg.sender);
        require(!nftIdentityResponse.isExpired, "C-ERR-01");
        for (uint256 idx; idx < count; ++idx) {
            uint256 tokenId = tokenIds[idx];
            bool isAllowed = allowedList[idx];

            NftClassRegistration
                memory nftClassRegistration = getNftClassRegistration(tokenId);
            Class memory class = _school.getClassById(
                nftClassRegistration.classId
            );
            require(
                !isAllowed ||
                    _registeredCourseOfStudent[
                        nftClassRegistration.studentTokenId
                    ][class.courseId] >
                    0,
                "NCR-ERR-02"
            );
            require(class.completeAt > block.timestamp, "NCR-ERR-03");
            require(
                class.teacherTokenId == nftIdentityResponse.nftIdentity.tokenId,
                "C-ERR-02"
            );
            _allowedExchangeToken[tokenId] = isAllowed;

            if (!isAllowed) {
                delete _registeredCourseOfStudent[
                    nftClassRegistration.studentTokenId
                ][class.courseId];
            }
        }
    }

    function registerClass(uint256 classId, string memory uri) public payable {
        NftIdentityResponse memory nftIdentityResponse = _nftIdentities
            .getNftOfMemberWithRole(uint256(ROLE.STUDENT), msg.sender);
        uint256 studentTokenId = nftIdentityResponse.nftIdentity.tokenId;
        Class memory class = _school.getClassById(classId);
        (uint256 registeredStartAt, uint256 registeredEndAt) = _school
            .getRegisterTime(class.semester);

        require(!nftIdentityResponse.isExpired, "C-ERR-01");
        require(
            _studentTokenIdsOfClass[class.id].length < class.maxSize,
            "NCR-ERR-01"
        );
        require(block.timestamp >= registeredStartAt, "NCR-ERR-05");
        require(block.timestamp <= registeredEndAt, "NCR-ERR-05");
        require(
            class.prevCourseId == 0 ||
                _nftCompleteCoures.checkCompleteCourse(
                    class.prevCourseId,
                    msg.sender
                ),
            "NCR-ERR-06"
        );
        require(
            _registeredCourseOfStudent[studentTokenId][class.courseId] == 0,
            "NCR-ERR-07"
        );
        require(msg.value == class.registerClassFee);
        uint256 tokenId = _mintToken(msg.sender, uri);
        _allNftClassRegistrations.push(
            NftClassRegistration(tokenId, classId, studentTokenId)
        );
        _posOfNftClassRegistrationTokenId[tokenId] = _allNftClassRegistrations
            .length;
        _registeredClassTokenIdsOfStudent[studentTokenId].push(tokenId);
        _registeredCourseOfStudent[studentTokenId][class.courseId] = tokenId;
        _studentTokenIdsOfClass[class.id].push(studentTokenId);
        payable(_schoolAccount).transfer(msg.value);

        emit NewClassRegistrationCreated(tokenId);
    }

    function regainV2(
        address sender,
        uint256 tokenId
    ) public onlyNftCompleteCourses returns (Class memory, NftIdentity memory) {
        require(_allowedExchangeToken[tokenId], "NCC-ERR-03");

        NftIdentityResponse memory nftIdentityResponse = _nftIdentities
            .getNftOfMemberWithRole(uint256(ROLE.STUDENT), sender);
        require(!nftIdentityResponse.isExpired, "C-ERR-01");

        NftClassRegistration
            memory nftClassRegistration = getNftClassRegistration(tokenId);
        require(
            nftClassRegistration.studentTokenId ==
                nftIdentityResponse.nftIdentity.tokenId,
            "NCR-ERR-04"
        );

        Class memory class = _school.getClassById(nftClassRegistration.classId);

        _regainNft(nftClassRegistration, class, tokenId);
        return (class, nftIdentityResponse.nftIdentity);
    }

    function _regainNft(
        NftClassRegistration memory nftClassRegistration,
        Class memory class,
        uint256 tokenId
    ) private {
        _burn(tokenId);
        _removeClassTokenFromRegisteredList(
            nftClassRegistration.studentTokenId,
            tokenId
        );
        _removeNftClassRegistration(tokenId);
        delete _registeredCourseOfStudent[nftClassRegistration.studentTokenId][
            class.courseId
        ];
    }

    function _removeClassTokenFromRegisteredList(
        uint256 studentTokenId,
        uint256 tokenId
    ) private {
        uint256 count = _registeredClassTokenIdsOfStudent[studentTokenId]
            .length;
        uint256 idxOfToken = 0;

        for (uint256 idx; idx < count; ++idx) {
            if (
                _registeredClassTokenIdsOfStudent[studentTokenId][idx] ==
                tokenId
            ) {
                idxOfToken = idx;
                break;
            }
        }
        _registeredClassTokenIdsOfStudent[studentTokenId][
            idxOfToken
        ] = _registeredClassTokenIdsOfStudent[studentTokenId][count - 1];
        _registeredClassTokenIdsOfStudent[studentTokenId].pop();
    }

    function _removeNftClassRegistration(uint256 tokenId) private {
        uint256 pos = _posOfNftClassRegistrationTokenId[tokenId];
        uint256 count = _allNftClassRegistrations.length;

        if (count > pos) {
            NftClassRegistration memory lastNft = _allNftClassRegistrations[
                count - 1
            ];
            _allNftClassRegistrations[pos - 1] = lastNft;
            _posOfNftClassRegistrationTokenId[lastNft.tokenId] = pos;
        }
        delete _posOfNftClassRegistrationTokenId[tokenId];
        _allNftClassRegistrations.pop();
    }
}
