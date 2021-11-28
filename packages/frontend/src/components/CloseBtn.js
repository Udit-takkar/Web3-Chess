import React from 'react';

function CloseBtn() {
  return (
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
  );
}

export default CloseBtn;
