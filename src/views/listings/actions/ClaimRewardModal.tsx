import { CButton, CCol, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import dayjs from 'dayjs';
import { BigNumber } from 'ethers';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { calculateStakeHolderReward, ICalSHReward, LISTING_INSTANCE } from '../../../shared/blockchain-helpers';
import { convertDecimalToBn, formatBNToken } from '../../../shared/casual-helpers';
import { EventType } from '../../../shared/enumeration/eventType';
import { RootState } from '../../../shared/reducers';
import { selectEntityById } from '../../assets/assets.reducer';
import { baseSetterArgs } from '../../transactions/settersMapping';
import { IProceedTxBody, proceedTransaction } from '../../transactions/transactions.api';
import { fetching } from '../../transactions/transactions.reducer';

interface IClaimRewardModal {
  isVisible: boolean;
  setVisibility: (visible: boolean) => void;
  listingId: number;
  optionId: number | undefined;
}
const currentUnix = dayjs().unix();

const ClaimRewardModal = (props: IClaimRewardModal) => {
  const { isVisible, setVisibility, listingId, optionId } = props;
  const { submitted } = useSelector((state: RootState) => state.transactions);
  const { signer, signerAddress } = useSelector((state: RootState) => state.wallet);

  const listing = useSelector(selectEntityById(listingId));

  const dispatch = useDispatch();
  const closeModal = () => (): void => setVisibility(false);

  useEffect(() => {
    if (submitted) {
      setVisibility(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted]);

  const handleConfirmValues = () => {
    if (!listing?.address) {
      throw Error('Error getting listing address');
    }
    if (!signer) {
      throw Error('No Signer found');
    }
    const instance = LISTING_INSTANCE(listing.address, signer);

    if (!instance) {
      throw Error('Error in generating contract instance');
    }

    const output: IProceedTxBody = {
      listingId,
      contract: instance,
      type: EventType.CLAIM,
      args: { ...baseSetterArgs, _optionId: optionId },
    };

    return output;
  };

  const onClaimRewardCnfrm = () => {
    dispatch(fetching());
    const body = handleConfirmValues();
    dispatch(proceedTransaction(body));
  };

  const { initialState } = useSelector((state: RootState) => state.assets);
  // const { registerLogs } = initialState;

  const [amountToReturn, setAmountToReturn] = useState<BigNumber | undefined>(undefined);

  const proceedCalculation = async () => {

    if (!listing || !signer || !signerAddress) return;
    const instance = LISTING_INSTANCE(listing.address, signer);

    if (!instance) return;
    // if (!registerLogs) return;
    if (optionId === undefined) return;

    const value: ICalSHReward = {
      instance: instance,
      optionId: optionId,
      stakeholder: signerAddress,
      currentUnix: BigNumber.from(currentUnix),
      storedListing: listing
      // stakeStart: registerLogs[optionId]?._start,
    };

    const result = await calculateStakeHolderReward(value);
    setAmountToReturn(result);
    return result;
  };
  
  useEffect(() => {
    if (!listing || !signer || !signerAddress) return;

  }, [listing, signer, signerAddress])


  // caculateRewardValue();

  return (
    <CModal show={isVisible} onClose={closeModal()} centered className="border-radius-modal">
      <CModalHeader className="justify-content-center">
        <CModalTitle className="modal-title-style">Nhận thưởng hoạt động</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <p>
          Bạn chắc chắn muốn nhận thưởng{' '}
          <span className="text-primary"> {amountToReturn ? formatBNToken(amountToReturn, true) : 0} </span>
          của hoạt động{' '}
          <span className="text-primary">“{optionId !== undefined ? listing?.options[optionId].name : ''}”</span>
        </p>
      </CModalBody>
      <CModalFooter className="justify-content-between">
        <CCol>
          <CButton
            className={`px-2 w-100 btn btn-success btn-font-style btn-radius-50`}
            type="submit"
            onClick={onClaimRewardCnfrm}
          >
            XÁC NHẬN
          </CButton>
        </CCol>
        <CCol>
          <CButton className={`px-2 w-100 btn-font-style btn-radius-50 btn btn-outline-success`} onClick={closeModal()}>
            HỦY
          </CButton>
        </CCol>
      </CModalFooter>
    </CModal>
  );
};

export default ClaimRewardModal;
