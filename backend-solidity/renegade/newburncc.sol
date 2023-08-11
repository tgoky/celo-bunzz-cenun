// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./StakingContractInterface.sol"; // Import the staking contract interface
import "./NewTokenInterface.sol"; // Import the new token interface
import "./IERC20.sol"; // Import the ERC-20 token interface

contract BurnContract {
    address public stakingContractAddress;
    StakingContractInterface public stakingContract;
    NewTokenInterface public newToken;

    uint256 public conversionRate = 1000; // 1000 staked tokens -> 1 new token

    event BurnAndTransferStarted(address indexed user, uint256 amount, uint256 stakedBalance);
    event TokensBurned(address indexed user, uint256 amount);
    event NewTokenCalculation(address indexed user, uint256 newTokenAmount);
    event NewTokensTransferred(address indexed user, uint256 newTokenAmount);

    constructor(
        address _stakingContractAddress,
        address _newTokenAddress
    ) {
        stakingContractAddress = _stakingContractAddress;
        stakingContract = StakingContractInterface(_stakingContractAddress);
        newToken = NewTokenInterface(_newTokenAddress);
    }

    function burnAndTransfer(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");

        uint256 stakedBalance = stakingContract.stakedBalance(msg.sender);

        require(stakedBalance >= amount, "Insufficient staked balance");

        // Emit an event to log the start of the function
        emit BurnAndTransferStarted(msg.sender, amount, stakedBalance);

        // Perform token burning logic here
        // Transfer staked tokens to the burn address
        address burnAddress = 0x000000000000000000000000000000000000dEaD;
        IERC20(stakingContractAddress).transfer(burnAddress, amount);

        // Emit an event to log the successful token burn
        emit TokensBurned(msg.sender, amount);

        // Calculate the amount of new tokens to transfer
        uint256 newTokenAmount = amount / conversionRate;

        // Emit an event to log the new token calculation
        emit NewTokenCalculation(msg.sender, newTokenAmount);

        // Transfer new tokens to the user
        newToken.transfer(msg.sender, newTokenAmount);

        // Emit an event to log the successful transfer of new tokens
        emit NewTokensTransferred(msg.sender, newTokenAmount);
    }
}
