import React from 'react';
import ModalContainer from '../../shared/ModalContainer';

import queen from '../../assets/wQ.svg';
import rook from '../../assets/wR.svg';
import bishop from '../../assets/wB.svg';
import knight from '../../assets/wN.svg';

function Promotion({ promotion }) {
  return (
    <ModalContainer>
      <div className="text-center cursor-pointer flex p-4">
        <span onClick={() => promotion('q')}>
          <img src={queen} alt="" style={{ width: 50 }} />
        </span>
        <span onClick={() => promotion('r')}>
          <img src={rook} alt="" style={{ width: 50 }} />
        </span>
        <span onClick={() => promotion('b')}>
          <img src={bishop} alt="" style={{ width: 50 }} />
        </span>
        <span onClick={() => promotion('n')}>
          <img src={knight} alt="" style={{ width: 50 }} />
        </span>
      </div>
    </ModalContainer>
  );
}

export default Promotion;
