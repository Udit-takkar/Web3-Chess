import React from 'react';
import Portal from '../../shared/Portal';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import ModalContainer from '../../shared/ModalContainer';
import CloseBtn from '../../components/CloseBtn';
import { useWeb3 } from '../../contexts/Web3Context';
import { ethers } from 'ethers';
import { makeFileObjects, storeFiles } from '../../utils/web3storage';
// import { StorageNode } from 'streamr-client';
import { useNavigate } from 'react-router-dom';

function CreateMatch({ setCreateModalOpen }) {
  const navigate = useNavigate();
  const checkAddress = add => ethers.utils.isAddress(add);
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm();
  const { gameContractProvider, gameContract, account, client } = useWeb3();
  const onSubmit = async data => {
    const fields = { fields: data };

    const balance = await gameContractProvider.getPlayerBalance(account);
    if (data.amount > balance) {
      setError('amount', {
        type: 'manual',
        message: 'Your Balance is less than the amount',
      });
    }

    //  Saving Data To Web3 Storage
    const opponentAddress = data.address;
    const beforeMatchData = {
      player1: account,
      player1Color: 'white',
      player2: opponentAddress,
      player2Color: 'black',
      stake: data.amount,
      time: 600000,
      createdBy: account,
    };
    const uploadedFiles = await makeFileObjects(beforeMatchData);
    const beforeMatchCID = await storeFiles(uploadedFiles);
    const beforeMatchDataURI = `https://ipfs.infura.io/ipfs/${beforeMatchCID}`;
    console.log(beforeMatchDataURI);
    // Creating Stream streams for publishing and subscribing match data
    const gameCode = `${account}/${Date.now()}`;
    const stream = await client.createStream({
      id: gameCode,
    });

    // Setting up permission for streamr streams
    if (!(await stream.hasPermission('stream_get', null))) {
      await stream.grantPermission('stream_get', null);
    }
    if (!(await stream.hasPermission('stream_publish', opponentAddress))) {
      await stream.grantPermission('stream_publish', opponentAddress);
    }
    if (!(await stream.hasPermission('stream_subscribe', null))) {
      await stream.grantPermission('stream_subscribe', null);
    }

    // locking the values in the contract
    const price = ethers.utils.parseUnits(data.amount.toString(), 'ether');
    const transaction = await gameContract.startGame(
      gameCode,
      beforeMatchDataURI,
      data.address,
      price,
    );
    await transaction.wait();
    navigate('/play', {
      state: {
        gameData: {
          code: gameCode,
          startColor: 'white',
          white: {
            address: account,
            remainingTime: 600000,
          },
          black: {
            address: opponentAddress,
            remainingTime: 600000,
          },
        },
      },
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
