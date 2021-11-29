import React from 'react';

function PageContainer({ children }) {
  return (
    <div
      className="flex w-full min-h-screen items-center flex-col bg-fixed bg-cover bg-main-bg p-4"
      // style={{ minHeight: 'calc(100vh - 100px)' }}
    >
      {children}
    </div>
  );
}

export default PageContainer;
