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
import { Formik } from 'formik';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { LISTING_INSTANCE } from '../../../shared/blockchain-helpers';
import {
  convertBnToDecimal,
  convertDecimalToBn,
  convertUnixToDate,
  estimateOwnership,
  formatBNToken,
  insertCommas,
  unInsertCommas,
} from '../../../shared/casual-helpers';
import { ToastError } from '../../../shared/components/Toast';
import { EventType } from '../../../shared/enumeration/eventType';
import { RootState } from '../../../shared/reducers';
import { selectEntityById } from '../../assets/assets.reducer';
import { baseSetterArgs } from '../../transactions/settersMapping';
import { IProceedTxBody, proceedTransaction } from '../../transactions/transactions.api';
import { fetching } from '../../wallet/wallet.reducer';

interface IExtendOwnershipModal {
  listingId: number;
  isVisible: boolean;
  setVisibility: (visible: boolean) => void;
  title: string;
}

interface IIntialValues {
  tokenAmount: number;
}

const ExtendOwnershipModal = (props: IExtendOwnershipModal) => {
  const { isVisible, setVisibility, listingId, title } = props;
  const dispatch = useDispatch();

  const listing = useSelector(selectEntityById(listingId));
  const { signer } = useSelector((state: RootState) => state.wallet);
  const { submitted } = useSelector((state: RootState) => state.transactions);
  const { tokenBalance } = useSelector((state: RootState) => state.wallet);

  const closeModal = () => (): void => setVisibility(false);

  useEffect(() => {
    if (submitted) {
      setVisibility(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted]);

  const initialValues: IIntialValues = {
    tokenAmount: 0,
  };

  const validationSchema = Yup.object().shape({
    tokenAmount: Yup.number()
      .test('dailyPayment-minimum', `Minimum ownership for the listing is 1.0 day`, function (value) {
        if (!value) return true;
        if (!listing?.dailyPayment) return false;
        return value >= Number(convertBnToDecimal(listing.dailyPayment));
      })
      .test('do-not-exceed-tokenBalance', `Input amount exceeds token balance`, function (value) {
        if (!value) return true;
        if (!tokenBalance) return true;
        return convertDecimalToBn(String(value)).lte(tokenBalance);
      })
      .typeError('Incorrect input type!')
      .required('This field is required!')
      .min(1, 'Incorrect input type!'),
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
      type: EventType.OWNERSHIP_EXTENSION,
      args: { ...baseSetterArgs, _amount: convertDecimalToBn(input.tokenAmount.toString()) },
    };

    return output;
  };

  return (
    <CModal show={isVisible} onClose={closeModal()} centered className="border-radius-modal">
      <CModalHeader className="justify-content-center">
        <CModalTitle className="modal-title-style">{title}</CModalTitle>
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
            // setVisibility(false);
          } catch (error) {
            console.log(`Error submitting form ${error}`);
            ToastError(`Error submitting form ${error}`);
          }
        }}
      >
        {({ values, errors, touched, setFieldValue, handleSubmit, handleBlur }) => (
          <CForm onSubmit={handleSubmit}>
            <CModalBody>
              <CRow>
                <CCol xs={12}>
                  <CFormGroup row>
                    <CCol xs={6}>
                      <CLabel className="recharge-token-title">Current ownership</CLabel>
                    </CCol>
                    {listing?.dailyPayment && listing?.ownership ? (
                      <CCol xs={6}>
                        <p className="text-primary text-right">{convertUnixToDate(listing.ownership.toNumber())}</p>
                      </CCol>
                    ) : (
                      ''
                    )}
                  </CFormGroup>

                  <CFormGroup row>
                    <CCol xs={8}>
                      <CLabel className="recharge-token-title">Daily Payment</CLabel>
                    </CCol>
                    <CCol xs={4}>
                      <p className="text-primary text-right">{formatBNToken(listing?.dailyPayment, true)}</p>
                    </CCol>
                  </CFormGroup>
                  <CFormGroup row>
                    <CCol xs={6}>
                      <CLabel className="recharge-token-title">Tokens available</CLabel>
                    </CCol>
                    <CCol xs={6}>
                      <p className="text-primary text-right">{formatBNToken(tokenBalance, true)}</p>
                    </CCol>
                  </CFormGroup>
                  <CFormGroup row>
                    <CCol xs={12}>
                      <CLabel className="recharge-token-title">Spend</CLabel>
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
                          {tokenBalance ? (
                            <CButton
                              color="primary"
                              className="btn-radius-50"
                              onClick={() =>
                                setFieldValue(`tokenAmount`, unInsertCommas(convertBnToDecimal(tokenBalance)))
                              }
                              disabled={convertDecimalToBn(String(values.tokenAmount || 0)).eq(tokenBalance)}
                            >
                              MAX
                            </CButton>
                          ) : (
                            ''
                          )}
                        </CInputGroupAppend>
                      </CInputGroup>
                      <CInvalidFeedback className={!!errors.tokenAmount && touched.tokenAmount ? 'd-block' : 'd-none'}>
                        {errors.tokenAmount}
                      </CInvalidFeedback>
                    </CCol>
                  </CFormGroup>
                  {!errors.tokenAmount && listing?.dailyPayment && listing?.ownership && values.tokenAmount ? (
                    <CFormGroup row className={`mt-4`}>
                      <CCol xs={6}>
                        <CLabel className="recharge-token-title">Ownership Estimation</CLabel>
                      </CCol>
                      <CCol xs={6}>
                        <p className="text-primary text-right">
                          {values.tokenAmount > 0
                            ? estimateOwnership(
                                convertDecimalToBn(String(values.tokenAmount)),
                                listing.dailyPayment,
                                listing.ownership
                              )
                            : ''}
                        </p>
                      </CCol>
                    </CFormGroup>
                  ) : (
                    ''
                  )}
                </CCol>
              </CRow>
            </CModalBody>
            <CModalFooter className="justify-content-between">
              <CCol>
                <CButton
                  className="px-2 w-100 btn-font-style btn-radius-50 btn btn-outline-primary"
                  onClick={closeModal()}
                >
                  HỦY
                </CButton>
              </CCol>
              <CCol>
                <CButton className="px-2 w-100 btn btn-primary btn-font-style btn-radius-50" type="submit">
                  ĐỒNG Ý
                </CButton>
              </CCol>
            </CModalFooter>
          </CForm>
        )}
      </Formik>
    </CModal>
  );
};

export default ExtendOwnershipModal;
