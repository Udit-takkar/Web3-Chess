import React, { useEffect, useState } from 'react';
import PageContainer from '../shared/PageContainer';
import Blockies from 'react-blockies';
import { getAccountString } from '../utils/helpers';
import { useMoralisDapp } from '../contexts/MoralisDappProvider';
import ViewOnPolyscanLogo from '../components/ViewOnPolyscan';
import Moralis from 'moralis';
import Matic from '../assets/polygon.svg';
import UpArrow from '../assets/UpArrow';
import { useNFTTokenIds } from '../hooks/useNFTTokenIds';
import axios from 'axios';

function DashBoard() {
  const { walletAddress, gameAddress, gameContractABI, nftContract } =
    useMoralisDapp();
  const [balance, setBalance] = useState(0);
  const { NFTTokenIds, totalNFTs, getNFTTokenIds } =
    useNFTTokenIds(nftContract);
  const [nfts, setNfts] = useState([]);
  console.log(nfts);

  useEffect(() => {
    const getBalance = async () => {
      const options = {
        contractAddress: gameAddress,
        functionName: 'getPlayerBalance',
        abi: gameContractABI,
        // msgValue: Moralis.Units.ETH('0.05'),
        params: {
          playerAddress: walletAddress,
        },
      };
      await Moralis.enableWeb3();
      const amountInWei = await Moralis.executeFunction(options);
      const web3 = new Moralis.Web3();
      const amountInEth = web3.utils.fromWei(amountInWei, 'ether');
      setBalance(amountInEth);
    };
    getBalance();
  }, [walletAddress]);

  useEffect(() => {
    if (nftContract) {
      getNFTTokenIds();
    }
  }, [nftContract]);

  useEffect(() => {
    const loadNfts = async () => {
      if (NFTTokenIds && NFTTokenIds.length > 0) {
        const items = await Promise.all(
          NFTTokenIds.map(async i => {
            const imageURL = `https://ipfs.infura.io/ipfs/${i.image}`;
            let item = {
              ...i,
              image: imageURL,
            };
            return item;
          }),
        );

        setNfts(items);
      }
    };
    loadNfts();
  }, [NFTTokenIds]);

  return (
    <PageContainer>
      {/* <div className="flex flex-col items-center justify-center text-white w-full h-screen font-montserrat"> */}
      <div className=" flex flex-col mt-20 items-center justify-center w-full text-white font-montserrat">
        <div className="font-press-start align-left w-full mb-4">
          <h1 className="text-4xl mx-14">Dashboard</h1>
        </div>
        <div className="w-full flex items-center justify-around">
          <div className="flex flex-col w-full mx-12">
            <div className="bg-dark-purple text-heading-color text-2xl p-4 font-press-start">
              Web3 Chess Balance
            </div>
            <div className="flex bg-play-comp-color justify-between items-center w-full p-4">
              <div className="flex items-center justify-center">
                <Blockies
                  seed={walletAddress}
                  size={10}
                  scale={3}
                  color="#dfe"
                  bgColor="#ffe"
                  spotColor="#abc"
                  className="identicon"
                />
                <h2 className="text-2xl mx-2">
                  {getAccountString(walletAddress)}
                </h2>
                <div
                  className="cursor-pointer mx-2"
                  onClick={() =>
                    (window.location.href = `https://mumbai.polygonscan.com/address/${walletAddress}`)
                  }
                >
                  <ViewOnPolyscanLogo />
                </div>
              </div>
              <div className="flex items-center justify-center">
                <h2 className="text-3xl mx-2">{balance} MATIC</h2>
                <img alt="matic logo" src={Matic} height={50} width={50} />
              </div>
            </div>

            {/* 2nd box */}
            {/* <div className="flex items-center justify-between  mt-4 w-full p-4"> */}
            <div className="grid grid-cols-2 auto-rows-fr mt-4 w-full p-4">
              {/* Deposit */}
              <div className="">
                <div className="bg-dark-purple text-heading-color text-2xl p-2 font-press-start">
                  Deposit
                </div>
                <div className="bg-play-comp-color p-4 rounded-lg ">
                  <p className="text-md">
                    Transfer your MATIC coins to Web3Chess to stake and start
                    chess match with that
                  </p>
                  <div className="flex-1/2 items-center justify-center ">
                    <label
                      class="block uppercase tracking-wide text-white text-xs font-bold mb-2"
                      for="grid-first-name"
                    >
                      Enter Amount in MATIC
                    </label>
                    <input
                      class="appearance-none block  bg-btn-input text-white border border-play-hand-btn rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:border-white"
                      id="grid-first-name"
                      type="text"
                      placeholder="0"
                    />
                    <div
                      className={`flex items-center  rounded p-2 bg-btn-purple border-play-hand-btn mb-4 border-2 cursor-pointer justify-center `}
                    >
                      <button className="inline-block">Deposit Amount</button>
                    </div>
                  </div>
                </div>
              </div>
              {/* Withdraw */}
              <div className="">
                <div className="bg-dark-purple text-heading-color text-2xl p-2 font-press-start">
                  Withdraw
                </div>
                <div className="bg-play-comp-color p-4">
                  <p className="text-md p-2">
                    You can Withdraw all your MATIC in Web3 Chess
                  </p>
                  <div
                    className={`flex items-center  rounded p-2 bg-btn-purple border-play-hand-btn mb-4 border-2 cursor-pointer justify-center `}
                  >
                    <button className="inline-block">WithDraw</button>
                  </div>
                </div>
              </div>
            </div>

            {/* 3rd box */}
            <div className="mt-4">
              <div className="bg-dark-purple text-heading-color text-2xl p-4">
                Web3 Chess NFT Gallery
              </div>
              <div className="flex items-center justify-between bg-play-comp-color w-full p-8 overflow-x-scroll">
                {nfts &&
                  totalNFTs > 0 &&
                  nfts.map(nft => {
                    return (
                      <div>
                        <img
                          alt="nft"
                          src={nft.image}
                          height="200"
                          width="300"
                        />
                        <h2
                          className="font-press-start text-nft-heading cursor-pointer"
                          onClick={() => (window.location.href = nft.image)}
                        >
                          {nft?.metadata?.title}
                        </h2>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

export default DashBoard;
