// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;

import "./ERC721BaseContract.sol";
import "./interfaces/INftClassRegistration.sol";
import "./interfaces/INftIdentities.sol";
import "./interfaces/INftCertificates.sol";
import "./interfaces/INftSchool.sol";

contract NftClassRegistration is ERC721BaseContract, INftClassRegistration {
    INftSchool private _nftSchool;
    INftIdentities private _nftIdentities;
    INftCertificates private _nftCertificates;

    bool private _isInitialize;

    NftClassRegistration[] private _allNftClassRegistrations;
    mapping(uint256 => uint256) private _posOfNftClassRegistrationTokenId;
    mapping(uint256 => uint256[]) private _registeredClassTokenIdsOfStudent; // REMOVE when have certificate?
    mapping(uint256 => mapping(uint256 => uint256))
        private _registeredCourseOfStudent; // REMOVE when have certificate?
    mapping(uint256 => uint256[]) private _studentTokenIdsOfClass; // KEEP

    event NewClassRegistrationCreated(uint256 classId);

    modifier onlyOwner() {
        require(_owner == msg.sender);
        _;
    }

    constructor(
        address nftIdentities,
        address nftSchool
    ) ERC721BaseContract("NftClassRegistration", "NCR") {
        _isInitialize = false;
        _nftIdentities = INftIdentities(nftIdentities);
        _nftSchool = INftSchool(nftSchool);
    }

    function initialize(address nftCertificates) public onlyOwner {
        require(!_isInitialize);
        _isInitialize = true;
        _nftCertificates = INftCertificates(nftCertificates);
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
        require(posOfNft > 0);

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
    ) public view returns (uint256) {
        return _studentTokenIdsOfClass[classId].length;
    }

    function registerClass(uint256 classId, string memory uri) public payable {
        NftIdentityResponse memory nftIdentityResponse = _nftIdentities
            .getNftOfMemberWithRole(uint256(ROLE.STUDENT), msg.sender);
        uint256 studentTokenId = nftIdentityResponse.nftIdentity.tokenId;
        Class memory class = _nftSchool.getClassById(classId);
        (uint256 registeredStartAt, uint256 registeredEndAt) = _nftSchool
            .getRegisterTime(class.semester);

        require(!nftIdentityResponse.isExpired);
        require(_studentTokenIdsOfClass[class.id].length < class.maxSize);
        require(block.timestamp >= registeredStartAt);
        require(block.timestamp <= registeredEndAt);
        require(
            class.prevCourseId == 0 ||
                _nftCertificates.checkCompleteCourse(
                    class.prevCourseId,
                    msg.sender
                )
        );
        require(
            _registeredCourseOfStudent[studentTokenId][class.courseId] == 0
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

        emit NewClassRegistrationCreated(tokenId);
    }
}
