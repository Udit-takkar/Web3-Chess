import React, { useEffect, useState } from 'react';
import PageContainer from '../shared/PageContainer';
// import { useNFTBalance } from '../hooks/useNFTBalance';
// import { useNFTTokenIds } from '../hooks/useNFTTokenIds';
import { useMoralisDapp } from '../contexts/MoralisDappProvider';
import Moralis from 'moralis';
import {
  // useMoralis,
  useMoralisQuery,
  useWeb3ExecuteFunction,
} from 'react-moralis';
import axios from 'axios';
import iconView from '../assets/icon-view.svg';
import matic from '../assets/polygon.svg';
import { Link } from 'react-router-dom';

function Market() {
  // const { NFTBalance, getNFTBalance } = useNFTBalance();
  const { marketPlace, marketPlaceAbi, nftContract, nftContractABI } =
    useMoralisDapp();
  const contractProcessor = useWeb3ExecuteFunction();
  const [marketNFTs, setNFTs] = useState([]);
  // const { NFTTokenIds, totalNFTs, getNFTTokenIds } =
  //   useNFTTokenIds(nftContract);

  const { data, error, isLoading } = useMoralisQuery('MarketplaceItem');

  useEffect(() => {
    const loadNFTs = async () => {
      const fetchMarketItems = JSON.parse(
        JSON.stringify(data, [
          'objectId',
          'createdAt',
          'price',
          'nftContract',
          'itemId',
          'sold',
          'tokenId',
          'seller',
          'owner',
          'confirmed',
        ]),
      );
      const items = await Promise.all(
        fetchMarketItems.map(async i => {
          const options = {
            contractAddress: nftContract,
            functionName: 'tokenURI',
            abi: nftContractABI,
            params: {
              tokenId: i.tokenId,
            },
          };
          const tokenUri = await Moralis.executeFunction(options);
          const meta = await axios.get(tokenUri);
          let item = {
            price: i.price / 1e18,
            tokenId: parseInt(i.tokenId),
            seller: i.seller,
            owner: i.owner,
            image: meta.data.image,
            title: meta.data.title,
            description: meta.data.description,
          };
          return item;
        }),
      );
      console.log(items);
      // const arr = [...items, ...items];
      // const arr2 = [...arr, ...arr];
      // const arr3 = [...arr2, ...arr2];
      // const arr4 = [...arr3, ...arr3];

      setNFTs(items);
    };
    console.log(isLoading);
    if (isLoading === false) loadNFTs();
  }, [isLoading, data]);

  console.log(marketNFTs);

  // useEffect(() => {
  //   const load = async () => {
  //     try {
  //       const options = {
  //         contractAddress: marketPlace,
  //         functionName: 'fetchMarketItems',
  //         abi: marketPlaceAbi,
  //         // msgValue: Moralis.Units.ETH('0.05'),
  //       };
  //       const res = await Moralis.executeFunction(options);
  //       const mappedItems = res.map(i => {
  //           return {
  //             nftContract:i.nftContract,
  //             owner:i.owner,
  //             seller:i.seller,
  //             sold:i.sold,
  //             tokenId:parseInt(i.tokenId),
  //           }
  //       });
  //       // setNFTs(mappedItems);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   load();
  // }, []);

  const handleBuy = async (id, price) => {
    const options = {
      contractAddress: marketPlace,
      functionName: 'createMarketSale',
      abi: marketPlaceAbi,
      msgValue: Moralis.Units.ETH(price),
      params: {
        nftContract,
        itemId: id,
      },
    };
    await contractProcessor.fetch({
      params: options,
    });
  };

  return (
    <PageContainer>
      <h1 className="mt-20 text-heading-color text-5xl font-montserrat underline">
        Explore NFT Market
      </h1>

      {/* <div className="flex flex-wrap flex-1 font-montserrat items-center mt-2 justify-center"> */}
      <div
        className="font-montserrat mt-12 grid place-items-center grid-cols-2 gap-4  lg:grid-cols-3"
        style={{ gridAutoRows: '1fr' }}
      >
        {marketNFTs?.slice(0, 21).map((nft, i) => {
          return (
            <>
              <div
                key={nft.token_id}
                className="flex flex-col bg-play-comp-color backdrop-filter	backdrop-blur-lg w-64 h-full rounded-lg p-6 shadow-2xl sm:w-96 m-4"
              >
                <div
                  className="relative w-full flex place-items-center h-72"
                  id="nft"
                >
                  <div className="absolute grid place-items-center rounded-lg transition w-full h-full duration-200 ease-in-out hover:bg-dark-purple opacity-0 hover:opacity-60 cursor-pointer">
                    <img src={iconView} alt="ojo" id="ojo" />
                  </div>
                  <img
                    src={`https://ipfs.infura.io/ipfs/${nft.image}`}
                    alt="NFT"
                    className="rounded-lg h-full w-full object-contain"
                  />
                </div>

                <Link
                  to={`https://ipfs.infura.io/ipfs/${nft.image}`}
                  className="inline-block mt-4 text-white font-semibold text-lg tracking-wide transition duration-200 ease-in-out hover:text-cyan"
                >
                  {nft.title} #{nft.tokenId}
                </Link>
                <p className="text-softblue my-2 break-all flex-1">
                  {nft.description}
                </p>
                <div className="flex justify-between">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center justify-center">
                      <img src={matic} alt="logo" className="h-4 w-4" />
                      <p className=" ml-2 text-cyan font-semibold">
                        {nft.price} MATIC
                      </p>
                    </div>

                    <button
                      onClick={() => handleBuy(nft.tokenId, nft.price)}
                      className="text-white font-montserrat rounded p-2 bg-btn-purple border-play-hand-btn mb-4 border-2 cursor-pointer"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </>
          );
        })}
      </div>
    </PageContainer>
  );
}

export default Market;
