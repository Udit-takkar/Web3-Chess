import React, { useEffect, useState, useRef } from 'react';
import ModalContainer from '../../shared/ModalContainer';
import CloseBtn from '../../components/CloseBtn';
import { saveData } from '../../utils/ipfsClient';
import { useMoralisFile, useWeb3ExecuteFunction } from 'react-moralis';
import { useMoralisDapp } from '../../contexts/MoralisDappProvider';
import { pgn2gifURL } from '../../utils/constants';
import GIFPlaceholder from '../../assets/GIFPlaceholder.png';
import Portal from '../../shared/Portal';

function MintChessGIF({ pgn, movesHash, setChessGIFmodalOpen }) {
  const [imgSrc, setImg] = useState(null);
  const ipfsProcessor = useMoralisFile();
  const [gifBlob, setBlob] = useState(null);
  const contractProcessor = useWeb3ExecuteFunction();

  const { nftContractABI, nftContract } = useMoralisDapp();

  useEffect(() => {
    const load = async () => {
      const res = await fetch(pgn2gifURL, {
        method: 'POST',
        body: JSON.stringify({ pgn, movesHash }),
        // mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const blob = await res.blob();
      setBlob(blob);
      setImg(URL.createObjectURL(blob));
    };
    load();
  }, []);
  const processContent = async content => {
    const ipfsResult = await ipfsProcessor.saveFile(
      'nft.json',
      { base64: btoa(JSON.stringify(content)) },
      { saveIPFS: true },
    );

    const data = {
      hash: ipfsResult._hash,
      URI: ipfsResult._ipfs,
    };
    return data;
  };

  const handleClick = async () => {
    const imgCID = await saveData(gifBlob);
    const metadata = {
      title: 'Web3 Chess Match',
      description: `GIF of the moves played in the game`,
      image: imgCID,
    };
    const data = await processContent(metadata);
    const tokenURI = data.URI;
    const options = {
      contractAddress: nftContract,
      functionName: 'createToken',
      abi: nftContractABI,
      // msgValue: Moralis.Units.ETH('0.05'),
      params: {
        tokenURI,
      },
    };
    await contractProcessor.fetch({
      params: options,
    });
  };

  return (
    <ModalContainer style={{ backgroundColor: '#FFFFFF14' }}>
      <div className="flex flex-col justify-content items-center z-30 text-white">
        <div className="bg-dark-purple text-heading-color  backdrop-filter	backdrop-blur-md  text-3xl text-center p-4 font-montserrat w-full">
          Mint Your Game NFT
        </div>
        <div
          className="absolute top-2 right-2 h-6 cursor-pointer"
          onClick={() => setChessGIFmodalOpen(false)}
        >
          <CloseBtn />
        </div>

        <div className="relative flex flex-col justify-content items-center backdrop-filter	backdrop-blur-md px-20 bg-play-comp-color border-play-hand-btn pt-8 rounded-bl-lg rounded-br-lg">
          <img alt="Gif" src={imgSrc ? imgSrc : GIFPlaceholder} />
          {imgSrc ? null : (
            <div className="absolute top-44 flex items-center justify-center flex-col-reverse">
              <p className="font-montserrat ">
                Generating GIF from moves played in the match
              </p>
              <div className="w-16 h-16 border-b-2 border-white rounded-full animate-spin"></div>
            </div>
          )}
          <button
            onClick={imgSrc ? handleClick : null}
            className="bg-btn-purple border-play-hand-btn mb-2 border-2 cursor-pointer p-2 font-montserrat rounded-lg mt-4"
          >
            Mint This GIF
          </button>
        </div>
      </div>
    </ModalContainer>
  );
}

export default Portal(MintChessGIF);
