import React, { useState } from 'react';
import ModalContainer from '../../shared/ModalContainer';
import CloseBtn from '../../components/CloseBtn';
import { useMoralisDapp } from '../../contexts/MoralisDappProvider';
import { useWeb3ExecuteFunction } from 'react-moralis';
import Moralis from 'moralis';
import { useNavigate } from 'react-router-dom';

function ListNFT({ nft, setOpen }) {
  console.log(nft);
  const [amount, setAmount] = useState(0);
  const { nftContract, marketPlace, marketPlaceAbi } = useMoralisDapp();
  const navigate = useNavigate();

  const contractProcessor = useWeb3ExecuteFunction();

  const handleClick = async () => {
    const value = parseFloat(amount);
    const options = {
      contractAddress: marketPlace,
      functionName: 'createMarketItem',
      abi: marketPlaceAbi,
      // msgValue: Moralis.Units.ETH('0.05'),
      params: {
        nftContract,
        tokenId: nft.token_id,
        price: Moralis.Units.ETH(value),
      },
    };
    await contractProcessor.fetch({
      params: options,
      onError: err => {
        console.log(err);
      },
      onSuccess: () => {
        navigate('/market');
      },
    });
  };
  return (
    <ModalContainer style={{ backgroundColor: '#FFFFFF14' }}>
      <div className="flex flex-col font-montserrat backdrop-filter	backdrop-blur-md bg-dark-purple p-10 z-0 text-white text-center">
        <div
          className="absolute top-2 right-2 h-6 cursor-pointer"
          onClick={() => setOpen(false)}
        >
          <CloseBtn />
        </div>
        {!nft ? (
          <div className="flex items-center justify-center ">
            <div className="w-8 h-8 border-b-2 border-white rounded-full animate-spin"></div>
          </div>
        ) : (
          <div>
            <img
              src={`https://ipfs.infura.io/ipfs/${nft.image}`}
              alt="nft"
              height="400"
              width="400"
            />
            <h1>
              {nft.metadata.title} #{nft.token_id}
            </h1>
            <label
              className="block uppercase tracking-wide text-white text-xs font-bold mb-2"
              for="grid-first-name"
            >
              Enter Price for this NFT in MATIC
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
              onClick={handleClick}
              className={`flex items-center  rounded p-2 bg-btn-purple border-play-hand-btn mb-4 border-2 cursor-pointer justify-center `}
            >
              <button className="inline-block">List</button>
            </div>
          </div>
        )}
      </div>
    </ModalContainer>
  );
}
export default ListNFT;
