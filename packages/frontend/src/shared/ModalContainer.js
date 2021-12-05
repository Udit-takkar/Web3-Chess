import React from 'react';

function ModalContainer({ children, ...props }) {
  return (
    <div className="absolute h-full w-full top-0 left-0 flex items-center justify-center z-10 bg-gray-600 bg-modal-bg-color ">
      <div className="bg-white opacity-100 relative" {...props}>
        {children}
      </div>
    </div>
  );
}

export default ModalContainer;
