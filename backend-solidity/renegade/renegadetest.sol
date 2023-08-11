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
        
        // Perform token burning logic here
        // Transfer new tokens to the user, for example:
        IERC20Token(newToken).transfer(msg.sender, amount);
    }

    function depositNewTokens(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be greater than 0");

        // Transfer new tokens from the contract owner to the Burning contract
        IERC20Token(newToken).transfer(address(this), amount);
    }
}

interface IERC20Token { // Renamed interface to avoid naming conflict
    function transfer(address recipient, uint256 amount) external returns (bool);
}
