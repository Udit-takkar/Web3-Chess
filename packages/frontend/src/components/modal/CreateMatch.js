import React from 'react';
import Portal from '../../shared/Portal';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import ModalContainer from '../../shared/ModalContainer';

function CreateMatch({ setCreateModalOpen }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = async data => {
    const fields = { fields: data };
  };
  const options = [{ value: '10', label: '10 Minutes' }];
  const matchOptions = [{ value: 'standard', label: 'Standard' }];
  return (
    <ModalContainer>
      <h1 className="text-center text-4xl font-semibold mt-10">
        Create a Match
      </h1>
      <div
        className="absolute top-2 right-2 h-6"
        onClick={() => setCreateModalOpen(false)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
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
          placeholder="Enter amount"
          autoFocus
          {...register('amount', {
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
