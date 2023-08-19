// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./CenunCA.sol";

contract cenunfaucet {
    CenunCA public token;

    constructor(CenunCA _token) {
        token = _token;
    }

     function requestTokens() external {
        uint256 amount = 15000 * 10**18; // 15,000 tokens with 18 decimals

        // Transfer tokens from the Faucet contract's balance to the user
        token.transfer(msg.sender, amount);
    }
}
