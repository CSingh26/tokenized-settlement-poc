// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "./AccessControl.sol";

interface IsAssetToken {
    function transfer(address from, address to, uint256 amount) external returns (bool);
}

contract SettlementEngine is AccessControl{
    address public fraudOracle;
    mapping(bytes32 => bool) public flaggedTxns;

    event SettlementInialized(bytes32 txnId, address from, address to, uint256 amount);
    event SettlementFinalized(bytes32 txnId);
    event FraudFlagged(bytes32 txnId);

    constructor(address _fraudOracle) AccessControl(msg.sender) {
        fraudOracle = _fraudOracle;
    }

    modifier onlyOracle() {
        require(msg.sender == fraudOracle, "Only orcale");
        _;
    }

    function initializeSettlement(
        address token,
        address from,
        address to,
        uint256 amount,
        bytes32 txnId
    ) external 
        notBlacklisted(from)
        notBlacklisted(to)
        onlyWhitelisted(from)
        onlyWhitelisted(to) {
        emit SettlementInialized(txnId, from, to, amount);
    } 

    function flagFraud(
        bytes32 txnId
    ) external onlyOracle {
        flaggedTxns[txnId] = true;
        emit FraudFlagged(txnId);
    }

    function finalizeSettlement(
        address token,
        address from,
        address to,
        uint256 amount,
        bytes32 txnId
    ) external {
        require(!flaggedTxns[txnId], "Transaction flagged as fraud");
        
        IsAssetToken(token).transfer(from, to, amount);
        emit SettlementFinalized(txnId);
    }
}