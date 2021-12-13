import React from 'react';
import { TheContent, TheHeader } from '.';

const TheLayout = () => {
  return (
    <>
      <div className="dapp-layout">
        <div className="c-wrapper">
          <TheHeader/>
          <div className="c-body">
            <TheContent />
          </div>
        </div>
      </div>
    </>
  );
};

export default TheLayout;
