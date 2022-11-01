import CIcon from '@coreui/icons-react';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TheContent, TheHeader } from '.';
import Logo from '../assets/img/logo.png';
import ErrorModal from '../shared/components/ErrorModal';
import useCountdownTimer from '../shared/hooks/useCountdownTimer';
import useDeviceDetect from '../shared/hooks/useDeviceDetect';
import { RootState } from '../shared/reducers';
import { account } from '../views/auth/auth.api';
import { fetching } from '../views/auth/auth.reducer';
import TheSidebar from './TheSidebar';

const TheLayout = () => {
  const { providerErrorMessage } = useSelector((state: RootState) => state.wallet);
  // const containerState = useSelector((state: RootState) => state.container);
  // const { sidebarShow } = containerState;
  const { isMobile } = useDeviceDetect();
  const shouldDisplayLogoScreen = useCountdownTimer({ seconds: 1 });

  const logoScreen = (
    <div className="d-flex w-100 vh-100">
      <CIcon src={Logo} height={100} className="m-auto" />
    </div>
  );

  const dispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.authentication);
  
  useEffect(() => {
    let tempToken = token;
    if (!tempToken) {
      tempToken = localStorage.getItem('authentication_token');
    }
    
    if (tempToken) {
      dispatch(fetching());
      dispatch(account());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  
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
            <div className={`c-wrapper ${isMobile ? '' : 'ml-0'}`}>
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
