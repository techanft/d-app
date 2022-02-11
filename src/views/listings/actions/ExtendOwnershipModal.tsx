import {
  CButton,
  CCol,
  CForm,
  CFormGroup,
  CFormText,
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
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { APP_LOCAL_DATE_FORMAT } from '../../../config/constants';
import { LISTING_INSTANCE } from '../../../shared/blockchain-helpers';
import {
  calculateDateDifference,
  calculateSpendingFromSecond,
  checkDateRange,
  checkOwnershipExpired,
  convertBnToDecimal,
  convertDecimalToBn,
  convertUnixToDate,
  formatBNToken,
  getSecondDifftoEndDate,
  insertCommas,
  returnMaxEndDate,
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
  const { signer, tokenBalance } = useSelector((state: RootState) => state.wallet);
  const { submitted } = useSelector((state: RootState) => state.transactions);

  const { t } = useTranslation();

  const closeModal = () => {
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

  const ownershipExpired = listing?.ownership ? checkOwnershipExpired(listing.ownership.toNumber()) : false;

  const getStartDate = (): moment.Moment => {
    const currentDate = moment();
    const currentOwnership =
      listing?.ownership && !ownershipExpired ? moment.unix(listing.ownership.toNumber()) : moment();
    const modalTypeToStartDateMapping: TModelTypeMappingMoment = {
      [ModalType.OWNERSHIP_EXTENSION]: currentOwnership,
      [ModalType.OWNERSHIP_REGISTER]: currentDate,
    };
    return modalTypeToStartDateMapping[modelType];
  };

  const startDate = getStartDate();
  const endDate = moment(startDate).add(1, 'day').endOf('day');

  const initialValues: IIntialValues = {
    tokenAmount: 0,
    startDate,
    endDate,
    dateCount: calculateDateDifference(startDate, endDate),
  };

  const getExtenableDayFromTokenBalance = (): number => {
    if (!listing?.dailyPayment || !tokenBalance) return 0;
    if (!listing.dailyPayment.gt(0)) return 0;
    return tokenBalance.div(listing.dailyPayment).toNumber();
  };

  const calculateExtendPriceByDays = (days: number, startDate: moment.Moment) => {
    if (!startDate || !listing?.dailyPayment) return '0';
    const spending = listing.dailyPayment.mul(days);
    const differenceInSeconds = getSecondDifftoEndDate(startDate);
    const result =
      differenceInSeconds > 0
        ? calculateSpendingFromSecond(listing.dailyPayment, differenceInSeconds).add(spending)
        : spending;
    return convertBnToDecimal(result);
  };

  const validationSchema = Yup.object().shape({
    dateCount: Yup.number()
      .typeError(t('anftDapp.listingComponent.extendOwnership.incorrectInputType'))
      .min(1, t('anftDapp.listingComponent.extendOwnership.minimumOwnership'))
      .max(getExtenableDayFromTokenBalance(), t('anftDapp.listingComponent.extendOwnership.balanceIsNotEnough'))
      .required(t('anftDapp.listingComponent.extendOwnership.inputIsRequired')),
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
      throw Error('Error in generating contract instance');
    }

    const extendPrice = convertDecimalToBn(calculateExtendPriceByDays(input.dateCount, input.startDate));

    const output: IProceedTxBody = {
      listingId,
      contract: instance,
      type: EventType.OWNERSHIP_EXTENSION,
      args: { ...baseSetterArgs, _amount: extendPrice },
    };

    return output;
  };

  return (
    <CModal show={isVisible} onClose={closeModal} centered className="border-radius-modal">
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
            ToastError(`${t('anftDapp.global.errors.errorSubmittingForm')}: ${error}`);
          }
        }}
      >
        {({ values, errors, touched, setFieldValue, handleSubmit, handleBlur }) => (
          <CForm onSubmit={handleSubmit}>
            <CModalBody>
              <CRow>
                <CCol xs={12}>
                  <CFormGroup row>
                    <CCol xs={7}>
                      <CLabel className="recharge-token-title">
                        {t('anftDapp.listingComponent.extendOwnership.currentOwnership')}
                      </CLabel>
                    </CCol>
                    {listing?.ownership ? (
                      <CCol xs={5}>
                        <p className="text-primary text-right">{convertUnixToDate(listing.ownership.toNumber())}</p>
                      </CCol>
                    ) : (
                      ''
                    )}
                  </CFormGroup>

                  <CFormGroup row>
                    <CCol xs={7}>
                      <CLabel className="recharge-token-title">
                        {t('anftDapp.listingComponent.primaryInfo.dailyPayment')}
                      </CLabel>
                    </CCol>
                    <CCol xs={5}>
                      <p className="text-primary text-right">{formatBNToken(listing?.dailyPayment, true)}</p>
                    </CCol>
                  </CFormGroup>
                  <CFormGroup row>
                    <CCol xs={6}>
                      <CLabel className="recharge-token-title">
                        {t('anftDapp.listingComponent.extendOwnership.tokenBalance')}
                      </CLabel>
                    </CCol>
                    <CCol xs={6}>
                      <p className="text-primary text-right">{formatBNToken(tokenBalance, true)}</p>
                    </CCol>
                  </CFormGroup>
                  <CFormGroup row className={`${screenWidth <= 335 ? 'd-none' : ''}`}>
                    <CCol xs={12}>
                      <CLabel className="recharge-token-title">
                        {t('anftDapp.listingComponent.withdrawToken.ownershipRange')}
                      </CLabel>
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
                            const dateCount = calculateDateDifference(startDate, endDate);
                            setFieldValue('dateCount', dateCount);
                          }
                        }}
                        focusedInput={focusedInput}
                        onFocusChange={setFocusedInput as any}
                        isOutsideRange={(day) => {
                          const startDateObj = moment(startDate).startOf('day');
                          const endDateObj = moment(startDate)
                            .add(getExtenableDayFromTokenBalance(), 'day')
                            .endOf('day');
                          return !checkDateRange(day, startDateObj, endDateObj);
                        }}
                        initialVisibleMonth={() => moment(startDate).add(0, 'month')}
                        numberOfMonths={1}
                        orientation={'horizontal'}
                      />
                    </CCol>
                  </CFormGroup>
                  <CFormGroup row className={`mb-0`}>
                    <CCol xs={6}>
                      <CLabel className="recharge-token-title">
                        {t('anftDapp.listingComponent.withdrawToken.days')}
                      </CLabel>
                      <CInput
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const extendDay = Number(unInsertCommas(e.target.value));
                          try {
                            BigNumber.from(extendDay);
                            const extendDate = moment(startDate).add(
                              returnMaxEndDate(extendDay, getExtenableDayFromTokenBalance()),
                              'day'
                            );
                            setFieldValue('dateCount', extendDay);
                            setFieldValue('endDate', extendDate);
                          } catch (err) {
                            errors.dateCount = `${t('anftDapp.listingComponent.extendOwnership.balanceIsNotEnough')}`;
                          }
                        }}
                        id="dateCount"
                        autoComplete="off"
                        name="dateCount"
                        value={values.dateCount ? insertCommas(values.dateCount) : ''}
                        className="btn-radius-50"
                      />
                    </CCol>
                    <CCol xs={6} className="spending-estimation text-right">
                      <CLabel className="recharge-token-title">
                        {t('anftDapp.listingComponent.extendOwnership.spendingEstimation')}
                      </CLabel>
                      <CInput
                        value={`${
                          values.dateCount > 0 && values.startDate
                            ? insertCommas(calculateExtendPriceByDays(values.dateCount, values.startDate))
                            : '0'
                        } ANFT`}
                        className="btn-radius-50"
                        disabled
                      />
                    </CCol>
                    <CCol xs={12} className="mt-2">
                      <CInvalidFeedback className={errors.dateCount && touched.dateCount ? 'd-block' : 'd-none'}>
                        {errors.dateCount}
                      </CInvalidFeedback>
                      <CFormText>
                        {t('anftDapp.listingComponent.extendOwnership.noticeText', {
                          day: `${values.endDate.format(APP_LOCAL_DATE_FORMAT)}`,
                        })}
                      </CFormText>
                    </CCol>
                  </CFormGroup>
                </CCol>
              </CRow>
            </CModalBody>
            <CModalFooter className="justify-content-between">
              <CCol>
                <CButton
                  className="px-2 w-100 btn-font-style btn-radius-50 btn btn-outline-primary"
                  onClick={closeModal}
                >
                  {t('anftDapp.global.modal.cancel')}
                </CButton>
              </CCol>
              <CCol>
                <CButton className="px-2 w-100 btn btn-primary btn-font-style btn-radius-50" type="submit">
                  {t('anftDapp.global.modal.confirm')}
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
