// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;

contract Registration {
    mapping(uint256 => address[]) private _registers;
    mapping(uint256 => mapping(address => uint256)) private _positionOfRegisters;

    mapping(uint256 => address[]) private _members;
    mapping(uint256 => mapping(address => uint256)) private _positionOfMembers;

    enum ROLE {
        STUDENT,
        TEACHER
    }
    mapping(uint256 => bool) private _hasRole;

    constructor () {
        _hasRole[uint(ROLE.STUDENT)] = true;
        _hasRole[uint(ROLE.TEACHER)] = true;
    }

    modifier isRegister(uint256 role, address addr) {
        require(_positionOfRegisters[role][addr] > 0, "Not registered");
        _;
    }

    modifier isMember(uint256 role, address addr) {
        require(_positionOfMembers[role][addr] > 0, "Not member");
        _;
    }

    modifier isAllowedRole(uint256 role) {
        require(_hasRole[role], "Role doesn't not exist");
        _;
    }

    function register(uint256 role, address addr) internal isAllowedRole(role) {
        _registers[role].push(addr);
        _positionOfRegisters[role][addr] = _registers[role].length;
    }

    function approve(uint256 role, address addr) internal isRegister(role, addr) {
        removeFromRegistersList(role, addr);
        _members[role].push(addr);
        _positionOfMembers[role][addr] = _members[role].length;
    }

    function reject(uint256 role, address addr) internal isRegister(role, addr) {
        removeFromRegistersList(role, addr);
    }

    function remove(uint256 role, address addr) internal isMember(role, addr) {
        removeFromMembersList(role, addr);
    }

    function removeFromRegistersList(uint256 role, address addr) private {
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

    function removeFromMembersList(uint256 role, address addr) private {
        uint256 pos = _positionOfMembers[role][addr];
        uint256 len = _members[role].length;
        if (pos != len) {
            // swap current with last
            address lastRegisteredAddr = _members[role][len - 1];
            _members[role][pos - 1] = lastRegisteredAddr;
            _positionOfMembers[role][lastRegisteredAddr] = pos;
        }

        _members[role].pop();
        delete _positionOfMembers[role][addr];
    }
}
