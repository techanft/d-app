import CIcon from '@coreui/icons-react';
import { CButton, CLabel, CLink, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SCAN_URL } from '../../config/constants';
import { deleteExistedTransaction, recordTransaction } from '../../views/transactions/transactions.api';
import { fetching, hardReset, softReset } from '../../views/transactions/transactions.reducer';
import { RootState } from '../reducers';

const SubmissionModal = () => {
  const { submitted, transaction, success, deleteSubmitted, deleteSuccess, transactionDel } = useSelector((state: RootState) => state.transactions);
  const dispatch = useDispatch();

  const [visibility, setVisibility] = useState(false);

  useEffect(() => {
    if (submitted && transaction) {
      setVisibility(true);
      dispatch(fetching());
      dispatch(recordTransaction(transaction));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted, transaction]);

  useEffect(() => {
    if (deleteSubmitted && transactionDel) {
      setVisibility(true);
      dispatch(fetching());
      dispatch(deleteExistedTransaction(transactionDel));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteSubmitted, transactionDel]);

  useEffect(() => {
    if (deleteSuccess) {
      setVisibility(false);
      dispatch(hardReset());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteSuccess]);

  useEffect(() => {
    if (success) {
      setVisibility(false);
      dispatch(hardReset());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]);

  const closeModal = () => {
    setVisibility(false);
    dispatch(softReset());
  };

  return (
    <CModal show={visibility} onClose={closeModal} centered className={'border-radius-modal'}>
      <CModalHeader className="justity-content-between align-items-center">
        <CModalTitle>
          <b>Transaction submitted</b>
        </CModalTitle>
        <CButton onClick={closeModal} className="p-0 text-primary">
          <CIcon name="cil-x" size="lg" />
        </CButton>
      </CModalHeader>
      <CModalBody className="text-center my-3">
        <CIcon name="cil-arrow-circle-top" size="5xl" className="text-primary" />
        <CLabel className="text-primary mt-5 d-block">
          {transaction ? (
            <CLink href={`${SCAN_URL}tx/${transaction.contractTransaction.hash}`} target="_blank">
              View on Network Scan <CIcon name="cil-external-link" className="pb-1" size="lg" />
            </CLink>
          ) : (
            ''
          )}
          {transactionDel ? (
            <CLink href={`${SCAN_URL}tx/${transactionDel.contractTransaction.hash}`} target="_blank">
              View on Network Scan <CIcon name="cil-external-link" className="pb-1" size="lg" />
            </CLink>
          ) : (
            ''
          )}
        </CLabel>
      </CModalBody>
      <CModalFooter className="justify-content-center">
        <CButton className="btn btn-primary" onClick={closeModal}>
          Close
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default SubmissionModal;
