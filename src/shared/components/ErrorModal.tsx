import React from 'react';
import ConfirmModal from './ConfirmModal';

interface IErrorModal {
    errMsg: string
}

const ErrorModal = ({errMsg}: IErrorModal) => {
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
        <div className="container">
          <div className="row p-0 m-0 justify-content-center">
            <div className="text-center col-xs-12">
              <p className={`lead p-0`}>{errMsg}</p>
            </div>
          </div>
        </div>
      )}
    />
  );
};
export default ErrorModal;
