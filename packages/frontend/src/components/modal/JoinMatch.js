import React, { useState } from 'react';
import Portal from '../../shared/Portal';
import { useForm } from 'react-hook-form';
import ModalContainer from '../../shared/ModalContainer';
import CloseBtn from '../../components/CloseBtn';
import { useWeb3 } from '../../contexts/Web3Context';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function JoinMatch({ setJoinModalOpen }) {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const { gameContractProvider, gameContract, account, client } = useWeb3();
  const [showMatchDetails, setShowMatchDetails] = useState(false);
  const [
    { player1, player2, player2Color, player1Color, stake, code },
    setMatchData,
  ] = useState({});
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const onSubmit = async data => {
    const fields = { fields: data };
    setLoading(true);
    try {
      //  Just Load the Match Details for the use to accept the
      const url = await gameContractProvider.getGameDetails(data.code);
      const res = await axios.get(`${url}/game.json`);
      setMatchData({ ...res.data, code: data.code });
      setShowMatchDetails(true);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = async () => {
    try {
      const balance = await gameContractProvider.getPlayerBalance(account);
      if (balance < stake) {
        setErr('Not Enough Balance');
      }

      const transaction = await gameContract.participateGame(code);
      await transaction.wait();
      const msg = {
        type: 'join',
        from: account,
      };
      await client.publish(code, msg);

      navigate('/play', {
        state: {
          gameData: {
            code,
            startColor: player2Color,
            white: {
              address: player2Color === 'white' ? player2 : player1,
              remainingTime: 600000,
            },
            black: {
              address: player2Color === 'black' ? player2 : player1,
              remainingTime: 600000,
            },
          },
        },
      });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <ModalContainer>
      <h1 className="text-center text-4xl font-semibold mt-10">Join Match</h1>
      <div
        className="absolute top-2 right-2 h-6"
        onClick={() => setJoinModalOpen(false)}
      >
        <CloseBtn />
      </div>

      {!showMatchDetails && (
        <form
          className="max-w-xl m-auto py-10 px-12 border"
          onSubmit={handleSubmit(onSubmit)}
        >
          <label className="text-gray-600 font-medium">Enter Match Code</label>
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
            className="mt-4 w-full bg-green-400 hover:bg-green-600 text-green-100 border py-3 px-6 font-semibold text-md rounded"
            type="submit"
          >
            Enter Code
          </button>
        </form>
      )}
      {showMatchDetails && (
        <div className="p-4">
          <div>Player 1: {player1}</div>
          <div>Player 2: {player2}</div>
          <div>Player 1 Color: {player1Color}</div>
          <div>Player 2 Color: {player2Color}</div>
          <div>Amount to be staked: {stake} </div>
          <div>Game Code : {code}</div>
          <div className="flex m-4">
            <button
              onClick={() => navigate('/')}
              className="mt-4 w-full bg-green-400 hover:bg-green-600 text-green-100 border py-3 px-6 font-semibold text-md rounded"
            >
              Reject
            </button>
            <button
              onClick={handleClick}
              className="mt-4 w-full bg-green-400 hover:bg-green-600 text-green-100 border py-3 px-6 font-semibold text-md rounded"
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
