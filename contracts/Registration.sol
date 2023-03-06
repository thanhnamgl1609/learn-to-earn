// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;

contract Registration {
    mapping(uint256 => address[]) private _registers; // Role => address
    mapping(uint256 => mapping(address => uint256)) private _positionOfRegisters; // Role => address => position

    mapping(uint256 => bool) internal _hasRole;

    modifier hasRegistered(uint256 role, address addr) {
        require(_positionOfRegisters[role][addr] > 0, "Not registered");
        _;
    } 

    modifier allowedRole(uint256 role) {
        require(_hasRole[role], "Role doesn't not exist");
        _;
    }

    function _register(uint256 role, address addr) internal allowedRole(role) {
        _registers[role].push(addr);
        _positionOfRegisters[role][addr] = _registers[role].length;
    }

    function _removeFromRegistersList(uint256 role, address addr) internal {
        uint256 pos = _positionOfRegisters[role][addr];
        uint256 len = _registers[role].length;
        if (pos != len) {
            // swap current with last
            address lastRegisteredAddr = _registers[role][len - 1];
            _registers[role][pos - 1] = lastRegisteredAddr;
            _positionOfRegisters[role][lastRegisteredAddr] = pos;
        }

        _registers[role].pop();
        delete _positionOfRegisters[role][addr];
    }

    function _isRegister(uint256 role, address addr) internal view returns (bool) {
        return _positionOfRegisters[role][addr] > 0;
    }
}
