import React from 'react';
import Portal from '../../shared/Portal';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import ModalContainer from '../../shared/ModalContainer';
import CloseBtn from '../../components/CloseBtn';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import { useMoralisFile } from 'react-moralis';
import Moralis from 'moralis';
import { useMoralisDapp } from '../../contexts/MoralisDappProvider';
import { useWeb3ExecuteFunction } from 'react-moralis';

function CreateMatch({ setCreateModalOpen }) {
  const navigate = useNavigate();
  const { walletAddress, gameAddress, gameContractABI, chainId } =
    useMoralisDapp();
  const ipfsProcessor = useMoralisFile();
  const contractProcessor = useWeb3ExecuteFunction();

  const checkAddress = add => ethers.utils.isAddress(add);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm();

  const processContent = async content => {
    const ipfsResult = await ipfsProcessor.saveFile(
      'invite.json',
      { base64: btoa(JSON.stringify(content)) },
      { saveIPFS: true },
    );

    const data = {
      hash: ipfsResult._hash,
      URI: ipfsResult._ipfs,
    };
    return data;
  };

  const getBalance = async () => {
    const options = {
      contractAddress: gameAddress,
      functionName: 'getPlayerBalance',
      abi: gameContractABI,
      // msgValue: Moralis.Units.ETH('0.05'),
      params: {
        playerAddress: walletAddress,
      },
    };
    await Moralis.enableWeb3();
    const amountInWei = await Moralis.executeFunction(options);
    const web3 = new Moralis.Web3();
    const amountInEth = web3.utils.fromWei(amountInWei, 'ether');
    return amountInEth;
  };

  const onSubmit = async data => {
    const fields = { fields: data };
    const balance = await getBalance();

    if (data.amount > balance) {
      setError('amount', {
        type: 'manual',
        message: 'Your Balance is less than the amount',
      });
    }

    const opponentAddress = data.address;

    const beforeMatchData = {
      platform: 'web3Chess',
      player1: walletAddress,
      player1Color: 'white',
      player2: opponentAddress,
      player2Color: 'black',
      stake: data.amount,
      time: 60000,
    };

    const res = await processContent(beforeMatchData);
    const beforeMatchDataURI = res.URI;
    const gameCode = res.hash;

    const options = {
      contractAddress: gameAddress,
      functionName: 'startGame',
      abi: gameContractABI,
      params: {
        gameCode,
        beforeMatchDataURI,
        opponent: opponentAddress,
        stake: data.amount,
      },
    };
    await contractProcessor.fetch({
      params: options,
      onSuccess: () => {
        navigate('/play', {
          state: {
            gameData: {
              code: gameCode,
              startColor: 'white',
              white: {
                address: walletAddress,
                remainingTime: 600000,
              },
              black: {
                address: opponentAddress,
                remainingTime: 600000,
              },
            },
          },
        });
      },
      onError: error => console.error(error),
    });
  };
  const options = [{ value: '10', label: '10 Minutes' }];
  const matchOptions = [{ value: 'standard', label: 'Standard' }];
  return (
    <ModalContainer>
      <h1 className="text-center text-4xl font-semibold mt-10">
        Create a Match
      </h1>
      <div
        className="absolute top-2 right-2 h-6 cursor-pointer"
        onClick={() => setCreateModalOpen(false)}
      >
        <CloseBtn />
      </div>

      <form
        className="max-w-xl m-auto py-10 mt-10 px-12 border"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Select
          value={matchOptions[0]}
          // onChange={handleChange}
          options={matchOptions}
          className="mb-4"
        />
        <Select
          value={options[0]}
          // onChange={handleChange}
          options={options}
        />
        <label className="text-gray-600 font-medium">
          Opponent Ethereum Address
        </label>
        <input
          className="border-solid border-gray-300 border py-2 px-4 w-full rounded text-gray-700"
          name="address"
          placeholder="Enter full address"
          autoFocus
          {...register('address', {
            required: 'Please enter a valid address',
            validate: checkAddress,
          })}
        />
        {errors.address && (
          <div className="mb-3 text-normal text-red-500">
            {errors.address.message}
          </div>
        )}

        <label className="text-gray-600 font-medium">
          Enter Amount To Stake
        </label>
        <input
          className="border-solid border-gray-300 border py-2 px-4 w-full rounded text-gray-700"
          name="amount"
          type="number"
          placeholder="Enter amount"
          autoFocus
          {...register('amount', {
            valueAsNumber: true,
            required: 'Please enter a valid amount',
          })}
        />
        {errors.amount && (
          <div className="mb-3 text-normal text-red-500">
            {errors.amount.message}
          </div>
        )}

        <button
          className="mt-4 w-full bg-green-400 hover:bg-green-600 text-green-100 border py-3 px-6 font-semibold text-md rounded"
          type="submit"
        >
          Submit
        </button>
      </form>
    </ModalContainer>
  );
}

export default Portal(CreateMatch);
