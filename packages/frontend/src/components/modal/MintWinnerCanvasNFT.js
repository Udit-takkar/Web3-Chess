import React, { useEffect, useRef, useState } from 'react';
import NFTtemplate from '../../assets/chessmeme.jpeg';
import Portal from '../../shared/Portal';
import ModalContainer from '../../shared/ModalContainer';
import { saveData } from '../../utils/ipfsClient';
import CloseBtn from '../CloseBtn';
import { useMoralisDapp } from '../../contexts/MoralisDappProvider';
import { useWeb3ExecuteFunction } from 'react-moralis';
import { useMoralisFile } from 'react-moralis';
import moment from 'moment';

function MintWinnerCanvasNFT({ setOpen, opponent }) {
  const canvasRef = useRef(null);
  const [finalImg, setImg] = useState(null);
  const { nftContractABI, nftContract } = useMoralisDapp();
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
      const dateToDisplay = moment().format('dddd, MMMM Do YYYY, h:mm:ss a');
      context.font = '9pt Calibri';
      context.fillText(`${dateToDisplay}`, 570, 555);
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
    <ModalContainer
      style={{ backgroundColor: '#FFFFFF14', borderRadius: '30px' }}
    >
      <div className="flex flex-col bg-dark-purple backdrop-filter 	backdrop-blur-md  p-4 rounded-lg border-play-hand-btn border-2">
        <div
          className="absolute top-2 right-2 h-6 cursor-pointer bg-white "
          onClick={() => setOpen(false)}
        >
          <CloseBtn />
        </div>
        <canvas ref={canvasRef} width={800} height={600} />
        <div className="flex items-center justify-center">
          <button
            onClick={handleClick}
            className="bg-btn-purple border-play-hand-btn text-white mb-2 border-2 cursor-pointer p-4 font-montserrat rounded-lg"
          >
            Mint This NFT
          </button>
        </div>
      </div>
    </ModalContainer>
  );
}

export default Portal(MintWinnerCanvasNFT);
