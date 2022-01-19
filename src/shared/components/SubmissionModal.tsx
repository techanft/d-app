import CIcon from '@coreui/icons-react';
import { CButton, CLabel, CLink, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { BLOCKCHAIN_NETWORK } from '../../config/constants';
import { awaitTransaction } from '../../views/transactions/transactions.api';
import { fetching } from '../../views/transactions/transactions.reducer';
import { getTokenBalance } from '../../views/wallet/wallet.api';
import { RootState } from '../reducers';

const SubmissionModal = () => {
  const { submitted, transaction, success } = useSelector((state: RootState) => state.transactions);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { signerAddress, provider } = useSelector((state: RootState) => state.wallet);

  const [visibility, setVisibility] = useState(false);

  // Remove this since recording is obsolete
  useEffect(() => {
    if (submitted && transaction) {
      setVisibility(true);
      dispatch(fetching());
      dispatch(awaitTransaction(transaction));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted, transaction]);

  useEffect(() => {
    if (success && signerAddress && provider) {
      setVisibility(false);
      dispatch(getTokenBalance({ address: signerAddress, provider }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]);

  const closeModal = () => {
    setVisibility(false);
  };

  return (
    <CModal show={visibility} onClose={closeModal} centered className={'border-radius-modal'}>
      <CModalHeader className="justity-content-between align-items-center">
        <CModalTitle>
          <b>{t('anftDapp.global.modal.submissionModal.title')}</b>
        </CModalTitle>
        <CButton onClick={closeModal} className="p-0 text-primary">
          <CIcon name="cil-x" size="lg" />
        </CButton>
      </CModalHeader>
      <CModalBody className="text-center my-3">
        <CIcon name="cil-arrow-circle-top" size="5xl" className="text-primary" />
        <CLabel className="text-primary mt-5 d-block">
          {transaction ? (
            <CLink
              href={`${BLOCKCHAIN_NETWORK.blockExplorerUrls}tx/${transaction.contractTransaction.hash}`}
              target="_blank"
            >
              {t('anftDapp.global.modal.submissionModal.content')}{' '}
              <CIcon name="cil-external-link" className="pb-1" size="lg" />
            </CLink>
          ) : (
            ''
          )}
        </CLabel>
      </CModalBody>
      <CModalFooter className="justify-content-center">
        <CButton className="btn btn-primary btn-radius-50 w-50" onClick={closeModal}>
          {t('anftDapp.global.modal.submissionModal.close')}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default SubmissionModal;
