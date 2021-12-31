import React from 'react';
import { useSelector } from 'react-redux';
import { TheContent, TheHeader } from '.';
import ConfirmModal from '../shared/components/ConfirmModal';
import { RootState } from '../shared/reducers';

const TheLayout = () => {
  const { getProviderSuccess } = useSelector((state: RootState) => state.wallet);

  return (
    <>
      <div className="dapp-layout">
        {getProviderSuccess ? (
          <div className="c-wrapper">
            <TheHeader />
            <div className="c-body">
              <TheContent />
            </div>
          </div>
        ) : (
          <NoWalletDetectedModal />
        )}
      </div>
    </>
  );
};
export default TheLayout;

const NoWalletDetectedModal = () => (
  <ConfirmModal
    color={'danger'}
    isVisible={true}
    onConfirm={() => {}}
    onAbort={() => {}}
    hideFooter={true}
    title={'Please install an Ethereum Wallet!'}
    disableCloseBackdrop={true}
    CustomJSX={() => (
      <div className="container">
        <div className="row p-0 m-0 justify-content-center">
          <div className="text-center col-xs-12">
            <p className={`lead p-0`}>
              No Ethereum wallet was detected. <br />
              Please install{' '}
              <a href="http://metamask.io" target="_blank" rel="noopener noreferrer">
                MetaMask
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    )}
  />
);

