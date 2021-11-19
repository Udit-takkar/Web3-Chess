import React, { useContext } from 'react';
import { Web3Context } from '../contexts/Web3Context';

function Home() {
  const { connectAccount, loading, account, disconnect } =
    useContext(Web3Context);
  return <div>Test {account}</div>;
}

export default Home;
