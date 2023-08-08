import { useEffect, useState } from "react";
import { useWeb3React } from '@web3-react/core';
import { Contract } from "ethers";

import data from "./abi.json";

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
const abi = data.abi;

const Form = () => {
  const { account, library } = useWeb3React();
  const [contract, setContract] = useState();
  const [balance, setBalance] = useState();
  const [progress, setProgress] = useState(false);
  const [value, setValue] = useState(0);


  useEffect(() => {
    if (library) setup(library);
  }, [library, account]);

  const setup = async (_library) => {
    const signer = _library.getSigner();
    const _contract = new Contract(contractAddress, abi, signer);
    const _balance = await _contract.balanceOf(account);

    setContract(_contract);
    setBalance(_balance.toString());
  };

  const formatBalance = (balance) => {
    const tokenDecimals = 18; // Number of decimal places the token has
    
    // Divide the balance by 10^18 to convert from wei to token units
    const balanceInToken = balance / (10 ** tokenDecimals);

    // Use JavaScript's toLocaleString() function to add commas for thousands separation
    // and round the balance to a fixed number of decimal places (e.g., 2)
    const formattedBalance = balanceInToken.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return formattedBalance;
  };

  

  const handleChange = (e) => setValue(e.target.value);

  const submit = async () => {
    try {
      const tx = await contract.mint(account, value);
      setProgress(true);

      await tx.wait();
      alert("Transaction was sent in success🎉");
    } finally {
      setProgress(false);
    }
  };

  return (
    <>
      <p>account: {account}</p>
      <p>balance: {formatBalance(balance)}</p>
      
      {
        progress ?
          <p>The transaction is pending...</p> :
          <div>
          
          </div>
      }
    </>
  );
}

export default Form;