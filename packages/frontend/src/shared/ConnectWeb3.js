import React from 'react';
import { SUPPORTED_NETWORKS } from '../utils/constants';
import { getNetworkName, logError } from '../utils/helpers';
import Wallet from '../assets/wallet.png';
import { useMoralis } from 'react-moralis';
import { useMoralisDapp } from '../contexts/MoralisDappProvider';

export const ConnectWeb3 = () => {
  const { chainId, walletAddress, user } = useMoralisDapp();
  const { logout, isAuthenticating, isAuthenticated, authenticate } =
    useMoralis();

  if (isAuthenticating) {
    return (
      <div>
        {/* <Loader size="80" /> */}
        <div>Loading...</div>
      </div>
    );
  }

  const handleClick = async () => {
    try {
      await authenticate();
    } catch {
      logError("Couldn't connect web3 wallet");
    }
  };

  const NETWORK_NAMES = SUPPORTED_NETWORKS.map(getNetworkName).join(' or ');
  return (
    <div className="flex flex-col items-center justify-center h-screen font-montserrat text-xl text-white ">
      <div>
        <img alt="wallet-icon" src={Wallet} height="300px" width="250px" />
      </div>
      {isAuthenticating ? (
        <h2>Connecting Wallet</h2>
      ) : (
        <>
          <h2>{walletAddress ? `Network not supported` : 'Connect Wallet'}</h2>
          <h2>
            {walletAddress
              ? `Please switch to ${NETWORK_NAMES}`
              : 'To get started, connect your wallet'}
          </h2>
        </>
      )}
      {isAuthenticated ? (
        <button onClick={() => logout()}>Disconnect</button>
      ) : (
        <button
          className="mt-4 w-full  text-white rounded-lg bg-btn-purple border-play-hand-btn   border py-3 px-6 font-semibold text-md "
          onClick={handleClick}
        >
          Connect
        </button>
      )}
    </div>
  );
};
