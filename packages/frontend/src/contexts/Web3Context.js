import { SafeAppWeb3Modal as Web3Modal } from '@gnosis.pm/safe-apps-web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { ethers } from 'ethers';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import Web3 from 'web3';

import { SUPPORTED_NETWORKS } from '../utils/constants';
import { getRpcUrl, logError } from '../utils/helpers';
const StreamrClient = require('streamr-client');

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: {
        80001: getRpcUrl(80001),
      },
    },
  },
};

const web3Modal = new Web3Modal({
  cacheProvider: true,
  providerOptions,
});

export const Web3Context = createContext();
export const useWeb3 = () => useContext(Web3Context);

export const Web3ContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [{ account, provider, chainId, client, signer }, setWeb3] = useState(
    {},
  );

  const setWeb3Provider = async (prov, initialCall = false) => {
    if (prov) {
      const web3Provider = new Web3(prov);
      const gotProvider = new ethers.providers.Web3Provider(
        web3Provider.currentProvider,
      );
      const gotChainId = Number(prov.chainId);
      const streamr = await new StreamrClient({
        // restUrl: 'http://localhost/api/v1', // if you want to test locally in the streamr-docker-dev environment
        // auth: { ethereum: gotProvider.provider },
        auth: {
          privateKey: process.env.REACT_APP_PRIVATE_KEY,
        },
        publishWithSignature: 'never',
        autoConnect: 'true',
      });

      if (initialCall) {
        const signer = gotProvider.getSigner();
        const gotAccount = await signer.getAddress();
        setWeb3(_provider => ({
          ..._provider,
          provider: gotProvider,
          chainId: gotChainId,
          account: gotAccount,
          client: streamr,
          signer,
        }));
      } else {
        setWeb3(_provider => ({
          ..._provider,
          provider: gotProvider,
          chainId: gotChainId,
          client: streamr,
        }));
      }
    }
  };

  useEffect(() => {
    if (SUPPORTED_NETWORKS.indexOf(chainId) === -1 && chainId) {
      //   alert('Use only mumbai test');
    }
  }, [chainId]);

  const connectWeb3 = useCallback(async () => {
    try {
      setLoading(true);
      const modalProvider = await web3Modal.requestProvider();

      await setWeb3Provider(modalProvider, true);

      const isGnosisSafe = !!modalProvider.safe;

      if (!isGnosisSafe) {
        modalProvider.on('accountsChanged', accounts => {
          setWeb3(_provider => ({
            ..._provider,
            account: accounts[0],
          }));
        });
        modalProvider.on('chainChanged', () => {
          setWeb3Provider(modalProvider);
        });
      }
    } catch (web3ModalError) {
      logError({ web3ModalError });
      throw web3ModalError;
    } finally {
      setLoading(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    web3Modal.clearCachedProvider();
    setWeb3({});
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.autoRefreshOnNetworkChange = false;
    }
    (async function load() {
      //   if ((await web3Modal.canAutoConnect()) || web3Modal.cachedProvider) {
      if (web3Modal.cachedProvider) {
        connectWeb3();
      } else {
        setLoading(false);
      }
    })();
  }, [connectWeb3]);

  return (
    <Web3Context.Provider
      value={{
        loading,
        account,
        provider,
        chainId,
        connectAccount: connectWeb3,
        disconnect,
        client,
        signer,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
