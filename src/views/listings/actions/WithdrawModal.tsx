import { CButton, CCol, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LISTING_INSTANCE } from '../../../shared/blockchain-helpers';
import { estimateWithdrawAmount, insertCommas } from '../../../shared/casual-helpers';
import { EventType } from '../../../shared/enumeration/eventType';
import { RootState } from '../../../shared/reducers';
import { selectEntityById } from '../../assets/assets.reducer';
import { baseSetterArgs } from '../../transactions/settersMapping';
import { IProceedTxBody, proceedTransaction } from '../../transactions/transactions.api';
import { fetching } from '../../transactions/transactions.reducer';

interface IWithdrawModal {
  listingId: number;
  isVisible: boolean;
  setVisibility: (visible: boolean) => void;
}

const WithdrawModal = (props: IWithdrawModal) => {
  const { isVisible, setVisibility, listingId } = props;
  const dispatch = useDispatch();

  const listing = useSelector(selectEntityById(listingId));
  
  const { signer } = useSelector((state: RootState) => state.wallet);

  const { submitted } = useSelector((state: RootState) => state.transactions);

  const closeModal = () => (): void => setVisibility(false);

  const withdrawValues = () => {
    if (!listing?.address) {
      throw Error('Error getting listing address');
    }
    if (!signer) {
      throw Error('No Signer found');
    }
    const instance = LISTING_INSTANCE(listing.address, signer);
    if (!instance) {
      throw Error('Error in generating contract instace');
    }

    const output: IProceedTxBody = {
      listingId,
      contract: instance,
      type: EventType.WITHDRAW,
      args: { ...baseSetterArgs },
    };

    return output;
  };

  const onWithdrawConfirm = () => (): void => {
    dispatch(fetching());
    dispatch(proceedTransaction(withdrawValues()));
  };

  useEffect(() => {
    if (submitted) {
      setVisibility(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted]);


  return (
    <CModal show={isVisible} onClose={closeModal()} centered className="border-radius-modal">
      <CModalHeader className="justify-content-center">
        <CModalTitle className="modal-title-style">Rút ANFT</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {listing?.dailyPayment && listing?.ownership ? (
          <p>
            Bạn chắc chắn muốn rút{' '}
            <span className="text-primary">
              {insertCommas(estimateWithdrawAmount(listing.dailyPayment, listing.ownership))} ANFT
            </span>
          </p>
        ) : (
          ''
        )}
      </CModalBody>
      <CModalFooter className="justify-content-between">
        <CCol>
          <CButton className="px-2 w-100 btn-font-style btn btn-outline-primary btn-radius-50" onClick={closeModal()}>
            HỦY
          </CButton>
        </CCol>
        <CCol>
          <CButton className="px-2 w-100 btn btn-primary btn-font-style btn-radius-50" onClick={onWithdrawConfirm()}>
            XÁC NHẬN
          </CButton>
        </CCol>
      </CModalFooter>
    </CModal>
  );
};

export default WithdrawModal;
