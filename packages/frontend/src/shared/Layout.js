import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { useWeb3 } from '../contexts/Web3Context';
import { SUPPORTED_NETWORKS } from '../utils/constants';
import { ConnectWeb3 } from './ConnectWeb3';
import { useMoralis } from 'react-moralis';
import Header from './Header';
import { useMoralisDapp } from '../contexts/MoralisDappProvider';
import PageContainer from '../shared/PageContainer';

function Layout({ children }) {
  const { chainId } = useMoralisDapp();
  const location = useLocation();
  const isOpenPath = location.pathname === '/';
  const isValid =
    SUPPORTED_NETWORKS.indexOf(parseInt(chainId, 16)) !== -1 || isOpenPath;
  return (
    <PageContainer>
      <Header />
      {isValid ? children : <ConnectWeb3 />}
    </PageContainer>
  );
}

export default Layout;
