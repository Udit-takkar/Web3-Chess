import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { Web3Context } from '../contexts/Web3Context';
import { SUPPORTED_NETWORKS } from '../utils/constants';
import { ConnectWeb3 } from './ConnectWeb3';
import Header from './Header';

function Layout({ children }) {
  const { chainId } = useContext(Web3Context);
  const location = useLocation();
  const isOpenPath = location.pathname === '/';
  const isValid = SUPPORTED_NETWORKS.indexOf(chainId) !== -1 || isOpenPath;
  return (
    <div className="flex flex-col justify-center items-center min-h-screen h-full overflow-x-hidden	">
      <Header />
      {isValid ? children : <ConnectWeb3 />}
    </div>
  );
}

export default Layout;
