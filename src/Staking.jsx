import React, { useState, useEffect } from "react";
import "./Staking.css"; // Import your CSS file

const Staking = ({ contract, account }) => {
  const [stakeAmount, setStakeAmount] = useState("");
  const [unstakeAmount, setUnstakeAmount] = useState("");
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (contract && account) {
      // Fetch user's staked balance from the contract
      contract.balanceOf(account).then((result) => {
        setBalance(result.toString());
      });
    }
  }, [contract, account]);

  const handleStake = async () => {
    if (stakeAmount > 0) {
      await contract.stake(stakeAmount);
      setStakeAmount("");
    }
  };

  const handleUnstake = async () => {
    if (unstakeAmount > 0) {
      await contract.unstake(unstakeAmount);
      setUnstakeAmount("");
    }
  };

  return (
    <div className="staking-container">
      <h2>Staking</h2>
      <p>Your Account: {account}</p>
      <p>Your Staked Balance: {balance}</p>
      
      <div className="action-section">
        <div>
          <label>Stake Amount:</label>
          <input
            type="number"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
          />
          <button onClick={handleStake}>Stake</button>
        </div>
        
        <div>
          <label>Unstake Amount:</label>
          <input
            type="number"
            value={unstakeAmount}
            onChange={(e) => setUnstakeAmount(e.target.value)}
          />
          <button onClick={handleUnstake}>Unstake</button>
        </div>
      </div>
    </div>
  );
};

export default Staking;
