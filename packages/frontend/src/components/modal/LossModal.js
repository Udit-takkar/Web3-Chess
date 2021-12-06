import React from 'react';
import ModalContainer from '../../shared/ModalContainer';
import CloseBtn from '../../components/CloseBtn';
import Portal from '../../shared/Portal';
import { useNavigate } from 'react-router-dom';

function LossModal({ setOpen }) {
  const navigate = useNavigate();
  return (
    <ModalContainer style={{ backgroundColor: '#FFFFFF14' }}>
      <div className="flex flex-col font-montserrat backdrop-filter	backdrop-blur-md bg-dark-purple p-20 z-0 text-white text-center ">
        <div
          className="absolute top-2 right-2 h-6 cursor-pointer"
          onClick={() => setOpen(false)}
        >
          <CloseBtn />
        </div>
        <h1 className="text-2xl">
          Better Luck Next Time! You Lost The Chess Match
        </h1>
        <h1 className="text-2xl">Want to try again?</h1>
      </div>
    </ModalContainer>
  );
}

export default Portal(LossModal);
