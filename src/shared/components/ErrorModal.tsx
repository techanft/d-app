import { CButton, CCol, CContainer, CLabel, CRow } from '@coreui/react';
import React, { useEffect } from 'react';
import ConfirmModal from './ConfirmModal';

interface IErrorModal {
  errMsg: string;
}

const ErrorModal = ({ errMsg }: IErrorModal) => {
  const onReload = () => {
    window.location.reload();
  }

  useEffect(() => {
    const refetchTimer = window.setTimeout(() => {
      window.location.reload();
    }, 5000);
    return () => window.clearTimeout(refetchTimer);
  }, []);

  return (
    <ConfirmModal
      color={'danger'}
      isVisible={true}
      onConfirm={() => {}}
      onAbort={() => {}}
      hideFooter={true}
      title={'Wallet Error!'}
      disableCloseBackdrop={true}
      CustomJSX={() => (
        <CContainer className="text-center">
          <CRow >
            <CCol xs={12}>
              <CLabel>{errMsg}</CLabel>
            </CCol>
            <CCol xs={12} >
              <CButton className="mt-3 btn-primary btn-radius-50" onClick={onReload}>Reload</CButton>
            </CCol>
          </CRow>
        </CContainer>
      )}
    />
  );
};
export default ErrorModal;
