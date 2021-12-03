import React, { useEffect, useState } from 'react';
import { useMoralis } from 'react-moralis';
import MoralisDappContext from './MoralisCotext';
import GameContract from '../contracts/GameContract.json';
import NFTContract from '../contracts/NFT.json';

function MoralisDappProvider({ children }) {
  const { web3, Moralis, user } = useMoralis();
  const [walletAddress, setWalletAddress] = useState();
  const [chainId, setChainId] = useState();
  const [gameContractABI, setGameContractABI] = useState(GameContract.abi);
  const [gameAddress, setGameAddress] = useState(
    '0x091b9A3d3F4661B74153d655cc1147ce07A79A21',
  );
  const [nftContract, setNftContract] = useState(
    '0x0b378F3dCe17a83de950aB7BabC2C4C0daf789c9',
  );
  const [nftContractABI, setNftContractABI] = useState(NFTContract.abi);

  useEffect(() => {
    Moralis.onChainChanged(function (chain) {
      setChainId(chain);
    });

    Moralis.onAccountsChanged(function (address) {
      setWalletAddress(address[0]);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setChainId(web3.givenProvider?.chainId));
  useEffect(
    () =>
      setWalletAddress(
        web3.givenProvider?.selectedAddress || user?.get('ethAddress'),
      ),
    [web3, user],
  );

  return (
    <MoralisDappContext.Provider
      value={{
        walletAddress,
        chainId,
        gameAddress,
        setGameAddress,
        gameContractABI,
        setGameContractABI,
        nftContract,
        nftContractABI,
      }}
    >
      {children}
    </MoralisDappContext.Provider>
  );
}

function useMoralisDapp() {
  const context = React.useContext(MoralisDappContext);
  if (context === undefined) {
    throw new Error('useMoralisDapp must be used within a MoralisDappProvider');
  }
  return context;
}

export { MoralisDappProvider, useMoralisDapp };
