import React from 'react';
import ModalContainer from '../../shared/ModalContainer';
import CloseBtn from '../../components/CloseBtn';
import Portal from '../../shared/Portal';
import { useNavigate } from 'react-router-dom';

function WinModal({ setOpen, setWinnerCanvasNFTOpen, setChessGIFmodalOpen }) {
  const navigate = useNavigate();
  return (
    <ModalContainer style={{ backgroundColor: '#FFFFFF14' }}>
      <div className="flex flex-col font-montserrat backdrop-filter	backdrop-blur-md bg-play-comp-color p-8 z-0 text-white">
        <div
          className="absolute top-2 right-2 h-6 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <CloseBtn />
        </div>

        <h1 className="bg-dark-purple text-3xl text-center p-4">
          Congratulations! You Have won the Match.
          <br /> You can get your rewards
        </h1>
        <button
          onClick={() => setWinnerCanvasNFTOpen(true)}
          className="bg-btn-purple border-play-hand-btn mb-2 border-2 cursor-pointer p-2 font-montserrat rounded-lg mt-4"
        >
          Get Winners NFT
        </button>
        <button
          onClick={() => setChessGIFmodalOpen(true)}
          className="bg-btn-purple border-play-hand-btn mb-2 border-2 cursor-pointer p-2 font-montserrat rounded-lg mt-4"
        >
          Get Full Chess Match Moves GIF NFT
        </button>
      </div>
    </ModalContainer>
  );
}

export default Portal(WinModal);
