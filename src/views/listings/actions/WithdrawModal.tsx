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
  CRow
} from '@coreui/react';
import dayjs from 'dayjs';
import { Formik, FormikProps } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { LISTING_INSTANCE } from '../../../shared/blockchain-helpers';
import {
  convertDecimalToBn,
  estimateWithdrawAmount,
  insertCommas,
  unInsertCommas
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

const WithdrawModal = (props: IWithdrawModal) => {
  const { isVisible, setVisibility, listingId } = props;
  const dispatch = useDispatch();
  const formikRef = useRef<FormikProps<IIntialValues>>(null);

  const listing = useSelector(selectEntityById(listingId));
  const { signer } = useSelector((state: RootState) => state.wallet);
  const { submitted } = useSelector((state: RootState) => state.transactions);

  const { t } = useTranslation();

  const closeModal = () => () => {
    setVisibility(false);
  };

  const initialValues: IIntialValues = {
    tokenAmount: 0,
  };

  const validationSchema = Yup.object().shape({
    tokenAmount: Yup.number()
      .typeError(t('anftDapp.listingComponent.withdrawToken.incorrectInputType'))
      .required(t('anftDapp.listingComponent.withdrawToken.inputIsRequired'))
      .min(1, t('anftDapp.listingComponent.withdrawToken.minimumWithdraw')),
  });

  const handleRawFormValues = (input: IIntialValues): IProceedTxBody => {
    if (!listing?.address) {
      throw Error('Error getting listing address');
    }
    if (!signer) {
      throw Error('No Signer found');
    }
    const instance = LISTING_INSTANCE({ address: listing.address, signer });
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

  const [maximumWithdrawable, setMaximumWithdrawable] = useState<undefined | number>(undefined);

  const resetMaximumWithdrawableAndCountdown = () => {
    if (!listing?.dailyPayment || !listing.ownership) return undefined;
    const currentUnix = dayjs().unix();
    const maximum = estimateWithdrawAmount(listing.dailyPayment, listing.ownership.sub(120), currentUnix);
    setMaximumWithdrawable(maximum);
    setTimeLeft(30);
  };

  useEffect(() => {
    if (submitted) {
      setVisibility(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted]);

  useEffect(() => {
    if (isVisible) {
      resetMaximumWithdrawableAndCountdown();
    } else {
      setTimeLeft(undefined);
      setMaximumWithdrawable(undefined);
      formikRef.current?.resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  const [timeLeft, setTimeLeft] = useState<undefined | number>(undefined);

  useEffect(() => {
    if (!timeLeft) return;
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  return (
    <CModal show={isVisible} onClose={closeModal()} centered className="border-radius-modal">
      <CModalHeader className="justify-content-center">
        <CModalTitle className="modal-title-style">
          {t('anftDapp.listingComponent.primaryInfo.ownershipManagement.withdrawToken')}
        </CModalTitle>
      </CModalHeader>
      <Formik
        innerRef={formikRef}
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
        {({ values, errors, touched, handleSubmit, handleBlur, setFieldValue, submitForm }) => (
          <CForm onSubmit={handleSubmit}>
            <CModalBody>
              <CRow>
                <CCol xs={12}>
                  <CFormGroup row>
                    <CCol xs={8}>
                      <CLabel className="withdraw-token-title">
                        {t('anftDapp.listingComponent.withdrawToken.maximumWithdrawable')}
                      </CLabel>
                    </CCol>
                    <CCol xs={4}>
                      <p className="text-primary text-right">{insertCommas(maximumWithdrawable)}</p>
                    </CCol>
                  </CFormGroup>
                  <CFormGroup row>
                    <CCol xs={12}>
                      <CLabel className="withdraw-token-title">
                        {t('anftDapp.listingComponent.withdrawToken.withdrawAmount')}
                      </CLabel>
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
                          value={values.tokenAmount ? insertCommas(values.tokenAmount) : ''}
                          onBlur={handleBlur}
                          className="btn-radius-50"
                        />
                        <CInputGroupAppend>
                          <CButton
                            color="primary"
                            className="btn-radius-50"
                            onClick={() =>
                              setFieldValue(`tokenAmount`, unInsertCommas(maximumWithdrawable!.toString()))
                            }
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
                  {t('anftDapp.global.modal.cancel')}
                </CButton>
              </CCol>
              <CCol>
                {timeLeft ? (
                  <CButton className="px-2 w-100 btn btn-primary btn-font-style btn-radius-50" onClick={submitForm}>
                    {t('anftDapp.global.modal.confirm')} {`(${timeLeft}s)`}
                  </CButton>
                ) : (
                  <CButton
                    className="px-2 w-100 btn btn-warning btn-font-style btn-radius-50"
                    onClick={() => resetMaximumWithdrawableAndCountdown()}
                  >
                    {t('anftDapp.global.modal.refresh')}
                  </CButton>
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
