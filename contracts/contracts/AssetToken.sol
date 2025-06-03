// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AssetToken is ERC20, Ownable {
    constructor(string memory name, string memory symbol, address initalOwner) 
    ERC20(name, symbol) 
    Ownable(initalOwner)
    {}

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}