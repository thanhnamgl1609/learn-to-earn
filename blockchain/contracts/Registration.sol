// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;

contract Registration {
    struct RegistrationInfo {
        address applicant;
        string documentURI;
    }

    mapping(uint256 => RegistrationInfo[]) internal _registers; // Role => address
    mapping(uint256 => mapping(address => uint256))
        internal _positionOfRegisters; // Role => address => position

    mapping(uint256 => bool) internal _hasRole;
    mapping(address => uint256) internal _registeredAddr;
    mapping(string => bool) internal _registeredDocumentURI;

    modifier hasRegistered(address addr) {
        require(_registeredAddr[addr] > 0, "Not registered");
        _;
    }

    modifier allowedRole(uint256 role) {
        require(_hasRole[role], "Role doesn't not exist");
        _;
    }

    function _register(uint256 role, string memory documentURI) internal {
        require(!_registeredDocumentURI[documentURI]);
        _registers[role].push(RegistrationInfo(msg.sender, documentURI));
        _registeredAddr[msg.sender] = role + 1;
        _positionOfRegisters[role][msg.sender] = _registers[role].length;
        _registeredDocumentURI[documentURI] = true;
    }

    function _removeFromRegistersList(address addr) internal {
        uint256 role = _registeredAddr[addr] - 1;
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
        delete _registeredAddr[addr];
        delete _positionOfRegisters[role][addr];
    }

    function _getRegisteredInfo()
        internal
        view
        hasRegistered(msg.sender)
        returns (RegistrationInfo memory)
    {
        uint256 role = _registeredAddr[msg.sender] - 1;
        uint256 position = _positionOfRegisters[role][msg.sender];

        return _registers[role][position - 1];
    }

    function _getAllRegistration(
        uint256 role
    ) internal view returns (RegistrationInfo[] memory) {
        return _registers[role];
    }

    function _getRegisteredRole(address addr) internal view returns (uint256) {
        return _registeredAddr[addr] - 1;
    }
}
