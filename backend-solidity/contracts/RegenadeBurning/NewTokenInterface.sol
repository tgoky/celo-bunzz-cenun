// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface NewTokenInterface {
    function transfer(address to, uint256 value) external returns (bool);
    // Add other ERC-20 functions if required
    // ...
}
