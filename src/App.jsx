import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from "@web3-react/injected-connector";

import Form from './Form';
import "./App.css";
import  Staking from './Staking';


const CHAIN_ID = Number(process.env.REACT_APP_CHAIN_ID || 44787);
const connector = new InjectedConnector({ supportedChainIds: [CHAIN_ID] })

const App = () => {
  const { activate, active, error, deactivate } = useWeb3React();

  const connectToWallet = async () => {
    await activate(connector);
  };

  const disconnectWallet = () => {
    deactivate();
  };

  const connectButton = (<button onClick={connectToWallet} style={{ backgroundColor: 'yellow', color: 'black', fontWeight: 'bold' }}>Connect to Wallet</button>);
  const disconnectButton = (<button onClick={disconnectWallet}  style={{ backgroundColor: 'yellow', color: 'black',  fontWeight: 'bold' }}>Disconnect Wallet</button>);

  return (

    <div className="App App-header">
      {active ? (
        <>
          <Form />
          {disconnectButton}
        </>
      ) : (
        <>
          {connectButton}
        </>
      )}
      {error ? <p>{error.message}</p> : <></>}
      <Staking/>
    </div>

  );
};

export default App;
