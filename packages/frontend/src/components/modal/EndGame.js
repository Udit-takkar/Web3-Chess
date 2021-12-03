import React, { useEffect, useRef, useState } from 'react';
import NFTtemplate from '../../assets/chessmeme.jpeg';
import Portal from '../../shared/Portal';
import ModalContainer from '../../shared/ModalContainer';
import { saveData } from '../../utils/ipfsClient';
import CloseBtn from '../../components/CloseBtn';
import { useMoralisDapp } from '../../contexts/MoralisDappProvider';
import { useWeb3ExecuteFunction } from 'react-moralis';
import { useMoralisFile } from 'react-moralis';
import Moralis from 'moralis';

function EndGame({ setOpen, opponent }) {
  const canvasRef = useRef(null);
  const [finalImg, setImg] = useState(null);
  const {
    walletAddress,
    gameAddress,
    gameContractABI,
    chainId,
    nftContractABI,
    nftContract,
  } = useMoralisDapp();
  const ipfsProcessor = useMoralisFile();
  const contractProcessor = useWeb3ExecuteFunction();

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const text = `Game Over! I owned \n${opponent}\nin Chess`;
    const lines = text.split('\n');
    const x = 275;
    const y = 50;
    const lineHeight = 28;
    const imageObj = new Image();
    imageObj.onload = () => {
      context.drawImage(imageObj, 10, 10);
      context.font = '16pt Calibri';
      for (let i = 0; i < lines.length; ++i) {
        context.fillText(lines[i], x, y + i * lineHeight);
      }
      context.font = '10pt Calibri';
      context.fillText(`Date: ${Date.now()}`, 650, 555);
      canvas.toBlob(function (blob) {
        setImg(blob);
      }, 'image/png');
    };
    imageObj.src = NFTtemplate;
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
    const imgCID = await saveData(finalImg);
    const metadata = {
      title: 'Web3 Chess Victory',
      description: `Awarded for beating ${opponent} in chess by  Web3Chess `,
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
    <ModalContainer>
      <div
        className="absolute top-2 right-2 h-6 cursor-pointer"
        onClick={() => setOpen(false)}
      >
        <CloseBtn />
      </div>
      <div className="flex flex-col bg-yellow-100	 p-4">
        <canvas ref={canvasRef} width={800} height={600} />
        <div className="flex items-center justify-center">
          <button
            onClick={handleClick}
            className="bg-nav text-white text-center rounded px-4 py-2"
          >
            Mint This NFT
          </button>
        </div>
      </div>
    </ModalContainer>
  );
}

export default Portal(EndGame);
