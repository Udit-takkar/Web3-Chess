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

  const [gameAddress, setGameAddress] = useState(
    '0xE62EE6D3B254DCB679Ba1550DAeFcAc12CDd94A6',
  );
  const [nftContract, setNftContract] = useState(
    '0xabF0656be1AF77A403cAa10f7aa9DE7Cad836a9c',
  );
  const [marketPlace, setMarketPlace] = useState(
    '0x2c5bF8a13750A627484168F5C302742babA4Ede7',
  );

  const [gameContractABI, setGameContractABI] = useState(GameContract.abi);
  const [nftContractABI, setNftContractABI] = useState(NFTContract.abi);
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
