import React, { useEffect, useState } from 'react';
import { useMoralis } from 'react-moralis';
import MoralisDappContext from './MoralisCotext';
import GameContract from '../contracts/GameContract.json';
import NFTContract from '../contracts/NFT.json';
import MarketPlaceContract from '../contracts/MarketPlace.json';

function MoralisDappProvider({ children }) {
  const { web3, Moralis, user } = useMoralis();
  const [walletAddress, setWalletAddress] = useState();
  const [chainId, setChainId] = useState();
  const [gameContractABI, setGameContractABI] = useState(GameContract.abi);
  const [gameAddress, setGameAddress] = useState(
    '0xE62EE6D3B254DCB679Ba1550DAeFcAc12CDd94A6',
  );
  const [nftContract, setNftContract] = useState(
    '0x35eC43955e0d7A39430a1C4e6801Dc0857e69A88',
  );
  const [nftContractABI, setNftContractABI] = useState(NFTContract.abi);
  const [marketPlace, setMarketPlace] = useState(
    '0xf824cC3568cE222D4905EF3Bb48D9304e5a48DEC',
  );
  const [marketPlaceAbi, setMarketPlaceAbi] = useState(MarketPlaceContract.abi);
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
        marketPlace,
        marketPlaceAbi,
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
