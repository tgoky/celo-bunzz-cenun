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
  const { activate, active, deactivate } = useWeb3React();
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

  const renderDisconnectButton = (
    <button onClick={disconnectWallet} style={{ backgroundColor: 'yellow', color: 'black', fontWeight: 'bold', margin: '10px auto', display: 'block' }}>
      Disconnect Wallet
    </button>
  );

  return (
    <div className="App">
      <div className="sidebar">
        <button onClick={toggleSidebar}>Cenun Defi</button>
        {active ? renderDisconnectButton : (
          <button onClick={connectToWallet} style={{ backgroundColor: 'yellow', color: 'black', fontWeight: 'bold' }}>
            Connect to Wallet
          </button>
        )}
        <button onClick={() => setCurrentView('staking')}>Staking</button>
        <button onClick={() => setCurrentView('renegadeBurning')}>Renegade Hydrant</button>
      </div>
      <div className={`main-content ${sidebarOpen ? 'with-sidebar' : ''}`}>
        <img src={cenunlogo}   alt="Cenun Defi Logo"   style={{ width: 450, height: 170, alignContent: 'center', marginTop: '-13px' }}/>
        {currentView === 'staking' && (
          <>
            <Form />
            <Staking />
            {active && renderDisconnectButton}
          </>
        )}
        {currentView === 'renegadeBurning' && <RenegadeBurning />}
      </div>
    </div>
  );
};

export default App;
