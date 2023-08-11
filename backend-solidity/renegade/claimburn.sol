// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./StakingContractInterface.sol"; // Import the staking contract interface
import "./NewTokenInterface.sol"; // Import the new token interface

contract BurnClaimContract {
    StakingContractInterface public stakingContract;
    NewTokenInterface public newToken;

    uint256 public conversionRate = 1000; // 1000 staked tokens -> 1 new token

    event NewTokenClaimed(address indexed user, uint256 stakedTokens, uint256 newTokenAmount);

    constructor(
        address _stakingContractAddress,
        address _newTokenAddress
    ) {
        stakingContract = StakingContractInterface(_stakingContractAddress);
        newToken = NewTokenInterface(_newTokenAddress);
    }

    function claimNewTokens(uint256 stakedTokens) external {
        require(stakedTokens > 0, "Staked tokens must be greater than 0");

        uint256 newTokenAmount = stakedTokens / conversionRate;

        // Transfer new tokens to the user
        newToken.transfer(msg.sender, newTokenAmount);

        // Emit an event to log the claimed new tokens
        emit NewTokenClaimed(msg.sender, stakedTokens, newTokenAmount);
    }
}
