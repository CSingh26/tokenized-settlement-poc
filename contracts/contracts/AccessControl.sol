// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";

contract AccessControl is Ownable {
    constructor(address initialOwner) Ownable(initialOwner) {}

    mapping(address => bool) public blacklisted;
    mapping(address => bool) public whitelisted;

    modifier notBlacklisted(address user) {
        require(!blacklisted[user], "User is blacklisted");
        _;
    }

    modifier onlyWhitelisted(address user) {
        require(whitelisted[user], "User is not whitelisted");
        _;
    }

    event Blacklisted(address user, bool value);
    event Whitelisted(address user, bool value);

    function setBlacklist(address user, bool value) external onlyOwner {
        blacklisted[user] = value;
        emit Blacklisted(user, value);
    }

    function setWhitelist(address user, bool value) external onlyOwner {
        whitelisted[user] = value;
        emit Whitelisted(user, value);
    }

    
}
