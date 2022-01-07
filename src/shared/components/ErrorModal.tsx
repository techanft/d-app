import { CButton, CCol, CContainer, CLabel, CRow } from '@coreui/react';
import React, { useEffect } from 'react';
import ConfirmModal from './ConfirmModal';

interface IErrorModal {
  errMsg: string;
  title: string;
  autoReload: boolean;
}

const ErrorModal = (props: IErrorModal) => {
  const { errMsg, title, autoReload } = props;
  const onReload = () => {
    window.location.reload();
  };

  useEffect(() => {
    if (autoReload) {
      const refetchTimer = window.setTimeout(() => {
        window.location.reload();
      }, 5000);
      return () => window.clearTimeout(refetchTimer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ConfirmModal
      color={'danger'}
      isVisible={true}
      onConfirm={() => {}}
      onAbort={() => {}}
      hideFooter={true}
      title={title}
      disableCloseBackdrop={true}
      CustomJSX={() => (
        <CContainer className="text-center">
          <CRow>
            <CCol xs={12}>
              <CLabel className="content-title">{errMsg}</CLabel>
            </CCol>
            {autoReload ? (
              <CCol xs={12}>
                <CButton className="mt-3 btn-primary btn-radius-50" onClick={onReload}>
                  Reload
                </CButton>
              </CCol>
            ) : (
              ''
            )}
          </CRow>
        </CContainer>
      )}
    />
  );
};
export default ErrorModal;
