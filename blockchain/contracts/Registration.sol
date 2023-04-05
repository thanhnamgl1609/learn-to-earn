// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;
import "./utils/ArraySearch.sol";

contract Registration {
    using ArraySearch for uint256[];

    struct RegistrationInfo {
        address applicant;
        string documentURI;
    }

    struct RegistrationInfoResponse {
        RegistrationInfo detail;
        uint256 role;
    }

    uint256 constant REGISTRATION_START_AT = 200;
    address internal _owner;

    mapping(uint256 => RegistrationInfo[]) internal _registers; // Role => address
    mapping(uint256 => mapping(address => uint256))
        internal _positionOfRegisters; // Role => address => position

    mapping(uint256 => bool) internal _hasRole;
    mapping(address => uint256[]) internal _rolesOfRegister;
    mapping(string => bool) internal _registeredDocumentURI;

    modifier onlyOwner() {
        require(msg.sender == _owner);
        _;
    }

    modifier hasRegistered(address addr, uint256 role) {
        require(_positionOfRegisters[role][addr] > 0, "Not registered");
        _;
    }

    modifier allowedRole(uint256 role) {
        require(_hasRole[role], "Role doesn't not exist");
        _;
    }

    function getAllOwnedRegistrationInfos()
        public
        view
        returns (RegistrationInfoResponse[] memory)
    {
        uint256 len = _rolesOfRegister[msg.sender].length;
        RegistrationInfoResponse[] memory registrationInfos = new RegistrationInfoResponse[](
            len
        );
        for (uint256 roleIdx; roleIdx < len; ++roleIdx) {
            uint256 role = _rolesOfRegister[msg.sender][roleIdx];
            uint256 pos = _positionOfRegisters[role][msg.sender];
            registrationInfos[roleIdx] = RegistrationInfoResponse(
                _registers[role][pos - 1],
                role
            );
        }
        return registrationInfos;
    }

    function getAllRegistrationInfosByRole(
        uint256 role
    ) public view onlyOwner returns (RegistrationInfo[] memory) {
        return _registers[role];
    }

    function _register(uint256 role, string memory documentURI) internal {
        _registers[role].push(RegistrationInfo(msg.sender, documentURI));
        _rolesOfRegister[msg.sender].push(role);
        _positionOfRegisters[role][msg.sender] = _registers[role].length;
        _registeredDocumentURI[documentURI] = true;
    }

    function _removeFromRegistersList(address addr, uint256 role) internal {
        uint256 pos = _positionOfRegisters[role][addr];
        uint256 len = _registers[role].length;
        if (pos != len) {
            // swap current with last
            RegistrationInfo memory lastRegisteredAddr = _registers[role][
                len - 1
            ];
            _registers[role][pos - 1] = lastRegisteredAddr;
            _positionOfRegisters[role][lastRegisteredAddr.applicant] = pos;
        }

        _registers[role].pop();
        _removeRoleOfRegister(addr, role);
        delete _positionOfRegisters[role][addr];
    }

    function _removeRoleOfRegister(address addr, uint256 role) private {
        uint256 rolesCount = _rolesOfRegister[addr].length;
        if (rolesCount == 0) return;
        uint256 roleIdx = rolesCount;
        for (uint256 idx; idx < rolesCount; ++idx) {
            if (role == _rolesOfRegister[addr][idx]) {
                roleIdx = idx;
                break;
            }
        }
        if (roleIdx == rolesCount) return;
        _rolesOfRegister[addr][roleIdx] = _rolesOfRegister[addr][
            rolesCount - 1
        ];
        _rolesOfRegister[addr].pop();
    }
}
