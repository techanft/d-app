import CIcon from '@coreui/icons-react';
import React from 'react';
import { useSelector } from 'react-redux';
import { TheContent, TheHeader } from '.';
import Logo from '../assets/img/logo.png';
import ErrorModal from '../shared/components/ErrorModal';
import useCountdownTimer from '../shared/hooks/useCountdownTimer';
import { RootState } from '../shared/reducers';
import TheSidebar from './TheSidebar';

const TheLayout = () => {
  const { providerErrorMessage } = useSelector((state: RootState) => state.wallet);

  // const { isMobile } = useDeviceDetect();
  const shouldDisplayLogoScreen = useCountdownTimer({ seconds: 1 });

  const logoScreen = (
    <div className="d-flex w-100 vh-100">
      <CIcon src={Logo} height={100} className="m-auto" />
    </div>
  );

  if (shouldDisplayLogoScreen) return logoScreen; 

  return (
    <div className="dapp-layout">
      {/* {!isMobile ? (
        <ErrorModal
          errMsg="anftDapp.global.modal.errorModal.deviceErrMsg"
          title="anftDapp.global.modal.errorModal.deviceErr"
          autoReload={false}
        />
      ) : ( */}
        <>
          {!providerErrorMessage ? (
            <>
              <TheSidebar />
              <div className="c-wrapper">
                <TheHeader />
                <div className="c-body">
                  <TheContent />
                </div>
              </div>
            </>
          ) : (
            <ErrorModal
              errMsg={providerErrorMessage}
              title="anftDapp.global.modal.errorModal.walletErr"
              autoReload={true}
            />
          )}
        </>
      {/* )} */}
    </div>
  );
};
export default TheLayout;
