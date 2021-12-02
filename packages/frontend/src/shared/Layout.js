import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { useWeb3 } from '../contexts/Web3Context';
import { SUPPORTED_NETWORKS } from '../utils/constants';
// import { ConnectWeb3 } from './ConnectWeb3';
import { useMoralis } from 'react-moralis';
import Header from './Header';
import { useMoralisDapp } from '../contexts/MoralisDappProvider';

function Layout({ children }) {
  const { chainId } = useMoralisDapp();
  const location = useLocation();
  const isOpenPath = location.pathname === '/';
  const isValid =
    SUPPORTED_NETWORKS.indexOf(parseInt(chainId, 16)) !== -1 || isOpenPath;
  return (
    <div className="flex flex-col justify-center items-center min-h-screen h-full overflow-x-hidden">
      <Header />
      {isValid ? children : <h1>Connect</h1>}
    </div>
  );
}

export default Layout;
