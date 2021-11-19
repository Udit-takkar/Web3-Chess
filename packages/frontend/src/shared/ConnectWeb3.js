import React, { useContext } from 'react';
// import { Loader } from '../components/Loader';
import { Web3Context } from '../contexts/Web3Context';
import { SUPPORTED_NETWORKS } from '../utils/constants';
import { getNetworkName, logError } from '../utils/helpers';
import Wallet from '../assets/wallet.png';

export const ConnectWeb3 = () => {
  const { connectAccount, loading, account, disconnect } =
    useContext(Web3Context);

  if (loading) {
    return (
      <div>
        {/* <Loader size="80" /> */}
        <div>Loading...</div>
      </div>
    );
  }

  const onClick = async () => {
    try {
      await connectAccount();
    } catch {
      logError("Couldn't connect web3 wallet");
    }
  };

  const NETWORK_NAMES = SUPPORTED_NETWORKS.map(getNetworkName).join(' or ');
  return (
    <div>
      <div>
        <div>
          <img alt="wallet-icon" src={Wallet} />
        </div>
        {loading ? (
          <h2>Connecting Wallet</h2>
        ) : (
          <>
            <h2>{account ? `Network not supported` : 'Connect Wallet'}</h2>
            <h2>
              {account
                ? `Please switch to ${NETWORK_NAMES}`
                : 'To get started, connect your wallet'}
            </h2>
          </>
        )}
        {account && !loading ? (
          <button onClick={disconnect}>Disconnect</button>
        ) : (
          <button onClick={onClick}>Connect</button>
        )}
      </div>
    </div>
  );
};
