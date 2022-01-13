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
import { BigNumber } from 'ethers';
import { Formik, FormikProps } from 'formik';
import moment from 'moment';
import React, { useEffect, useRef } from 'react';
import { DateRangePicker } from 'react-dates';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { LISTING_INSTANCE } from '../../../shared/blockchain-helpers';
import {
  convertBnToDecimal,
  convertDecimalToBn,
  convertUnixToDate,
  countDateDiffrence,
  formatBNToken,
  insertCommas,
  unInsertCommas
} from '../../../shared/casual-helpers';
import { ToastError } from '../../../shared/components/Toast';
import { EventType } from '../../../shared/enumeration/eventType';
import { ModalType } from '../../../shared/enumeration/modalType';
import useWindowDimensions from '../../../shared/hooks/useWindowDimensions';
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
  modelType: ModalType.OWNERSHIP_EXTENSION | ModalType.OWNERSHIP_REGISTER;
}

type TModelTypeMappingMoment = { [key in ModalType.OWNERSHIP_EXTENSION | ModalType.OWNERSHIP_REGISTER]: moment.Moment };

interface IIntialValues {
  tokenAmount: number;
  startDate: moment.Moment;
  endDate: moment.Moment;
  dateCount: number;
}

const ExtendOwnershipModal = (props: IExtendOwnershipModal) => {
  const { isVisible, setVisibility, listingId, title, modelType } = props;
  const dispatch = useDispatch();
  const { width: screenWidth } = useWindowDimensions();
  const formikRef = useRef<FormikProps<IIntialValues>>(null);
  const [focusedInput, setFocusedInput] = React.useState(null);

  const listing = useSelector(selectEntityById(listingId));
  const { signer } = useSelector((state: RootState) => state.wallet);
  const { submitted } = useSelector((state: RootState) => state.transactions);
  const { tokenBalance } = useSelector((state: RootState) => state.wallet);

  const closeModal = () => () => {
    setVisibility(false);
  };

  useEffect(() => {
    if (!isVisible) {
      formikRef.current?.resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  useEffect(() => {
    if (submitted) {
      setVisibility(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted]);

  const getStartDate = (): moment.Moment => {
    const currentDate = moment();
    const currentOwnership = listing?.ownership ? moment.unix(listing.ownership.toNumber()) : moment();
    const modelTypeMappingStartDate: TModelTypeMappingMoment = {
      [ModalType.OWNERSHIP_EXTENSION]: currentOwnership,
      [ModalType.OWNERSHIP_REGISTER]: currentDate,
    };
    return modelTypeMappingStartDate[modelType];
  };

  const startDate = getStartDate();
  const endDate = moment(startDate).add(1, 'day').endOf('day');

  const initialValues: IIntialValues = {
    tokenAmount: 0,
    startDate,
    endDate,
    dateCount: countDateDiffrence(startDate.toISOString(), endDate.toISOString()),
  };

  const getExtenableDay = (): number => {
    if (listing?.dailyPayment && tokenBalance) {
      const extenableDay = listing.dailyPayment.gt(0) ? tokenBalance.div(listing.dailyPayment).toNumber() : 0;
      return extenableDay;
    } else {
      return 0;
    }
  };

  const validationSchema = Yup.object().shape({
    dateCount: Yup.number()
      .typeError('Incorrect input type!')
      .min(1, 'Minimum ownership for the listing is 1.0 day')
      .max(getExtenableDay(), 'Your balance does not enough')
      .required('This field is required'),
  });

  const caculatePriceFromSecond = (dailyPayment: BigNumber, diffSecond: number) => {
    const diffSecondBn = BigNumber.from(Math.round(diffSecond));
    const additionalPrice = dailyPayment.mul(diffSecondBn).div(86400);
    return additionalPrice;
  };

  const checkDateRange = (day: moment.Moment): boolean => {
    const startDate = getStartDate().startOf('day');
    const extenableDate = moment().add(getExtenableDay(), 'day').endOf('day');
    // return true if date in range of startDate and extenableDate
    if (day < startDate) return false;
    return startDate <= day && day <= extenableDate;
  };

  const getSecondDifftoEndDate = (startDate: moment.Moment) => {
    const startDateDay = moment(startDate).endOf('day').subtract(90, 'second');
    const duration = moment.duration(startDateDay.diff(startDate));
    return duration.asSeconds();
  };

  const calculateExtendPrice = (day: number, startDate: moment.Moment) => {
    if (startDate && listing?.dailyPayment) {
      const extendPrice = listing.dailyPayment.mul(day);
      const secondDiff = getSecondDifftoEndDate(startDate);
      const result =
        secondDiff > 0 ? caculatePriceFromSecond(listing.dailyPayment, secondDiff).add(extendPrice) : extendPrice;
      return convertBnToDecimal(result);
    } else {
      return '0';
    }
  };

  const handleRawFormValues = (input: IIntialValues): IProceedTxBody => {
    if (!listing?.address) {
      throw Error('Error getting listing address');
    }
    if (!signer) {
      throw Error('No Signer found');
    }
    const instance = LISTING_INSTANCE({ address: listing.address, signer });
    if (!instance) {
      throw Error('Error in generating contract instance');
    }

    const extendPrice = convertDecimalToBn(calculateExtendPrice(input.dateCount, input.startDate));

    const output: IProceedTxBody = {
      listingId,
      contract: instance,
      type: EventType.OWNERSHIP_EXTENSION,
      args: { ...baseSetterArgs, _amount: extendPrice },
    };

    return output;
  };

  const returnMaxEndDate = (days: number): number => {
    if (days > getExtenableDay()) return getExtenableDay();
    return days;
  };

  return (
    <CModal show={isVisible} onClose={closeModal()} centered className="border-radius-modal">
      <CModalHeader className="justify-content-center">
        <CModalTitle className="modal-title-style">{title}</CModalTitle>
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
        {({ values, errors, touched, setFieldValue, handleSubmit, handleBlur }) => (
          <CForm onSubmit={handleSubmit}>
            <CModalBody>
              <CRow>
                <CCol xs={12}>
                  <CFormGroup row>
                    <CCol xs={6}>
                      <CLabel className="recharge-token-title">Current ownership</CLabel>
                    </CCol>
                    {listing?.ownership ? (
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
                  <CFormGroup row className={`${screenWidth <= 335 ? 'd-none' : ''}`}>
                    <CCol xs={12}>
                      <CLabel className="recharge-token-title">Date pick</CLabel>
                    </CCol>
                    <CCol xs={12}>
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
                            const startDatetoISOString = startDate.toISOString();
                            const endDatetoISOString = endDate.toISOString();
                            const dateCount = countDateDiffrence(startDatetoISOString, endDatetoISOString);
                            setFieldValue('dateCount', dateCount);
                          }
                        }}
                        focusedInput={focusedInput}
                        onFocusChange={setFocusedInput as any}
                        isOutsideRange={(day) => !checkDateRange(day)}
                        initialVisibleMonth={() => moment(startDate).add(0, 'month')}
                        numberOfMonths={1}
                        orientation={'horizontal'}
                      />
                    </CCol>
                  </CFormGroup>
                  <CFormGroup row>
                    <CCol xs={12}>
                      <CLabel className="recharge-token-title">Days</CLabel>
                    </CCol>
                    <CCol xs={12}>
                      <CInput
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const extendDay = Number(unInsertCommas(e.target.value));
                          try {
                            BigNumber.from(extendDay);
                            const extendDate = moment(startDate).add(returnMaxEndDate(extendDay), 'day');
                            setFieldValue('dateCount', extendDay);
                            setFieldValue('endDate', extendDate);
                          } catch (err) {
                            errors.dateCount = 'Your balance does not enough';
                          }
                        }}
                        id="dateCount"
                        autoComplete="off"
                        name="dateCount"
                        value={values.dateCount ? insertCommas(values.dateCount) : ''}
                        onBlur={handleBlur}
                        className="btn-radius-50 InputMaxWidth"
                      />
                      <CInvalidFeedback className={!!errors.dateCount && touched.dateCount ? 'd-block' : 'd-none'}>
                        {errors.dateCount}
                      </CInvalidFeedback>
                    </CCol>
                  </CFormGroup>
                  <CFormGroup row className={`mt-4`}>
                    <CCol xs={6}>
                      <CLabel className="recharge-token-title">Token Estimation</CLabel>
                    </CCol>
                    <CCol xs={6}>
                      <p className="text-primary text-right">
                        {values.dateCount > 0 && values.startDate
                          ? insertCommas(calculateExtendPrice(values.dateCount, values.startDate))
                          : '0'}{' '}
                        ANFT
                      </p>
                    </CCol>
                  </CFormGroup>
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
