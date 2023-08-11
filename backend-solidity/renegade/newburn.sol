
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./StakingContract.sol"; // Make sure to provide the correct path to your StakingContract.sol

contract Burning {
    address public owner;
    address public stakingContractAddress;
    address public newToken;
    
    constructor(address _stakingContract, address _newToken) {
        owner = msg.sender;
        stakingContractAddress = _stakingContract;
        newToken = _newToken;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this");
        _;
    }
    
    function burnStakedTokens(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");

        StakingContract stakingContract = StakingContract(stakingContractAddress);
        uint256 stakedBalance = stakingContract.stakedBalance(msg.sender);

        require(stakedBalance >= amount, "Insufficient staked balance");

        stakingContract.withdraw(amount);

        // Calculate the amount of new tokens to send
        uint256 newTokenAmount = calculateNewTokenAmount(amount);

        // Transfer new tokens to the user
        IERC20Token(newToken).transfer(msg.sender, newTokenAmount);
    }
    
    function calculateNewTokenAmount(uint256 burnedAmount) internal pure returns (uint256) {
        // Define the conversion rate: 1000 staked tokens => 1 new token
        uint256 conversionRate = 1000;

        // Calculate the amount of new tokens to send
        uint256 newTokenAmount = burnedAmount / conversionRate;
        return newTokenAmount;
    }
}

interface IERC20Token {
    function transfer(address recipient, uint256 amount) external returns (bool);
}
