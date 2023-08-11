import React, { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import "./Renegade.css"; // Replace with your CSS file
import { useWeb3React } from "@web3-react/core";
import  BurnClaimContractInterface  from "./ABI/burnclaim.json"; // Replace with your burn claim contract ABI
import  NewTokenInterface  from "./ABI/newToken.json"; // Replace with your new token ABI

const burnClaimContractAddress = '0x08eA7F4889861BA91bAFC6A30357c507A4481Aec';
const newTokenAddress = '0xF07b67c2Deb435e34424696025981dFE15Ef5fdf';

const RenegadeBurning = () => {
  const { library, active, account } = useWeb3React();

  const [stakedTokens, setStakedTokens] = useState("");
  const [claimedNewTokens, setClaimedNewTokens] = useState(0);
  const [stakedBalance, setStakedBalance] = useState(0); // New state for staked balance
  const [contract, setContract] = useState();
  const [newTokenContract, setNewTokenContract] = useState();

  const setup = useCallback(async (_library) => {
    const provider = _library.getSigner();
    const burnClaimContract = new ethers.Contract(burnClaimContractAddress, BurnClaimContractInterface, provider);
    setContract(burnClaimContract);

    const _newTokenContract = new ethers.Contract(newTokenAddress, NewTokenInterface, provider);
    setNewTokenContract(_newTokenContract);

    // Fetch and set the staked balance
    const balance = await burnClaimContract.stakedBalance(account);
    setStakedBalance(balance.toString());
  }, [account]);

  useEffect(() => {
    if (active) {
      setup(library);
    }
  }, [active, library, setup]);

  const handleClaimTokens = async () => {
    if (stakedTokens > 0 && contract && newTokenContract) {
      try {
        const stakedTokensBN = ethers.utils.parseUnits(stakedTokens, 18);

        const claimTx = await contract.claimNewTokens(stakedTokensBN);
        await claimTx.wait();

        // Update the claimed new tokens state
        setClaimedNewTokens(Number(stakedTokens) / 1000);

        // Update the staked balance after claiming
        const balance = await contract.stakedBalance(account);
        setStakedBalance(balance.toString());

        setStakedTokens("");
      } catch (error) {
        console.error("Error claiming new tokens:", error);
      }
    }
  };

  return (
    <div className="burn-claim-container">
      <h2>Burn Claim</h2>

      <div className="balance-section">
        <p>Your Staked Balance: {stakedBalance}</p>
      </div>

      <div className="action-section">
        <div>
          <label style={{ fontWeight: 'bold' }}>Staked Tokens:</label>
          <input
            type="number"
            value={stakedTokens}
            onChange={(e) => setStakedTokens(e.target.value)}
          />
          <button onClick={handleClaimTokens}>Claim New Tokens</button>
        </div>
      </div>

      {/* Display the claimed new tokens */}
      {claimedNewTokens > 0 && (
        <p>Claimed New Tokens: {claimedNewTokens}</p>
      )}
    </div>
  );
};

export default RenegadeBurning;
