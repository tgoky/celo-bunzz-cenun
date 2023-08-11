// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StakingContract {
    address public owner;
    address public token;
    uint256 public totalStaked;
    mapping(address => uint256) public stakedBalance;

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);

    constructor(address _token) {
        owner = msg.sender;
        token = _token;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this");
        _;
    }

    function stake(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        require(stakedBalance[msg.sender] + amount <= IERC20(token).balanceOf(msg.sender), "Insufficient balance");

        stakedBalance[msg.sender] += amount;
        totalStaked += amount;
        IERC20(token).transferFrom(msg.sender, address(this), amount);

        emit Staked(msg.sender, amount);
    }

    function withdraw(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        require(stakedBalance[msg.sender] >= amount, "Insufficient staked balance");

        stakedBalance[msg.sender] -= amount;
        totalStaked -= amount;
        IERC20(token).transfer(msg.sender, amount);

        emit Withdrawn(msg.sender, amount);
    }
}

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}
        