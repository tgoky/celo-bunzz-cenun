import React, { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from "@web3-react/injected-connector";
import cenunlogo from './img/cenun-logo.png';

import Form from './Form';
import Staking from './Staking';
import RenegadeBurning from './RenegadeBurning';
import "./App.css";

const CHAIN_ID = Number(process.env.REACT_APP_CHAIN_ID || 44787);
const connector = new InjectedConnector({ supportedChainIds: [CHAIN_ID] });

const App = () => {
  const { activate, active, error, deactivate } = useWeb3React();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('staking');

  const connectToWallet = async () => {
    await activate(connector);
  };

  const disconnectWallet = () => {
    deactivate();
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderConnectButton = (
    <button onClick={connectToWallet} style={{ backgroundColor: 'yellow', color: 'black', fontWeight: 'bold' }}>
      Connect to Wallet
    </button>
  );

  const renderDisconnectButton = (
    <button onClick={disconnectWallet} style={{ backgroundColor: 'yellow', color: 'black', fontWeight: 'bold' }}>
      Disconnect Wallet
    </button>
  );

  return (
    <div className="App">
      <div className="sidebar">
        <button onClick={toggleSidebar}>Cenun Defi</button>
        {active ? renderDisconnectButton : renderConnectButton}
        <button onClick={() => setCurrentView('staking')}>Staking</button>
        <button onClick={() => setCurrentView('renegadeBurning')}>Renegade Burning</button>
      </div>
      <div className={`main-content ${sidebarOpen ? 'with-sidebar' : ''}`}>
        <img src={cenunlogo} style={{ width: 450, height: 170, alignContent: 'center',marginTop: '-13px' ,}}/>
        {currentView === 'staking' && (
          <>
            {active ? (
              <>
                <Form />
                {renderDisconnectButton}
              </>
            ) : (
              renderConnectButton
            )}
            <Staking />
          </>
        )}
        {currentView === 'renegadeBurning' && <RenegadeBurning />}
      </div>
    </div>
  );
};

export default App;
