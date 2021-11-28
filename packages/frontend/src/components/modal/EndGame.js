import React, { useEffect, useRef, useState } from 'react';
import NFTtemplate from '../../assets/chessmeme.jpeg';
import Portal from '../../shared/Portal';
import ModalContainer from '../../shared/ModalContainer';
import { saveData } from '../../utils/ipfsClient';
import { ethers } from 'ethers';
import { useWeb3 } from '../../contexts/Web3Context';
import NFTContract from '../../contracts/NFT.json';
import CloseBtn from '../../components/CloseBtn';

const nftaddress = '0x8f2384375203587Ee33827BD55F59daDDBf8F58f';

function EndGame({ setOpen, opponent }) {
  const canvasRef = useRef(null);
  const [finalImg, setImg] = useState(null);
  const { nftContract } = useWeb3();

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

  const handleClick = async () => {
    const imgCID = await saveData(finalImg);
    const metadata = {
      description: `awarded for beating ${opponent} in chess by  Web3Chess `,
      image: imgCID,
    };
    const stringifyData = await JSON.stringify(metadata);
    const nftCID = await saveData(stringifyData);
    const tokenURI = `https://ipfs.infura.io/ipfs/${nftCID}`;

    let transaction = await nftContract.createToken(tokenURI);
    let tx = await transaction.wait();

    let event = tx.events[0];
    let value = event.args[2];
    let tokenId = value.toNumber();
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
