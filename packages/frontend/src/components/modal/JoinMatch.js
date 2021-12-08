import React, { useState } from 'react';
import Portal from '../../shared/Portal';
import { useForm } from 'react-hook-form';
import ModalContainer from '../../shared/ModalContainer';
import CloseBtn from '../../components/CloseBtn';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useMoralisDapp } from '../../contexts/MoralisDappProvider';
import Moralis from 'moralis';
import { useWeb3ExecuteFunction } from 'react-moralis';

function JoinMatch({ setJoinModalOpen }) {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const { walletAddress, gameAddress, gameContractABI, chainId } =
    useMoralisDapp();

  const [showMatchDetails, setShowMatchDetails] = useState(false);
  const [
    { player1, player2, player2Color, player1Color, stake, code },
    setMatchData,
  ] = useState({});
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const contractProcessor = useWeb3ExecuteFunction();

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

  const getDetails = async code => {
    const options = {
      contractAddress: gameAddress,
      functionName: 'getGameDetails',
      abi: gameContractABI,
      // msgValue: Moralis.Units.ETH('0.05'),
      params: {
        gameCode: code,
      },
    };
    await Moralis.enableWeb3();
    const result = await Moralis.executeFunction(options);
    return result;
  };
  const onSubmit = async data => {
    const fields = { fields: data };
    setLoading(true);
    try {
      //  Just Load the Match Details for the use to accept the
      const url = await getDetails(data.code);
      // const url =
      //   'https://ipfs.moralis.io:2053/ipfs/QmPmMJGGNEcRWn8fK7js9wXxUJvqKZHDQvzkeponTzP36r';
      const res = await axios.get(`${url}`);
      if (res.data) setMatchData({ ...res.data, code: data.code });
      setShowMatchDetails(true);
    } catch (err) {
      console.log(err);
      if (err.status === 404) {
        setError('code', {
          type: 'manual',
          message: 'Invalid Code',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClick = async () => {
    try {
      const balance = await getBalance();
      if (balance < stake) {
        setErr('Not Enough Balance');
      }
      const whiteAddress = player2Color === 'white' ? player2 : player1;
      const blackAddress = player2Color === 'black' ? player2 : player1;

      const options = {
        contractAddress: gameAddress,
        functionName: 'participateGame',
        abi: gameContractABI,
        params: {
          gameCode: code,
        },
      };
      await contractProcessor.fetch({
        params: options,
        onSuccess: () => {
          navigate('/play', {
            state: {
              gameData: {
                code,
                startColor: player2Color,
                vsComputer: false,
                from: 'JOIN_MATCH',
                white: {
                  address: whiteAddress,
                  remainingTime: 600000,
                },
                black: {
                  address: blackAddress,
                  remainingTime: 600000,
                },
              },
            },
          });
        },
        onError: error => console.error(error),
      });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <ModalContainer style={{ backgroundColor: '#FFFFFF14' }}>
      <h1 className="bg-dark-purple font-montserrat p-2  backdrop-filter	backdrop-blur-md    border-2  text-heading-color text-center text-3xl font-semibold ">
        Join Match
      </h1>
      <div
        className="absolute top-2 right-2 h-6 cursor-pointer text-white"
        onClick={() => setJoinModalOpen(false)}
      >
        <CloseBtn />
      </div>

      {!showMatchDetails && (
        <form
          className="max-w-xl m-auto py-10 px-12 border font-montserrat backdrop-filter	backdrop-blur-md bg-play-comp-color border-play-hand-btn "
          onSubmit={handleSubmit(onSubmit)}
        >
          <label className="text-black font-medium">Enter Match Code</label>
          <input
            className="border-solid border-gray-300 border py-2 px-4 w-full rounded text-gray-700"
            name="code"
            placeholder="Enter code"
            autoFocus
            {...register('code', {
              required: 'Please enter a valid code',
            })}
          />
          {errors.code && (
            <div className="mb-3 text-normal text-red-500">
              {errors.code.message}
            </div>
          )}
          <button
            className="mt-4 w-full  text-white rounded-lg bg-btn-purple border-play-hand-btn   border py-3 px-6 font-semibold text-md "
            type="submit"
          >
            Enter Code
          </button>
        </form>
      )}
      {showMatchDetails && (
        <div className="p-4 font-montserrat text-2xl text-white   backdrop-filter	backdrop-blur-md">
          <div>Player 1: {player1}</div>
          <div>Player 2: {player2}</div>
          <div>Player 1 Color: {player1Color}</div>
          <div>Player 2 Color: {player2Color}</div>
          <div>Amount to be staked: {stake} </div>
          <div>Game Code : {code}</div>
          <div className="flex m-4">
            <button
              onClick={() => navigate('/')}
              className="mt-4 w-full bg-red-400 text-red-100 border py-3 px-6 font-semibold text-md rounded"
            >
              Reject
            </button>
            <button
              onClick={handleClick}
              className="mt-4 w-full  text-white rounded-lg bg-btn-purple border-play-hand-btn   border py-3 px-6 font-semibold text-md mx-4"
            >
              Accept
            </button>
          </div>
        </div>
      )}
    </ModalContainer>
  );
}

export default Portal(JoinMatch);
