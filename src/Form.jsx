import React, { useEffect, useState, useCallback } from "react";
import { useWeb3React } from '@web3-react/core';
import { Contract } from "ethers";

import tokenABI from "./abi.json";


//deployed contract address from bunzz smart contract hub
const contractAddress = '0x3F1f2DaD43c43F688B44130c7Ac52cFe6FfBAb8F';


const Form = () => {
  const { account, library } = useWeb3React();
  const [balance, setBalance] = useState();

  const setup = useCallback(async (_library) => {
    const signer = _library.getSigner();
    const _contract = new Contract(contractAddress, tokenABI, signer);
    const _balance = await _contract.balanceOf(account);

    setBalance(_balance.toString());
  }, [account]);

  useEffect(() => {
    if (library) {
      setup(library);
    }
  }, [library, account, setup]);

  // Clear balance when account disconnects
  useEffect(() => {
    if (!account) {
      setBalance(null);
    }
  }, [account]);

  const formatBalance = (balance) => {
    if (balance === null) {
      return 'Disconnected';
    }

    const tokenDecimals = 18;
    const balanceInToken = balance / (10 ** tokenDecimals);

    const formattedBalance = balanceInToken.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return formattedBalance;
  };

  return (
    <>
      <p style={{ fontWeight: 'bold' }}>cenun account: {account}</p>
      <p style={{ fontWeight: 'bold', color: '#7D0552' }}>cenun balance: {formatBalance(balance)}</p>
    </>
  );
}

export default Form;
