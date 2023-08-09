import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./Staking.css";
import stakingABI from "./ABI/staking.json"; // Replace with the correct path to your staking ABI
import tokenABI from "./abi.json"; // Replace with the correct path to your token ABI
import { useWeb3React } from "@web3-react/core";

const tokenAddress = '0xddC6be4325173F976aC4A4e5b91154B90B601CF1'; // Replace with the actual token address
const contractAddress = '0xa3aba6FC76E33f80138b6d4AB2592968FA1A4Df6'; // Replace with the actual staking contract address

const Staking = () => {
  const { library, active, account } = useWeb3React();

  const [stakeAmount, setStakeAmount] = useState("");
  const [unstakeAmount, setUnstakeAmount] = useState("");
  const [balance, setBalance] = useState(0);
  const [contract, setContract] = useState();
  const [tokenContract, setTokenContract] = useState();

  useEffect(() => {
    if (active) {
      setup(library);
    }
  }, [active, library, account]);

  const setup = async (_library) => {
    const provider = _library.getSigner();
    const stakingContract = new ethers.Contract(contractAddress, stakingABI, provider);
    setContract(stakingContract);

    const _tokenContract = new ethers.Contract(tokenAddress, tokenABI, provider);
    setTokenContract(_tokenContract);

    stakingContract.stakedBalance(account).then((result) => {
      setBalance(result.toString());
    });

    stakingContract.on("Staked", (user, amount) => {
      console.log("Staked event:", user, amount);
      // Update your UI or state accordingly
    });

    stakingContract.on("Withdrawn", (user, amount) => {
      console.log("Withdrawn event:", user, amount);
      // Update your UI or state accordingly
    });
  };

  const handleStake = async () => {
    if (stakeAmount > 0 && contract && tokenContract) {
      try {
        const stakeAmountBN = ethers.utils.parseUnits(stakeAmount, 18);

        // Approve staking contract to spend tokens
        const approveTx = await tokenContract.approve(contract.address, stakeAmountBN);
        await approveTx.wait();

        // Stake the tokens
        const stakeTx = await contract.stake(stakeAmountBN);
        await stakeTx.wait();

        setStakeAmount("");
      } catch (error) {
        console.error("Error staking:", error);
      }
    }
  };

  const handleUnstake = async () => {
    if (unstakeAmount > 0 && contract) {
      try {
        const unstakeAmountBN = ethers.utils.parseUnits(unstakeAmount, 18);

        // Unstake the tokens
        const unstakeTx = await contract.withdraw(unstakeAmountBN);
        await unstakeTx.wait();

        setUnstakeAmount("");
      } catch (error) {
        console.error("Error unstaking:", error);
      }
    }
  };

  const formatBalance = (balance) => {
    const tokenDecimals = 18;
    const balanceInToken = balance / 10 ** tokenDecimals;
    const formattedBalance = balanceInToken.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return formattedBalance;
  };

  return (
    <div className="staking-container">
      <h2>Staking</h2>
      <p>Your Staked Balance: {formatBalance(balance)}</p>

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
          <button onClick={handleUnstake} style={{ marginLeft: "10px" }}>
            Unstake
          </button>
        </div>
      </div>
    </div>
  );
};

export default Staking;

