import React from 'react';
import Portal from '../../shared/Portal';
import { useForm } from 'react-hook-form';
import ModalContainer from '../../shared/ModalContainer';
import CloseBtn from '../../components/CloseBtn';

function JoinMatch({ setJoinModalOpen }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = async data => {
    const fields = { fields: data };
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
          Enter
        </button>
      </form>
    </ModalContainer>
  );
}

export default Portal(JoinMatch);
