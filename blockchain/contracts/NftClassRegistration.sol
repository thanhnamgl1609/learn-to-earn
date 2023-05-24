// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./ERC721BaseContract.sol";
import "./interfaces/INftClassRegistration.sol";
import "./interfaces/INftIdentities.sol";
import "./interfaces/INftCertificates.sol";
import "./interfaces/INftSchool.sol";

contract NftClassRegistration is ERC721BaseContract, INftClassRegistration {
    INftSchool private _nftSchool;
    INftIdentities private _nftIdentities;
    INftCertificates private _nftCertificates;

    mapping(uint256 => uint256) private _registeredStartAt;
    mapping(uint256 => uint256) private _registeredEndAt;

    mapping(uint256 => uint256[]) private _classIdByRegisterTime;
    mapping(uint256 => mapping(string => uint256)) private _idOfURIOfType;

    NftClassRegistration[] private _allNftClassRegistrations;
    mapping(uint256 => uint256) private _posOfNftClassRegistrationTokenId;
    mapping(uint256 => uint256[]) private _registeredClassTokenIdOfStudent; // REMOVE when have certificate?
    mapping(uint256 => mapping(uint256 => uint256))
        private _registeredCourseOfStudent; // REMOVE when have certificate?
    mapping(uint256 => uint256[]) private _registeredTokenIdOfClass; // KEEP

    mapping(uint256 => mapping(uint256 => uint256)) _posOfTokenIdOfNftType;

    event NewClassRegistrationCreated(uint256 classId);

    modifier onlyOwner() {
        require(_owner == msg.sender);
        _;
    }

    constructor(
        address nftIdentities,
        address nftSchool,
        address nftCertificates
    ) ERC1155BaseContract("") {
        _nftIdentities = INftIdentities(nftIdentities);
        _nftSchool = INftSchool(nftSchool);
        _nftCertificates = INftCertificates(nftCertificates);
    }

    // function getCurrentRegisteredClasses(
    //     uint256 semester
    // ) external view returns (ClassResponse[] memory) {
    //     uint256[] memory ids = _classIdByRegisterTime[semester];
    //     uint256 count = ids.length;
    //     ClassResponse[] memory classes = new ClassResponse[](count);

    //     for (uint256 idx; idx < count; ++idx) {
    //         classes[idx] = _getClassByIdx(_posOfClasses[ids[idx]] - 1);
    //     }

    //     return classes;
    // }

    // Register class block: start
    function getRegisteredClasses()
        public
        view
        returns (NftClassRegistrationResponse[] memory)
    {
        NftIdentityResponse memory nftIdentityResponse = _nftIdentities
            .getNftOfMemberWithRole(uint256(ROLE.STUDENT), msg.sender);
        uint256 studentTokenId = nftIdentityResponse.nftIdentity.tokenId;
        uint256[]
            memory nftClassRegistrationTokenIds = _registeredClassTokenIdOfStudent[
                studentTokenId
            ];
        uint256 count = nftClassRegistrationTokenIds.length;

        NftClassRegistrationResponse[]
            memory nftClassRegistrationResponses = new NftClassRegistrationResponse[](
                count
            );

        for (uint256 idx = 0; idx < count; ++idx) {
            NftClassRegistration
                memory nftClassRegistration = getNftClassRegistration(
                    nftClassRegistrationTokenIds[idx]
                );

            nftClassRegistrationResponses[idx] = NftClassRegistrationResponse(
                nftClassRegistration,
                getClassById(nftClassRegistration.classId).class,
                uri(nftClassRegistration.tokenId)
            );
        }

        return nftClassRegistrationResponses;
    }

    function getNftClassRegistration(uint256 tokenId) public view returns (NftClassRegistration memory) {
        uint256 posOfNft = _posOfNftClassRegistrationTokenId[tokenId];
        require(posOfNft > 0);

        return _allNftClassRegistrations[posOfNft - 1];
    }

    // function getStudentListOfClass(
    //     uint256 id
    // ) public view returns (NftIdentityResponse[] memory) {
    //     uint256 count = _registeredClassTokenIdOfStudent[id].length;
    //     NftIdentityResponse[] memory result = new NftIdentityResponse[](count);

    //     for (uint256 idx; idx < count; ++idx) {
    //         result[idx] = _nftIdentities.getNftOfTokenId(
    //             _registeredClassTokenIdOfStudent[id][idx]
    //         );
    //     }

    //     return result;
    // }

    function registerClass(uint256 classId, string memory uri) public payable {
        NftIdentityResponse memory nftIdentityResponse = _nftIdentities
            .getNftOfMemberWithRole(uint256(ROLE.STUDENT), msg.sender);
        uint256 studentTokenId = nftIdentityResponse.nftIdentity.tokenId;
        Class memory class = getClassById(classId).class;
        (uint256 registerStartAt, uint256 registerEndAt) = _nftSchool.getRegisterTime(class.semester);

        require(!nftIdentityResponse.isExpired);
        require(_registeredTokenIdOfClass[class.id].length < class.maxSize);
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
        require(msg.value == registerClassFee);
        uint256 tokenId = _mintToken(msg.sender, uri);
        _allNftClassRegistrations.push(
            NftClassRegistration(tokenId, classId, studentTokenId)
        );
        _posOfNftClassRegistrationTokenId[tokenId] = _allNftClassRegistrations
            .length;
        _registeredClassTokenIdOfStudent[studentTokenId].push(tokenId);
        _registeredCourseOfStudent[studentTokenId][class.courseId] = tokenId;
        _registeredTokenIdOfClass[class.id].push(tokenId);

        emit NewClassRegistrationCreated(tokenId);
    }
}
