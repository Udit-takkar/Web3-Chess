import React, { useEffect, useState } from 'react';
import PageContainer from '../shared/PageContainer';
import Blockies from 'react-blockies';
import { getAccountString } from '../utils/helpers';
import { useMoralisDapp } from '../contexts/MoralisDappProvider';
import ViewOnPolyscanLogo from '../components/ViewOnPolyscan';
import Moralis from 'moralis';
import Matic from '../assets/polygon.svg';
// import { useNFTTokenIds } from '../hooks/useNFTTokenIds';
import { useWeb3ExecuteFunction } from 'react-moralis';
import { useNFTBalance } from '../hooks/useNFTBalance';

function DashBoard() {
  const { walletAddress, gameAddress, gameContractABI, nftContract } =
    useMoralisDapp();
  const { NFTBalance, getNFTBalance } = useNFTBalance({
    token_address: nftContract,
  });

  const [balance, setBalance] = useState(0);

  // const [nfts, setNfts] = useState([]);
  const [amount, setAmount] = useState(0);

  const contractProcessor = useWeb3ExecuteFunction();

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
      getNFTBalance();
    }
  }, [nftContract]);

  const handleDeposit = async () => {
    const value = parseFloat(amount);
    const options = {
      contractAddress: gameAddress,
      functionName: 'deposit',
      abi: gameContractABI,
      msgValue: Moralis.Units.ETH(value),
    };

    await contractProcessor.fetch({
      params: options,
    });
  };

  const handleWithdraw = async () => {
    const options = {
      contractAddress: gameAddress,
      functionName: 'withdraw',
      abi: gameContractABI,
      // msgValue: Moralis.Units.ETH(value),
    };
    await contractProcessor.fetch({
      params: options,
    });
  };

  return (
    <PageContainer>
      <div className=" flex flex-col mt-20 items-center justify-center w-full text-white font-montserrat">
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
                  // bgColor=""
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

            <div
              className="grid grid-cols-2 mt-4 w-full py-2 gap-8"
              style={{ gridAutoRows: '1fr' }}
            >
              {/* Deposit */}
              <div className="">
                <div className="bg-dark-purple text-heading-color text-2xl p-4 font-press-start">
                  Deposit
                </div>
                <div className="bg-play-comp-color p-4 rounded-br-lg rounded-bl-lg ">
                  <p className="text-md">
                    Transfer your MATIC coins to Web3Chess to stake and start
                    chess match with that
                  </p>
                  <div className="flex-1/2 items-center justify-center ">
                    <label
                      className="block uppercase tracking-wide text-white text-xs font-bold mb-2"
                      for="grid-first-name"
                    >
                      Enter Amount in MATIC
                    </label>
                    <input
                      className="appearance-none block  bg-btn-input text-white border w-full border-play-hand-btn rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:border-white"
                      id="grid-first-name"
                      type="text"
                      placeholder="0"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                    />
                    <div
                      className={`flex items-center  rounded p-2 bg-btn-purple border-play-hand-btn mb-4 border-2 cursor-pointer justify-center `}
                    >
                      <button onClick={handleDeposit} className="inline-block">
                        Deposit Amount
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* Withdraw */}
              <div className="flex flex-col ">
                <div className="bg-dark-purple text-heading-color text-2xl p-4 font-press-start">
                  Withdraw
                </div>
                <div className="bg-play-comp-color flex flex-col p-4 flex-1 justify-between rounded-br-lg rounded-bl-lg ">
                  <p className="text-md p-2">
                    You can Withdraw all your MATIC in from Web3 Chess to your
                    wallet
                  </p>
                  <div
                    onClick={handleWithdraw}
                    className={`flex items-center  rounded p-2 bg-btn-purple border-play-hand-btn mb-4 border-2 cursor-pointer justify-center `}
                  >
                    <button className="inline-block">WithDraw</button>
                  </div>
                </div>
              </div>
            </div>

            {/* 3rd box */}
            <div className="mt-4">
              <div className="bg-dark-purple text-heading-color text-2xl p-4 font-press-start">
                Web3 Chess NFT Gallery
              </div>
              <div className="flex overflow-auto">
                <div className="flex  items-center flex-1  flex-nowrap bg-play-comp-color p-8 ">
                  {NFTBalance?.sort(
                    (a, b) => b.block_number_minted - a.block_number_minted,
                  ).map(nft => {
                    return (
                      <div key={nft.token_id} className="mx-2 h-60 w-60">
                        <img
                          alt="nft"
                          src={`https://ipfs.infura.io/ipfs/${nft.image}`}
                          className="h-60 w-60"
                        />
                        <h2
                          className="font-press-start text-xs text-center text-nft-heading cursor-pointer whitespace-nowrap"
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
      </div>
    </PageContainer>
  );
}

export default DashBoard;
