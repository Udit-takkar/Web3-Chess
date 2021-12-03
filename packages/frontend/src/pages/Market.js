import React from 'react';
import PageContainer from '../shared/PageContainer';
import { useNFTBalance } from '../hooks/useNFTBalance';
import { useNFTTokenIds } from '../hooks/useNFTTokenIds';

function Market() {
  const { NFTBalance, getNFTBalance, isLoading } = useNFTBalance();
  const { NFTTokenIds, totalNFTs, getNFTTokenIds } = useNFTTokenIds(
    '0x3d7285fb95677b9e128f00012106323ed9da223e',
  );

  console.log(totalNFTs);
  console.log(NFTTokenIds);
  return (
    <PageContainer>
      <div className="flex items-center justify-center">
        <button
          className="btn text-white mt-80"
          onClick={() => getNFTTokenIds()}
        >
          Get NFTS
        </button>
      </div>
    </PageContainer>
  );
}

export default Market;
