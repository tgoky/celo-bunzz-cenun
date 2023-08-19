// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface StakingContractInterface {
    function stakedBalance(address user) external view returns (uint256);
    function stake(uint256 amount) external;
    function withdraw(uint256 amount) external;
    function transfer(address recipient, uint256 amount) external returns (bool);
}
