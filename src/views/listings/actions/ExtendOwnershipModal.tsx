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
  CProgress,
  CProgressBar,
  CRow
} from '@coreui/react';
import { BigNumber } from 'ethers';
import { Formik, FormikProps } from 'formik';
import moment, { Moment } from 'moment';
import React, { useEffect, useRef } from 'react';
import { DateRangePicker } from 'react-dates';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { APP_LOCAL_DATE_FORMAT } from '../../../config/constants';
import { LISTING_INSTANCE } from '../../../shared/blockchain-helpers';
import {
  calculateDateDifference,
  calculateRatio,
  calculateSpendingFromSecond,
  checkDateRange,
  checkOwnershipAboutToExpire,
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
import { CommercialTypes } from '../../../shared/enumeration/comercialType';
import { EventType } from '../../../shared/enumeration/eventType';
import { mapPriceStatusBadge, PriceStatus } from '../../../shared/enumeration/goodPrice';
import { ModalType } from '../../../shared/enumeration/modalType';
import { RiskLevel, riskLevelArray } from '../../../shared/enumeration/riskLevel';
import useWindowDimensions from '../../../shared/hooks/useWindowDimensions';
import { RootState } from '../../../shared/reducers';
import { selectEntityById } from '../../assets/assets.reducer';
import { getEntity } from '../../productType/category.api';
import {
  fetching as fetchingCategory,
  selectEntityById as selectCategoryById
} from '../../productType/category.reducer';
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

interface IForecastValue {
  value: number;
  text: string;
  color: string;
}

type TMappingPriceStatusToText = { [key in PriceStatus]: string };

type TMappingSuccessRateToProfits = { [key in RiskLevel]: number };

type TMappingSuccessRate = { [key in RiskLevel]: IForecastValue };

type TModelTypeMappingMoment = { [key in ModalType.OWNERSHIP_EXTENSION | ModalType.OWNERSHIP_REGISTER]: moment.Moment };

interface IIntialValues {
  price: number;
  tokenAmount: number;
  startDate: moment.Moment;
  endDate: moment.Moment;
  dateCount: number;
  profit: number;
  priceStatus: PriceStatus;
  riskLevel: RiskLevel;
  commercialTypes: CommercialTypes;
}

interface IRiskValue {
  VERY_LOW: number;
  LOW: number;
  MEDIUM: number;
  HIGH: number;
  VERY_HIGH: number;
}

const isCurrentDatePlusValueOverdue = (value: number, expiredDate: Moment) => {
  const currDate = moment();
  return currDate.add(value, 'day') <= expiredDate;
};

const ExtendOwnershipModal = (props: IExtendOwnershipModal) => {
  const { isVisible, setVisibility, listingId, title, modelType } = props;
  const dispatch = useDispatch();
  const { width: screenWidth } = useWindowDimensions();
  const formikRef = useRef<FormikProps<IIntialValues>>(null);
  const [focusedInput, setFocusedInput] = React.useState(null);

  const listing = useSelector(selectEntityById(listingId));
  const listingType = useSelector(selectCategoryById(listing?.typeId || ''));
  const { signer, tokenBalance } = useSelector((state: RootState) => state.wallet);
  const { submitted } = useSelector((state: RootState) => state.transactions);

  const { t } = useTranslation();

  const expiredLicenseDate = moment(listing?.licenseDate).add(listing?.licensePeriod, 'year');

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

  useEffect(() => {
    if (listing?.typeId) {
      dispatch(fetchingCategory());
      dispatch(getEntity(listing.typeId));
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listing?.typeId]);

  const aboutToExpire = listing?.ownership ? checkOwnershipAboutToExpire(listing.ownership.toNumber()) : false;

  const getStartDate = (): moment.Moment => {
    const currentDate = moment();
    const currentOwnership =
      listing?.ownership && !aboutToExpire ? moment.unix(listing.ownership.toNumber()) : moment();
    const modalTypeToStartDateMapping: TModelTypeMappingMoment = {
      [ModalType.OWNERSHIP_EXTENSION]: currentOwnership,
      [ModalType.OWNERSHIP_REGISTER]: currentDate,
    };
    return modalTypeToStartDateMapping[modelType];
  };

  const startDate = getStartDate();
  const endDate = moment(startDate).add(1, 'day').endOf('day');

  const getComercialTypes = () => {
    const commercialTypes = listing?.commercialTypes;
    if (commercialTypes && commercialTypes.length > 1) {
      return CommercialTypes.SELL;
    }

    if (commercialTypes && commercialTypes.length === 1 && commercialTypes[0] === CommercialTypes.RENT) {
      return CommercialTypes.RENT;
    }

    return CommercialTypes.SELL;
  };

  const getComercialTypesName = () => {
    const commercialTypes = listing?.commercialTypes;
    if (commercialTypes && commercialTypes.length > 1) {
      return 'SELL_RENT';
    }
    if (commercialTypes && commercialTypes.length === 1 && commercialTypes[0] === CommercialTypes.RENT) {
      return 'RENT';
    }
    return 'SELL';
  };

  const initialValues: IIntialValues = {
    price: 0,
    tokenAmount: 0,
    startDate,
    endDate,
    dateCount: calculateDateDifference(startDate, endDate),
    profit: 0,
    priceStatus: PriceStatus.LOW,
    riskLevel: RiskLevel.VERY_HIGH,
    commercialTypes: getComercialTypes(),
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
      .required(t('anftDapp.listingComponent.extendOwnership.inputIsRequired'))
      .test(
        'dateCount-must-lt-period',
        t('anftDapp.listingComponent.extendOwnership.exceedingPeriod', { day: `${listing?.period}` }),
        function (value: number | undefined) {
          if (!value || !listing?.period) return true;
          return value <= listing.period;
        }
      )
      .test(
        'dateCount-must-lt-license',
        t('anftDapp.listingComponent.extendOwnership.exceedingLicenseExpirationDate', {
          day: `${expiredLicenseDate.format(APP_LOCAL_DATE_FORMAT)}`,
        }),
        function (value: number | undefined) {
          if (!value || !listing?.licensePeriod || !listing?.licenseDate) return true;
          return isCurrentDatePlusValueOverdue(value, expiredLicenseDate);
        }
      ),
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

  // QLTSS
  const mappingSuccessRate: TMappingSuccessRate = {
    [RiskLevel.VERY_HIGH]: {
      value: 5,
      text: t('anftDapp.listingComponent.successLevel.VERY_HIGH'),
      color: 'danger',
    },
    [RiskLevel.HIGH]: {
      value: 25,
      text: t('anftDapp.listingComponent.successLevel.HIGH'),
      color: 'warning',
    },
    [RiskLevel.MEDIUM]: {
      value: 50,
      text: t('anftDapp.listingComponent.successLevel.MEDIUM'),
      color: 'primary',
    },
    [RiskLevel.LOW]: {
      value: 75,
      text: t('anftDapp.listingComponent.successLevel.LOW'),
      color: 'info',
    },
    [RiskLevel.VERY_LOW]: {
      value: 100,
      text: t('anftDapp.listingComponent.successLevel.VERY_LOW'),
      color: 'success',
    },
  };

  const successRateForecast = (percent: number): RiskLevel => {
    if (percent <= riskValue.VERY_HIGH) {
      return RiskLevel.VERY_HIGH;
    }
    if (percent > riskValue.VERY_HIGH && percent <= riskValue.HIGH) {
      return RiskLevel.HIGH;
    }
    if (percent > riskValue.HIGH && percent <= riskValue.MEDIUM) {
      return RiskLevel.MEDIUM;
    }
    if (percent > riskValue.MEDIUM && percent <= riskValue.LOW) {
      return RiskLevel.LOW;
    }
    return RiskLevel.VERY_LOW;
  };

  const handleRiskProgressValue = (days: number): RiskLevel => {
    const percentRegistOnMaxStage = (days / listingData.maximumStage) * 100;
    const riskLevel = successRateForecast(percentRegistOnMaxStage);
    // if (priceStatus === PriceStatus.HIGH) return mappingSuccessRate[mappingPriceStatus[riskLevel]];
    // return mappingSuccessRate[riskLevel];
    // if (priceStatus === PriceStatus.HIGH) return remappingRiskLevel[riskLevel];
    return riskLevel;
  };

  const USD_TO_VND_RATIO = 23300;
  const ANFT_TO_USD_RATIO = 1;
  //api get real-time price of token from pancakeswap: https://api.pancakeswap.info/api/v2/tokens/{token_address}

  const ANFT_TO_VND_RATIO = ANFT_TO_USD_RATIO * USD_TO_VND_RATIO;

  const listingData = {
    sellPrice: listing?.price && listing?.price > 0 ? listing?.price / ANFT_TO_VND_RATIO : 0,
    pricePerDay: listing?.fee && listing?.fee > 0 ? listing?.fee / ANFT_TO_VND_RATIO : 0,
    goodPrice: listing?.goodPrice && listing?.goodPrice > 0 ? listing?.goodPrice / ANFT_TO_VND_RATIO : 0,
    goodRentPrice: listing?.goodRentCost && listing?.goodRentCost > 0 ? listing?.goodRentCost / ANFT_TO_VND_RATIO : 0,
    rentPrice: listing?.rentCost && listing?.rentCost > 0 ? listing?.rentCost / ANFT_TO_VND_RATIO : 0,
    ratio: ANFT_TO_VND_RATIO,
    maximumStage: Number(listing?.durationRisk?.value) || 0,
    period: listing?.period || 0,
  };

  const getRiskValue = (type: RiskLevel): number => {
    const riskLevel = listingType?.risks.find((item) => item.type === type);
    return Number(riskLevel?.value || 0);
  };

  const getProfitsValue = (type: RiskLevel): number => {
    const riskLevel = listingType?.profits.find((item) => item.type === type);
    return Number(riskLevel?.value || 0);
  };

  const riskValue: IRiskValue = {
    VERY_LOW: getRiskValue(RiskLevel.VERY_LOW),
    LOW: getRiskValue(RiskLevel.LOW),
    MEDIUM: getRiskValue(RiskLevel.MEDIUM),
    HIGH: getRiskValue(RiskLevel.HIGH),
    VERY_HIGH: getRiskValue(RiskLevel.VERY_HIGH),
  };

  const profitsValue: IRiskValue = {
    VERY_LOW: getProfitsValue(RiskLevel.VERY_LOW),
    LOW: getProfitsValue(RiskLevel.LOW),
    MEDIUM: getProfitsValue(RiskLevel.MEDIUM),
    HIGH: getProfitsValue(RiskLevel.HIGH),
    VERY_HIGH: getProfitsValue(RiskLevel.VERY_HIGH),
  };
  //t('anftDapp.listingComponent.successLevel.VERY_HIGH')
  const mappingPriceStatusToText: TMappingPriceStatusToText = {
    [PriceStatus.LOW]: t('anftDapp.listingComponent.extendOwnership.priceStatus.LOW'),
    [PriceStatus.GOOD]: t('anftDapp.listingComponent.extendOwnership.priceStatus.GOOD'),
    [PriceStatus.HIGH]: t('anftDapp.listingComponent.extendOwnership.priceStatus.HIGH'),
  };

  const mappingSuccessRateToProfits: TMappingSuccessRateToProfits = {
    [RiskLevel.VERY_HIGH]: profitsValue.VERY_HIGH,
    [RiskLevel.HIGH]: profitsValue.HIGH,
    [RiskLevel.MEDIUM]: profitsValue.MEDIUM,
    [RiskLevel.LOW]: profitsValue.LOW,
    [RiskLevel.VERY_LOW]: profitsValue.VERY_LOW,
  };
  const calculateProfit = (
    price: number,
    risk: RiskLevel,
    priceStatus: PriceStatus,
    commercialTypes: CommercialTypes
  ) => {
    const riskLevelInx = riskLevelArray.indexOf(risk);
    const findNextRisk = risk !== RiskLevel.VERY_HIGH ? riskLevelArray[riskLevelInx + 1] : risk;
    const profit = mappingSuccessRateToProfits[priceStatus === PriceStatus.HIGH ? findNextRisk : risk];
    const ownerPrice = commercialTypes === CommercialTypes.SELL ? listingData.sellPrice : listingData.rentPrice;
    const profitPercent = profit / 100;
    const diff = price <= ownerPrice ? 0 : (price - ownerPrice) * profitPercent;
    return diff;
  };

  const checkPriceisGood = (price: number, commercialTypes: CommercialTypes): PriceStatus => {
    if (commercialTypes === CommercialTypes.SELL) {
      if (price <= listingData.sellPrice) return PriceStatus.LOW;
      if (listingData.sellPrice < price && price <= listingData.goodPrice) return PriceStatus.GOOD;
      return PriceStatus.HIGH;
    } else {
      if (price <= listingData.rentPrice) return PriceStatus.LOW;
      return PriceStatus.GOOD;
    }
  };

  const calculateProfitRatio = (days: number, profit: number): string => {
    if (!profit || !days) return t('anftDapp.listingComponent.extendOwnership.undefined');
    const totalInputDaysAmount = days * listingData.pricePerDay;
    const ratio = calculateRatio(totalInputDaysAmount, profit);
    return `${ratio.numerator} : ${insertCommas(ratio.denominator)}`;
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
        {({ values, errors, touched, setFieldValue, handleSubmit, handleChange }) => (
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
                  <CFormGroup row>
                    <CCol xs={6}>
                      <CLabel className="recharge-token-title">
                        {t('anftDapp.listingComponent.extendOwnership.comercialType')}:
                      </CLabel>
                    </CCol>
                    <CCol xs={6}>
                      <p className="text-primary text-right">
                        {t(`anftDapp.listingComponent.methods.${getComercialTypesName()}`)}
                      </p>
                    </CCol>
                  </CFormGroup>

                  <CFormGroup row>
                    <CCol xs={12}>
                      <CLabel className="recharge-token-title">
                        {t(
                          `anftDapp.listingComponent.extendOwnership.${
                            values.commercialTypes === CommercialTypes.RENT ? 'secondaryRent' : 'secondaryPrice'
                          }`
                        )}
                        :
                      </CLabel>
                    </CCol>
                    <CCol xs={12}>
                      <CInput
                        id="price"
                        name="price"
                        className="btn-radius-50"
                        type="text"
                        onChange={(e: React.FormEvent<HTMLInputElement>) => {
                          const priceStatus = checkPriceisGood(
                            Number(unInsertCommas(e.currentTarget.value)),
                            values.commercialTypes
                          );
                          setFieldValue('price', unInsertCommas(e.currentTarget.value));
                          setFieldValue('priceStatus', priceStatus);
                          setFieldValue(
                            'profit',
                            calculateProfit(
                              Number(unInsertCommas(e.currentTarget.value)),
                              values.riskLevel,
                              priceStatus,
                              values.commercialTypes
                            )
                          );
                        }}
                        value={insertCommas(values.price)}
                      />
                      <CFormText className={`text-${mapPriceStatusBadge[values.priceStatus]}`}>
                        {mappingPriceStatusToText[values.priceStatus]}
                      </CFormText>
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
                  <CFormGroup row>
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
                            const riskLevel = handleRiskProgressValue(Number(e.currentTarget.value));
                            setFieldValue(
                              'profit',
                              calculateProfit(values.price, riskLevel, values.priceStatus, values.commercialTypes)
                            );
                            setFieldValue('riskLevel', riskLevel);
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
                      <CFormText>
                        <p className={`text-danger m-0`}>
                          {t('anftDapp.global.modal.noticeText', {
                            aboutToExpire: `${moment(values.endDate).subtract(1, 'd').format(APP_LOCAL_DATE_FORMAT)}`,
                            expired: `${values.endDate.format(APP_LOCAL_DATE_FORMAT)}`,
                          })}
                        </p>
                      </CFormText>
                    </CCol>
                  </CFormGroup>
                  <CFormGroup row>
                    <CCol xs={4}>
                      <CLabel className="fw-bold ">{t('anftDapp.listingComponent.extendOwnership.profit')}:</CLabel>
                    </CCol>
                    <CCol xs={8}>
                      <p className="text-primary text-right">
                        {values.profit ? insertCommas(values.profit) : '_'} ANFT
                      </p>
                    </CCol>
                  </CFormGroup>
                  <CFormGroup row>
                    <CCol xs={12}>
                      <CLabel className="fw-bold">{t('anftDapp.listingComponent.extendOwnership.successRate')}:</CLabel>
                    </CCol>
                    <CCol xs={12}>
                      <CProgress>
                        <CProgressBar
                          value={mappingSuccessRate[values.riskLevel].value}
                          color={mappingSuccessRate[values.riskLevel].color}
                        />
                      </CProgress>
                      <small className={`text-${mappingSuccessRate[values.riskLevel].color}`}>
                        {mappingSuccessRate[values.riskLevel].text}
                      </small>
                    </CCol>
                  </CFormGroup>
                  <CFormGroup row>
                    <CCol xs={4}>
                      <CLabel className="fw-bold ">
                        {t('anftDapp.listingComponent.extendOwnership.profitRatio')}:
                      </CLabel>
                    </CCol>
                    <CCol xs={8}>
                      <p className="text-primary text-right">{calculateProfitRatio(values.dateCount, values.profit)}</p>
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
