import React from 'react';
import { useSelector } from 'react-redux';
import { TheContent, TheHeader } from '.';
import ErrorModal from '../shared/components/ErrorModal';
import { RootState } from '../shared/reducers';

const TheLayout = () => {
  const { providerErrorMessage } = useSelector((state: RootState) => state.wallet);

  return (
    <>
      <div className="dapp-layout">
        {!providerErrorMessage ? (
          <div className="c-wrapper">
            <TheHeader />
            <div className="c-body">
              <TheContent />
            </div>
          </div>
        ) : (
          <ErrorModal errMsg={providerErrorMessage} />
        )}
      </div>
    </>
  );
};
export default TheLayout;
