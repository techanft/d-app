import React from 'react';
import { useSelector } from 'react-redux';
import { TheContent, TheHeader } from '.';
import ErrorModal from '../shared/components/ErrorModal';
import useDeviceDetect from '../shared/hooks/useDeviceDetect';
import { RootState } from '../shared/reducers';
import TheSidebar from './TheSidebar';

const TheLayout = () => {
  const { providerErrorMessage } = useSelector((state: RootState) => state.wallet);

  const { isMobile } = useDeviceDetect();

  return (
    <div className="dapp-layout">
      {!isMobile ? (
        <ErrorModal
          errMsg="anftDapp.global.modal.errorModal.deviceErrMsg"
          title="anftDapp.global.modal.errorModal.deviceErr"
          autoReload={false}
        />
      ) : (
        <>
          {!providerErrorMessage ? (
            <>
            <TheSidebar/>
            <div className="c-wrapper">
              <TheHeader />
              <div className="c-body">
                <TheContent />
              </div>
            </div>
            </>
          ) : (
            <ErrorModal errMsg={providerErrorMessage} title="anftDapp.global.modal.errorModal.walletErr" autoReload={true} />
          )}
        </>
      )}
    </div>
  );
};
export default TheLayout;
