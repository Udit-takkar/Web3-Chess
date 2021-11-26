import React, { useContext, useEffect, useState, useRef } from 'react';
import { Web3Context } from '../contexts/Web3Context';
import CreateMatch from '../components/modal/CreateMatch';
import JoinMatch from '../components/modal/JoinMatch';

function Home() {
  const { connectAccount, loading, account, disconnect } =
    useContext(Web3Context);

  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isJoinMatchModalOpen, setJoinModalOpen] = useState(false);

  return (
    <div>
      {isCreateModalOpen && (
        <CreateMatch setCreateModalOpen={setCreateModalOpen} />
      )}
      {isJoinMatchModalOpen && (
        <JoinMatch setJoinModalOpen={setJoinModalOpen} />
      )}
    </div>
  );
}

export default Home;
