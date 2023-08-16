import React, { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from "@web3-react/injected-connector";
import cenunlogo from './img/cenun-logo.png';
import { FaGithub, FaRegFileAlt} from 'react-icons/fa'; 
import { ethers } from 'ethers'; 

import Form from './Form';
import Staking from './Staking';
import RenegadeBurning from './RenegadeBurning';
import "./App.css";
import faucetABI from './faucet.json';

// const faucetContract = '0x56D51d87149c7c617F695a69c0aDf2CeFb50A867';

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

  const requestTokens = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      // Replace 'CONTRACT_ADDRESS' with the actual address of your smart contract
      const faucetContract = '0x56D51d87149c7c617F695a69c0aDf2CeFb50A867';
      const contract = new ethers.Contract(faucetContract, faucetABI, signer);
  
      // Send the transaction to the 'requestTokens' function
      const transaction = await contract.requestTokens();
  
      // Wait for the transaction to be mined
      await transaction.wait();
  
      // You can display a success message or perform other actions here
      console.log('Tokens requested successfully');
    } catch (error) {
      // Handle errors here
      console.error('Error requesting tokens:', error);
    }
  };
  

  return (
    <div className="App">
      <div className="sidebar">
        <button onClick={toggleSidebar} >Cenun Defi</button>
        {active ? (
  <>
    {/* Render the "Request Tokens" button */}
    <button onClick={requestTokens} style={{ backgroundColor: '#9FE2BF', color: 'black' }}>
      Request Tokens
    </button>
    {/* Rest of your component */}
  </>
) : null}
        {active ? renderDisconnectButton : (
          <button onClick={connectToWallet} style={{ backgroundColor: 'yellow', color: 'black', fontWeight: 'bold' }}>
            Connect to Wallet
          </button>
        )}
        <button onClick={() => setCurrentView('staking')}
         className="sidebar-button" 
        >Staking</button>
        <button onClick={() => setCurrentView('renegadeBurning')}
         className="sidebar-button" 
        >Renegade Hydrant</button>
          {/* Add Medium and GitBook links with icons */}
          <div className="sidebar-links">
          <a href="https://github.com/tgoky/celo-bunzz-cenun" target="_blank" rel="noopener noreferrer"><FaGithub className="sidebar-icon" /></a>
          <a href="https://tgoky.gitbook.io/cenun-defi-documentation/" target="_blank" rel="noopener noreferrer"><FaRegFileAlt className="sidebar-icon" /></a>
        </div>
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
