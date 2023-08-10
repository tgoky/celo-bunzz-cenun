import { useEffect, useState } from "react";
import { useWeb3React } from '@web3-react/core';
import { Contract } from "ethers";

import tokenABI from "./abi.json";

const contractAddress = '0xddC6be4325173F976aC4A4e5b91154B90B601CF1';

const Form = () => {
  const { account, library } = useWeb3React();
  const [contract, setContract] = useState();
  const [balance, setBalance] = useState();
  const [progress, setProgress] = useState(false);
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (library) setup(library);
  }, [library, account]);

  // Clear balance when account disconnects
  useEffect(() => {
    if (!account) {
      setBalance(null);
    }
  }, [account]);

  const setup = async (_library) => {
    const signer = _library.getSigner();
    const _contract = new Contract(contractAddress, tokenABI, signer);
    const _balance = await _contract.balanceOf(account);

    setContract(_contract);
    setBalance(_balance.toString());
  };

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

  const handleChange = (e) => setValue(e.target.value);

  const submit =  () => {
   
  };

  return (
    <>
      <p style={{ fontWeight: 'bold' }}>cenun account: {account}</p>
      <p style={{ fontWeight: 'bold', color: 'white' }}>cenun balance: {formatBalance(balance)}</p>

      {
        progress ?
          <p>The transaction is pending...</p> :
          <div>
            {/* Your form inputs and submit button */}
          </div>
      }
    </>
  );
}

export default Form;
