import {
  CButton,
  CCol,
  CForm,
  CFormGroup,
  CInput,
  CInputGroup,
  CInputGroupAppend,
  CInvalidFeedback,
  CLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react';
import dayjs from 'dayjs';
import { BigNumber } from 'ethers';
import { Formik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { LISTING_INSTANCE } from '../../../shared/blockchain-helpers';
import {
  convertDecimalToBn,
  estimateWithdrawAmount,
  insertCommas,
  unInsertCommas,
} from '../../../shared/casual-helpers';
import { ToastError } from '../../../shared/components/Toast';
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

interface IIntialValues {
  tokenAmount: number;
}
const currentUnix = dayjs().unix();

const WithdrawModal = (props: IWithdrawModal) => {
  const { isVisible, setVisibility, listingId } = props;
  const dispatch = useDispatch();

  const listing = useSelector(selectEntityById(listingId));
  const { signer } = useSelector((state: RootState) => state.wallet);
  const { submitted } = useSelector((state: RootState) => state.transactions);

  const closeModal = () => (): void => setVisibility(false);

  const initialValues: IIntialValues = {
    tokenAmount: 0,
  };

  const validationSchema = Yup.object().shape({
    tokenAmount: Yup.number().typeError('Số lượng token không hợp lệ').required('Vui lòng nhập số token muốn nạp'),
  });

  const handleRawFormValues = (input: IIntialValues): IProceedTxBody => {
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
      args: { ...baseSetterArgs, _amount: convertDecimalToBn(input.tokenAmount.toString()) },
    };

    return output;
  };

  const [maxTokenWithdraw, setMaxTokenWithdraw] = useState<number | string>(0);

  const getMaximumWithdrawAmount = () => {
    setMaxTokenWithdraw(withdrawTokenAmount);
  };

  useEffect(() => {
    if (submitted) {
      setVisibility(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted]);

  const [curretUnix, setCurrntUnix] = useState<number>(currentUnix);

  useEffect(() => {
    setCurrntUnix(dayjs().unix());
  }, [isVisible]);

  const withdrawTokenAmount =
    listing?.dailyPayment && listing.ownership
      ? insertCommas(estimateWithdrawAmount(listing.dailyPayment, listing.ownership.sub(120), curretUnix))
      : '_';

  const initialSeconds = 60;
  const [seconds, setSeconds] = useState<number>(initialSeconds);

  // useEffect(() => {
  //   let myInterval = setInterval(() => {
  //     if (seconds > 0) {
  //       setSeconds(seconds - 1);
  //     }
  //     // if (seconds === 0) {
  //     //   setIsSubmitDisable(true);
  //     // }
  //   }, 1000);
  //   return () => {
  //     clearInterval(myInterval);
  //   };
  // });
  
  return (
    <CModal show={isVisible} onClose={closeModal()} centered className="border-radius-modal">
      <CModalHeader className="justify-content-center">
        <CModalTitle className="modal-title-style">Rút ANFT</CModalTitle>
      </CModalHeader>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(rawValues) => {
          try {
            const value = handleRawFormValues(rawValues);
            dispatch(fetching());
            dispatch(proceedTransaction(value));
          } catch (error) {
            console.log(`Error submitting form ${error}`);
            ToastError(`Error submitting form ${error}`);
          }
        }}
      >
        {({ values, errors, touched, handleChange, handleSubmit, handleBlur, setFieldValue }) => (
          <CForm onSubmit={handleSubmit}>
            <CModalBody>
              <CRow>
                <CCol xs={12}>
                  <CFormGroup row>
                    <CCol xs={8}>
                      <CLabel className="withdraw-token-title">Số ANFT Tối đa bạn rút</CLabel>
                    </CCol>
                    <CCol xs={4}>
                      <p className="text-primary text-right">{withdrawTokenAmount}</p>
                    </CCol>
                  </CFormGroup>
                  <CFormGroup row>
                    <CCol xs={12}>
                      <CLabel className="withdraw-token-title">Số ANFT muốn rút</CLabel>
                    </CCol>
                    <CCol xs={12}>
                      <CInputGroup>
                        <CInput
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setFieldValue(`tokenAmount`, unInsertCommas(e.target.value));
                          }}
                          id="tokenAmount"
                          autoComplete="off"
                          name="tokenAmount"
                          value={values.tokenAmount || maxTokenWithdraw || ''}
                          onBlur={handleBlur}
                          className="btn-radius-50"
                          type="number"
                        />
                        <CInputGroupAppend>
                          <CButton
                            color="primary"
                            className="btn-register-level"
                            onClick={() => getMaximumWithdrawAmount()}
                          >
                            MAX
                          </CButton>
                        </CInputGroupAppend>
                      </CInputGroup>

                      <CInvalidFeedback className={!!errors.tokenAmount && touched.tokenAmount ? 'd-block' : 'd-none'}>
                        {errors.tokenAmount}
                      </CInvalidFeedback>
                    </CCol>
                  </CFormGroup>
                </CCol>
              </CRow>
            </CModalBody>
            <CModalFooter className="justify-content-between">
              <CCol>
                <CButton
                  className="px-2 w-100 btn-font-style btn btn-outline-primary btn-radius-50"
                  onClick={closeModal()}
                >
                  HỦY
                </CButton>
              </CCol>
              <CCol>
                {seconds !== 0 ? (
                  <CButton className="px-2 w-100 btn btn-primary btn-font-style btn-radius-50" type="submit">
                    XÁC NHẬN {`(${seconds}s)`}
                  </CButton>
                ) : (
                  <CButton className="px-2 w-100 btn btn-primary btn-font-style btn-radius-50">REFRESH</CButton>
                )}
              </CCol>
            </CModalFooter>
          </CForm>
        )}
      </Formik>
    </CModal>
  );
};

export default WithdrawModal;
