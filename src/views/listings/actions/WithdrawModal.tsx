import {
  CButton,
  CCol,
  CForm,
  CFormGroup,
  CInput,
  CInvalidFeedback,
  CLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow
} from '@coreui/react';
import { Formik, FormikProps } from 'formik';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { DateRangePicker } from 'react-dates';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { LISTING_INSTANCE } from '../../../shared/blockchain-helpers';
import {
  calculateDateDifference,
  calculatePriceByDays,
  checkDateRange,
  convertBnToDecimal,
  convertDecimalToBn,
  insertCommas,
  returnMaxEndDate,
  unInsertCommas
} from '../../../shared/casual-helpers';
import { ToastError } from '../../../shared/components/Toast';
import { EventType } from '../../../shared/enumeration/eventType';
import useWindowDimensions from '../../../shared/hooks/useWindowDimensions';
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
  startDate: moment.Moment;
  endDate: moment.Moment;
  remainingDays: number;
  withdraw: number;
}

const WithdrawModal = (props: IWithdrawModal) => {
  const { isVisible, setVisibility, listingId } = props;
  const dispatch = useDispatch();
  const { width: screenWidth } = useWindowDimensions();
  const formikRef = useRef<FormikProps<IIntialValues>>(null);
  const [focusedInput, setFocusedInput] = React.useState(null);

  const listing = useSelector(selectEntityById(listingId));
  const { signer } = useSelector((state: RootState) => state.wallet);
  const { submitted } = useSelector((state: RootState) => state.transactions);

  const closeModal = () => () => {
    setVisibility(false);
  };

  const getEndDate = (): moment.Moment => {
    const currentDate = moment().add(1, 'day').endOf('day');
    const currentOwnership = listing?.ownership ? moment.unix(listing.ownership.toNumber()) : currentDate;
    return currentOwnership;
  };

  const startDate = moment();
  const endDate = getEndDate();
  const totalDays = calculateDateDifference(startDate, endDate);

  const initialValues: IIntialValues = {
    tokenAmount: 0,
    startDate,
    endDate,
    remainingDays: totalDays,
    withdraw: 0,
  };

  const validationSchema = Yup.object().shape({
    withdraw: Yup.number()
      .typeError('Incorrect input type!')
      .min(1, 'Minimum ownership for the listing is 1.0 day')
      .max(totalDays - 1, `Số ngày rút ra không vượt quá ${totalDays - 1} ngày`)
      .required('This field is required'),
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

    const withdrawPrice = convertDecimalToBn(calculatePriceByDays(input.withdraw, input.startDate, listing));

    const output: IProceedTxBody = {
      listingId,
      contract: instance,
      type: EventType.WITHDRAW,
      args: { ...baseSetterArgs, _amount: withdrawPrice },
    };

    return output;
  };

  const [maximumWithdrawable, setMaximumWithdrawable] = useState<undefined | number>(undefined);

  const resetMaximumWithdrawableAndCountdown = () => {
    if (!listing?.dailyPayment || !listing.ownership) return undefined;
    // const maximum = estimateWithdrawAmount(listing.dailyPayment, listing.ownership.sub(120), currentUnix);
    const maximum = convertBnToDecimal(listing.dailyPayment.mul(totalDays - 1));
    setMaximumWithdrawable(Number(maximum));
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
        <CModalTitle className="modal-title-style">Withdraw Token</CModalTitle>
      </CModalHeader>
      <Formik
        innerRef={formikRef}
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
            <CModalBody className={"d-flex justify-content-center"}>
              <CRow className={"ContainerMaxWidth"}>
                <CCol xs={12}>
                  <CFormGroup row>
                    <CCol xs={6}>
                      <CLabel className="withdraw-token-title">Maximum Withdrawable</CLabel>
                    </CCol>
                    <CCol xs={6}>
                      <p className="text-primary text-right">{insertCommas(maximumWithdrawable)} ANFT</p>
                    </CCol>
                  </CFormGroup>
                  <CFormGroup row className={`${screenWidth <= 335 ? 'd-none' : ''}`}>
                    <CCol xs={12}>
                      <CLabel className="recharge-token-title">Ownership</CLabel>
                    </CCol>
                    <CCol xs={12}>
                      {/* Check screen width here */}
                      <DateRangePicker
                        startDate={values.startDate}
                        startDateId="startDate"
                        disabled="startDate"
                        displayFormat="DD/MM/YYYY"
                        endDate={values.endDate}
                        endDateId="endDate"
                        onDatesChange={({ startDate, endDate }) => {
                          if (focusedInput === 'endDate' && endDate && startDate) {
                            setFieldValue('endDate', endDate.endOf('day'));
                            const remainingDays = calculateDateDifference(startDate, endDate);
                            const withDraw = totalDays - remainingDays;
                            setFieldValue('remainingDays', remainingDays);
                            setFieldValue('withdraw', withDraw);
                          }
                        }}
                        focusedInput={focusedInput}
                        onFocusChange={setFocusedInput as any}
                        isOutsideRange={(day) => {
                          const startDateObj = moment(startDate).startOf('day');
                          const endDateObj = moment(endDate).endOf('day');
                          return !checkDateRange(day, startDateObj, endDateObj);
                        }}
                        initialVisibleMonth={() => moment(startDate).add(0, 'month')}
                        numberOfMonths={1}
                        orientation={'horizontal'}
                      />
                    </CCol>
                  </CFormGroup>

                  <CFormGroup row>
                    <CCol xs={12}>
                      <CLabel className="recharge-token-title">Withdraws (Days): </CLabel>
                    </CCol>
                    <CCol xs={12}>
                      <CInput
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const withdrawDay = Number(unInsertCommas(e.target.value));
                          setFieldValue('withdraw', withdrawDay);
                          const remainingDays = totalDays - withdrawDay;
                          if (remainingDays > 0) {
                            const extendValue = moment(startDate).add(
                              returnMaxEndDate(remainingDays, totalDays),
                              'day'
                            );
                            setFieldValue('remainingDays', remainingDays);
                            setFieldValue('endDate', extendValue);
                          }
                        }}
                        id="withdraw"
                        autoComplete="off"
                        name="withdraw"
                        value={values.withdraw ? insertCommas(values.withdraw) : ''}
                        onBlur={handleBlur}
                        className="btn-radius-50 InputMaxWidth"
                      />
                      <CInvalidFeedback className={!!errors.withdraw && touched.withdraw ? 'd-block' : 'd-none'}>
                        {errors.withdraw}
                      </CInvalidFeedback>
                    </CCol>
                  </CFormGroup>
                  {!errors.withdraw && listing?.dailyPayment && listing?.ownership && values.withdraw ? (
                    <>
                      <CFormGroup row className={`mt-4`}>
                        <CCol xs={6}>
                          <CLabel className="withdraw-token-title">Remaining Days</CLabel>
                        </CCol>
                        <CCol xs={6}>
                          <p className="text-primary text-right">{values.remainingDays} Days</p>
                        </CCol>
                      </CFormGroup>
                      <CFormGroup row>
                        <CCol xs={6}>
                          <CLabel className="recharge-token-title">Token Estimation</CLabel>
                        </CCol>
                        <CCol xs={6}>
                          <p className="text-primary text-right">
                            {values.withdraw > 0 && values.startDate
                              ? insertCommas(calculatePriceByDays(values.withdraw, values.startDate, listing))
                              : '0'}{' '}
                            ANFT
                          </p>
                        </CCol>
                      </CFormGroup>
                    </>
                  ) : (
                    ''
                  )}
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
                {timeLeft ? (
                  <CButton className="px-2 w-100 btn btn-primary btn-font-style btn-radius-50" onClick={submitForm}>
                    XÁC NHẬN {`(${timeLeft}s)`}
                  </CButton>
                ) : (
                  <CButton
                    className="px-2 w-100 btn btn-warning btn-font-style btn-radius-50"
                    onClick={() => resetMaximumWithdrawableAndCountdown()}
                  >
                    REFRESH
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
