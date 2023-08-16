import React, { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import "./Renegade.css"; 
import { useWeb3React } from "@web3-react/core";
import  BurnClaimContractInterface  from "./ABI/burnclaim.json"; 
import  NewTokenInterface  from "./ABI/newToken.json"; 

const burnClaimContractAddress = '0x52B81343277ce7816b45054A7D50b9512Fe08991';
const newTokenAddress = '0x18cD9F2BC3742F50AB3a0729FD1844384cfC7F06';

const RenegadeBurning = () => {
  const { library, active, account } = useWeb3React();

  const [stakedTokens, setStakedTokens] = useState("");
  const [claimedNewTokens, setClaimedNewTokens] = useState(0);
  const [contract, setContract] = useState();
  const [newTokenContract, setNewTokenContract] = useState();
  const [walletNewTokenBalance, setWalletNewTokenBalance] = useState(0); // New state for wallet's new token balance

  const setup = useCallback(async (_library) => {
    const provider = _library.getSigner();
    const burnClaimContract = new ethers.Contract(
      burnClaimContractAddress,
      BurnClaimContractInterface,
      provider
    );
    setContract(burnClaimContract);

    const _newTokenContract = new ethers.Contract(
      newTokenAddress,
      NewTokenInterface,
      provider
    );
    setNewTokenContract(_newTokenContract);
  }, []);

  useEffect(() => {
    if (active) {
      setup(library);
    }
  }, [active, library, setup]);

  useEffect(() => {
    async function fetchWalletNewTokenBalance() {
      if (newTokenContract && account) {
        const balance = await newTokenContract.balanceOf(account);
        setWalletNewTokenBalance(balance);
      }
    }

    fetchWalletNewTokenBalance();
  }, [newTokenContract, account]);


  const formatBalance = (balance) => {
    const tokenDecimals = 18;
    const balanceInToken = balance / 10 ** tokenDecimals;
    const formattedBalance = balanceInToken.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return formattedBalance;
  };

  const handleClaimTokens = async () => {
    if (stakedTokens > 0 && contract && newTokenContract) {
      try {
        const stakedTokensBN = ethers.utils.parseUnits(stakedTokens, 18);

        const claimTx = await contract.claimNewTokens(stakedTokensBN);
        await claimTx.wait();

        // Update the claimed new tokens state
        setClaimedNewTokens(Number(stakedTokens) / 1000); // Assuming 1000 staked tokens = 1 new token

        setStakedTokens("");
      } catch (error) {
        console.error("Error claiming new tokens:", error);
      }
    }
  };

  return (
    <div className="burn-claim-container">
      <h2 style={{color: 'pink'}}>Renegade Hydrant</h2>

      <div className="action-section">
        <div>
          <label style={{ fontWeight: 'bold' }}>Use Staked Cenun </label>
          <label style={{ fontWeight: 'bold' }}>to claim reCenun </label>
          <input
            type="number"
            value={stakedTokens}
            onChange={(e) => setStakedTokens(e.target.value)}
          />
          <button onClick={handleClaimTokens}>Claim reCenun</button>
        </div>
      </div>

      {/* Display the claimed new tokens */}
      {claimedNewTokens > 0 && (
        <p style={{fontWeight:'bold'}}>You just claimed : {claimedNewTokens} reCenun</p>

        
      )}

      {/* Display wallet's new token balance */}
      <p style={{fontWeight:'bold'}}>Wallet reCenun Balance: {formatBalance(walletNewTokenBalance)}</p>
      <div className="text-container">
        <p style={{ border: '1px solid black', padding: '10px' , fontFamily: 'monospace', }}>Conversion Rate: 1 Staked Cenun = 0.001 reCenun </p>
      </div>
    </div>
    
  );
};

export default RenegadeBurning;