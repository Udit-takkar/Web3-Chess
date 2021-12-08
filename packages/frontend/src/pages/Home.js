import React, { useContext, useEffect, useState, useRef } from 'react';
import CreateMatch from '../components/modal/CreateMatch';
import JoinMatch from '../components/modal/JoinMatch';
import ChessBoard from '../assets/ChessBoard.webp';
import playHand from '../assets/playhand.webp';
import Computer from '../assets/computer.webp';
import PageContainer from '../shared/PageContainer';
import { useNavigate } from 'react-router-dom';
import { useMoralisDapp } from '../contexts/MoralisDappProvider';

function Home() {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isJoinMatchModalOpen, setJoinModalOpen] = useState(false);
  const { walletAddress } = useMoralisDapp();

  const navigate = useNavigate();

  const playWithComputer = () => {
    navigate('/play', {
      state: {
        gameData: {
          code: 'play-with-comp',
          startColor: 'white',
          vsComputer: true,
          white: {
            address: walletAddress,
            remainingTime: 600000,
          },
          black: {
            address: '0x00',
            remainingTime: 600000,
          },
        },
      },
    });
  };

  return (
    <PageContainer>
      {isCreateModalOpen && (
        <CreateMatch setCreateModalOpen={setCreateModalOpen} />
      )}
      {isJoinMatchModalOpen && (
        <JoinMatch setJoinModalOpen={setJoinModalOpen} />
      )}
      <div className="flex mt-32 text-white items-center w-full max-w-3/4 justify-around">
        <div className="w-1/2">
          <img alt="chessboard" src={ChessBoard} height="500px" width="500px" />
        </div>
        <div className="w-1/2 h-full flex flex-col">
          <div className="flex-3/4 mb-16">
            <h1 className="text-5xl text-center font-montserrat ">
              Play Web3 Chess. Stake Money. Earn NFTs
            </h1>
          </div>
          <div className="flex-1/4">
            <div
              className={`flex items-center rounded p-2 bg-purple-900 border-play-hand-btn mb-4 border-2 cursor-pointer justify-center`}
              onClick={() => setCreateModalOpen(true)}
            >
              <Button text="Create Match" imgSrc={playHand} />
            </div>
            <div
              className={`flex items-center rounded p-2 bg-purple-900 border-play-hand-btn mb-4 border-2 cursor-pointer justify-center`}
              onClick={() => setJoinModalOpen(true)}
            >
              <Button text="Join Match" imgSrc={playHand} />
            </div>
            <div
              onClick={playWithComputer}
              className={`flex items-center rounded p-2 bg-play-comp-color border-play-hand-btn mb-4 border-2 cursor-pointer justify-center`}
            >
              <Button text="Play With Computer" imgSrc={Computer} />
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

const Button = ({ imgSrc, text, bgColor, borderColor }) => {
  return (
    <>
      <img src={imgSrc} alt={text} width="55px" height="55px" />
      <h2 className="text-2xl font-montserrat">{text}</h2>
    </>
  );
};

export default Home;
