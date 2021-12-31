import CIcon from '@coreui/icons-react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardTitle,
  CCol,
  CCollapse,
  CContainer,
  CDataTable,
  CForm,
  CFormGroup,
  CInput,
  CInputGroup,
  CInputGroupAppend,
  CInvalidFeedback,
  CLabel,
  CLink,
  CRow,
} from '@coreui/react';
import { faPen, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';
import { BigNumber } from 'ethers';
import { Formik, FormikProps } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import * as Yup from 'yup';
import { calculateStakeHolderReward, ICalSHReward, LISTING_INSTANCE } from '../../../shared/blockchain-helpers';
import {
  convertBnToDecimal,
  convertDecimalToBn,
  convertUnixToDate,
  formatBNToken,
  insertCommas,
  unInsertCommas,
} from '../../../shared/casual-helpers';
import ConfirmModal from '../../../shared/components/ConfirmModal';
import InfoLoader from '../../../shared/components/InfoLoader';
import SubmissionModal from '../../../shared/components/SubmissionModal';
import { ToastError } from '../../../shared/components/Toast';
import { EventType } from '../../../shared/enumeration/eventType';
import { ModalType, TModalsVisibility } from '../../../shared/enumeration/modalType';
import useWindowDimensions from '../../../shared/hooks/useWindowDimensions';
import { baseOptions, IOption } from '../../../shared/models/options.model';
import { RootState } from '../../../shared/reducers';
import { getEntity, getOptionsWithStakes } from '../../assets/assets.api';
import { fetchingEntity, selectEntityById } from '../../assets/assets.reducer';
import { baseSetterArgs } from '../../transactions/settersMapping';
import { IProceedTxBody, proceedTransaction } from '../../transactions/transactions.api';
import { fetching, hardReset } from '../../transactions/transactions.reducer';
import '../index.scss';

interface IRegisterParams {
  [x: string]: string;
}
interface IRegister {
  registerAmount: number;
}

const titleTableStyle = {
  textAlign: 'left',
  color: '#828282',
  fontSize: '0.875rem',
  lineHeight: '16px',
  fontWeight: '400',
};

const registerView = [
  {
    key: 'activityName',
    _style: titleTableStyle,
    label: 'Hoạt động',
  },
  {
    key: 'reward',
    _style: titleTableStyle,
    label: 'Tỉ lệ thưởng',
  },
  {
    key: 'registerAmount',
    _style: titleTableStyle,
    label: 'Mức đăng ký',
  },
];

interface IRegisterProps extends RouteComponentProps<IRegisterParams> {}

const Register = (props: IRegisterProps) => {
  const { match } = props;
  const { id } = match.params;

  const dispatch = useDispatch();
  const formikRef = useRef<FormikProps<IRegister>>(null);

  const { signerAddress, signer, provider } = useSelector((state: RootState) => state.wallet);

  const { initialState } = useSelector((state: RootState) => state.assets);
  const { tokenBalance } = useSelector((state: RootState) => state.wallet);
  const { success, submitted } = useSelector((state: RootState) => state.transactions);

  const { entityLoading } = initialState;

  const listing = useSelector(selectEntityById(Number(id)));

  const { width: screenWidth } = useWindowDimensions();

  const [details, setDetails] = useState<string[]>([]);

  const toggleDetails = (reqId: string) => {
    if (!signerAddress) return ToastError('Bạn chưa liên kết với ví của mình');
    proceedCalculation(Number(reqId)).then((res) => setAmountToReturn(res));

    const position = details.indexOf(reqId);
    let newDetails = details.slice();
    if (position !== -1) {
      newDetails.splice(position, 1);
    } else {
      newDetails = [reqId];
    }

    setDetails(newDetails);
    setChosenOptionId(undefined);
    setIsEditingRegister(false);
    setInitialRegisterAmount(undefined);
    formikRef.current?.resetForm();
  };

  const initialModalState: TModalsVisibility = {
    [ModalType.OWNERSHIP_EXTENSION]: false,
    [ModalType.OWNERSHIP_WITHDRAW]: false,
    [ModalType.OWNERSHIP_REGISTER]: false,
    [ModalType.REWARD_CLAIM]: false,
    [ModalType.REWARD_UNREGISTER]: false,
  };

  const [modalsVisibility, setModalVisibility] = useState<TModalsVisibility>(initialModalState);

  const handleModalVisibility = (type: ModalType, isVisible: boolean) => {
    setModalVisibility({ ...initialModalState, [type]: isVisible });
  };

  const handleRawFormValues = (input: IRegister, id: number): IProceedTxBody => {
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
      listingId: Number(id),
      contract: instance,
      type: EventType.REGISTER,
      args: {
        ...baseSetterArgs,
        _amount: convertDecimalToBn(input.registerAmount.toString()),
        _optionId: id,
      },
    };
    return output;
  };

  const validationSchema = Yup.object().shape({
    registerAmount: Yup.number()
      .test('stake-unchange', 'Input amount is unchange', function (value) {
        if (!value) return true;
        return value !== initialRegisterAmount;
      })
      .test('do-not-exceed-tokenBalance', `Input amount exceeds token balance`, function (value) {
        if (!value) return true;
        if (!tokenBalance) return true;
        return convertDecimalToBn(String(value)).lte(tokenBalance);
      })
      .typeError('Incorrect input type!')
      .required('This field is required!')
      .min(1, 'Minimum register for the listing is 1.0 token!'),
  });

  const handleClaimAndUnregisterValues = (optionId: number, type: EventType) => {
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
      listingId: Number(id),
      contract: instance,
      type: type,
      args: { ...baseSetterArgs, _optionId: optionId },
    };

    return output;
  };

  const onUnregisterCnfrm = (id: number) => {
    dispatch(fetching());
    const body = handleClaimAndUnregisterValues(id, EventType.UNREGISTER);
    dispatch(proceedTransaction(body));
  };

  const onClaimRewardCnfrm = (id: number) => {
    dispatch(fetching());
    const body = handleClaimAndUnregisterValues(id, EventType.CLAIM);
    dispatch(proceedTransaction(body));
  };

  useEffect(() => {
    if (!id || !provider) return;
    dispatch(fetchingEntity());
    dispatch(
      getEntity({
        id: Number(id),
        provider,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (success && id && provider) {
      dispatch(fetchingEntity());
      dispatch(
        getEntity({
          id: Number(id),
          provider,
        })
      );
      dispatch(hardReset());
      setDetails([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]);

  useEffect(() => {
    if (listing && signerAddress && provider) {
      dispatch(fetchingEntity());
      dispatch(getOptionsWithStakes({ listing, stakeholder: signerAddress, provider }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(listing), signerAddress]);

  const initialValues: IRegister = {
    registerAmount: 0,
  };

  useEffect(() => {
    if (submitted) {
      setModalVisibility(initialModalState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted]);

  const createInitialValues = (item: IOption): IRegister => {
    if (!item.stake?.amount) return initialValues;
    return { ...initialValues, registerAmount: Number(convertBnToDecimal(item.stake.amount)) };
  };

  const [amountToReturn, setAmountToReturn] = useState<BigNumber | undefined>(undefined);

  const proceedCalculation = async (optionId: number) => {
    if (!listing || !signer || !signerAddress || !listing.options) return BigNumber.from(0);
    const instance = LISTING_INSTANCE({ address: listing.address, signer });
    if (!instance) return BigNumber.from(0);
    const optionInfo = listing.options.find(({ id }) => id === optionId);

    const currentUnix = dayjs().unix();

    const value: ICalSHReward = {
      instance: instance,
      optionInfo: optionInfo!,
      stakeholder: signerAddress,
      currentUnix: BigNumber.from(currentUnix),
      storedListing: listing,
    };

    const result = await calculateStakeHolderReward(value);

    return result;
  };

  const onRefreshAmountToReturn = (optionId: number) => (): void => {
    proceedCalculation(optionId).then((res) => setAmountToReturn(res));
  };

  const [isEditingRegister, setIsEditingRegister] = useState<boolean>(false);
  const [initialRegisterAmount, setInitialRegisterAmount] = useState<number | undefined>(undefined);
  const [chosenOptionId, setChosenOptionId] = useState<number | undefined>(undefined);

  const onEditingRegister = (registerAmount: number) => () => {
    setIsEditingRegister(true);
    setInitialRegisterAmount(registerAmount);
  };

  const onCancelEditingRegister = (setFieldValue: (field: string, value: any) => void) => () => {
    setIsEditingRegister(false);
    setFieldValue(`registerAmount`, initialRegisterAmount);
  };

  const onClaimRewardOrUnregister = (optionId: number, type: ModalType) => () => {
    handleModalVisibility(type, true);
    setChosenOptionId(optionId);
  };

  return (
    <CContainer fluid className="mx-0 my-2">
      <SubmissionModal />
      <CRow>
        <CCol xs={12}>
          <CLabel className="text-primary content-title">Chọn mức đăng ký</CLabel>
        </CCol>
        <CCol xs={12}>
          <CCard className="m-0 listing-img-card">
            {!entityLoading && listing ? (
              <img src={listing.images} alt="listingImg" className="w-100 h-100" />
            ) : (
              // Ensuring 16:9 ratio for image and image loader
              <InfoLoader width={screenWidth} height={screenWidth / 1.77} />
            )}
            <CCardBody className="p-0 listing-card-body">
              <CCardTitle className="listing-card-title mb-0 px-3 py-2 w-100">
                <p className="mb-2 text-white content-title">202 Yên Sở - Hoàng Mai - Hà Nội</p>
                <p className="mb-0 text-white detail-title-font">
                  Hoạt động <b>{baseOptions.length}</b>
                </p>
              </CCardTitle>
            </CCardBody>
          </CCard>
          {listing ? (
            <CDataTable
              striped
              items={listing.options}
              fields={registerView}
              responsive
              hover
              header
              scopedSlots={{
                activityName: (item: IOption) => {
                  return (
                    <td
                      onClick={() => {
                        toggleDetails(item.id.toString());
                      }}
                    >
                      <span className="text-primary d-inline-block text-truncate" style={{ maxWidth: '100px' }}>
                        {item.name ? item.name : '_'}
                      </span>
                    </td>
                  );
                },
                reward: (item: IOption) => {
                  return <td>{item.reward ? `${item.reward.toString()}%` : '_'}</td>;
                },
                registerAmount: (item: IOption) => {
                  return <td>{item.stake?.amount ? formatBNToken(item.stake?.amount, true) : '_'}</td>;
                },
                details: (item: IOption) => {
                  return (
                    <CCollapse show={details.includes(item.id.toString())}>
                      <CCard className="mb-0">
                        <CCardBody className="px-3">
                          <CRow className="align-items-center">
                            <CCol xs={12}>
                              <CFormGroup row>
                                <CCol xs={6}>
                                  <CLabel className="font-weight-bold my-2">Tokens available: </CLabel>
                                </CCol>
                                <CCol xs={6}>
                                  <p className="text-primary my-2">{formatBNToken(tokenBalance, true)}</p>
                                </CCol>
                              </CFormGroup>
                              {item.stake?.start && !item.stake.start.eq(0) ? (
                                <CFormGroup row>
                                  <CCol xs={6}>
                                    <p className="font-weight-bold my-2">Ngày đăng ký: </p>
                                  </CCol>
                                  <CCol xs={6}>
                                    <p className="my-2">{convertUnixToDate(item.stake?.start.toNumber())}</p>
                                  </CCol>
                                </CFormGroup>
                              ) : (
                                ''
                              )}
                              <Formik
                                innerRef={formikRef}
                                enableReinitialize
                                initialValues={createInitialValues(item)}
                                validationSchema={validationSchema}
                                onSubmit={(rawValues) => {
                                  try {
                                    const value = handleRawFormValues(rawValues, item.id);
                                    dispatch(fetching());
                                    dispatch(proceedTransaction(value));
                                  } catch (error) {
                                    console.log(`Error submitting form ${error}`);
                                    ToastError(`Error submitting form ${error}`);
                                  }
                                }}
                              >
                                {({ values, errors, touched, handleBlur, handleSubmit, setFieldValue, submitForm }) => (
                                  <CForm className="form-horizontal" onSubmit={handleSubmit}>
                                    <CFormGroup row>
                                      <CCol xs={6}>
                                        <p className="font-weight-bold my-2">Mức đăng ký: </p>
                                      </CCol>
                                      <CCol xs={6}>
                                        <CInputGroup>
                                          <CInput
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                              setFieldValue(`registerAmount`, unInsertCommas(e.target.value));
                                            }}
                                            id="registerAmount"
                                            autoComplete="off"
                                            name="registerAmount"
                                            value={values.registerAmount ? insertCommas(values.registerAmount) : ''}
                                            onBlur={handleBlur}
                                            placeholder="Mức đăng ký..."
                                            className="btn-radius-50"
                                            disabled={!isEditingRegister && !item.stake?.amount.eq(0)}
                                          />
                                          {item.stake?.amount && !item.stake.amount.eq(0) && !isEditingRegister ? (
                                            <CInputGroupAppend>
                                              <CButton
                                                color="primary"
                                                className="btn-radius-50"
                                                onClick={onEditingRegister(
                                                  Number(convertBnToDecimal(item.stake.amount))
                                                )}
                                              >
                                                <FontAwesomeIcon icon={faPen} />
                                              </CButton>
                                            </CInputGroupAppend>
                                          ) : (
                                            ''
                                          )}
                                        </CInputGroup>
                                        {isEditingRegister || item.stake?.amount.eq(0) ? (
                                          <CInvalidFeedback
                                            className={
                                              !!errors.registerAmount && touched.registerAmount ? 'd-block' : 'd-none'
                                            }
                                          >
                                            {errors.registerAmount}
                                          </CInvalidFeedback>
                                        ) : (
                                          ''
                                        )}
                                      </CCol>
                                    </CFormGroup>
                                    {item.stake?.amount ? (
                                      !item.stake.amount.eq(0) ? (
                                        <>
                                          <CFormGroup row>
                                            <CCol xs={6}>
                                              <p className="font-weight-bold my-2">Mức nhận thưởng: </p>
                                            </CCol>
                                            <CCol xs={6}>
                                              <p className="text-primary my-2">
                                                {amountToReturn ? formatBNToken(amountToReturn, true) : 0}
                                                <CButton
                                                  onClick={onRefreshAmountToReturn(item.id)}
                                                  className="p-0 ml-2"
                                                >
                                                  <FontAwesomeIcon icon={faSyncAlt} className="text-primary" />
                                                </CButton>
                                              </p>
                                            </CCol>
                                          </CFormGroup>
                                          {isEditingRegister ? (
                                            <CFormGroup row>
                                              <CCol xs={12} className="d-flex justify-content-center mt-3">
                                                <CButton
                                                  className="btn-radius-50 btn btn-sm btn-primary mr-2"
                                                  onClick={submitForm}
                                                >
                                                  Confirm
                                                </CButton>
                                                <CButton
                                                  className="btn-radius-50 btn btn-sm btn-outline-danger ml-2"
                                                  variant="ghost"
                                                  onClick={onCancelEditingRegister(setFieldValue)}
                                                >
                                                  Cancel
                                                </CButton>
                                              </CCol>
                                            </CFormGroup>
                                          ) : (
                                            <CFormGroup row>
                                              <CCol xs={12} className="d-flex justify-content-center mt-3">
                                                <CButton
                                                  className="btn-radius-50 btn btn-sm btn-success mr-2"
                                                  onClick={onClaimRewardOrUnregister(item.id, ModalType.REWARD_CLAIM)}
                                                >
                                                  Claim Reward
                                                </CButton>
                                                <CButton
                                                  className="btn-radius-50 btn btn-sm btn-outline-danger ml-2"
                                                  variant="ghost"
                                                  onClick={onClaimRewardOrUnregister(
                                                    item.id,
                                                    ModalType.REWARD_UNREGISTER
                                                  )}
                                                >
                                                  Unregister
                                                </CButton>
                                              </CCol>
                                            </CFormGroup>
                                          )}
                                        </>
                                      ) : (
                                        <CFormGroup row>
                                          <CCol xs={12} className="d-flex justify-content-center mt-3">
                                            <CButton
                                              className="btn-radius-50 btn btn-sm btn-primary mr-2"
                                              type="submit"
                                            >
                                              Register
                                            </CButton>
                                          </CCol>
                                        </CFormGroup>
                                      )
                                    ) : (
                                      ''
                                    )}
                                  </CForm>
                                )}
                              </Formik>
                            </CCol>
                          </CRow>
                        </CCardBody>
                      </CCard>
                    </CCollapse>
                  );
                },
              }}
            />
          ) : (
            ''
          )}
          <ConfirmModal
            isVisible={modalsVisibility[ModalType.REWARD_CLAIM]}
            color="success"
            title="Nhận thưởng hoạt động"
            CustomJSX={() => {
              if (chosenOptionId === undefined || !listing?.options) return <></>;
              return (
                <p>
                  Bạn chắc chắn muốn nhận thưởng của hoạt động{' '}
                  <span className="text-primary">“{listing.options[chosenOptionId].name}”</span>
                </p>
              );
            }}
            onConfirm={() => onClaimRewardCnfrm(listing?.options ? listing.options[chosenOptionId!].id : 0)}
            onAbort={() => handleModalVisibility(ModalType.REWARD_CLAIM, false)}
          />
          <ConfirmModal
            isVisible={modalsVisibility[ModalType.REWARD_UNREGISTER]}
            color="danger"
            title="Xác nhận hủy đăng ký"
            CustomJSX={() => {
              if (chosenOptionId === undefined || !listing?.options) return <></>;
              return (
                <p>
                  Bạn chắc chắn muốn hủy <span className="text-primary">“{listing.options[chosenOptionId].name}”</span>{' '}
                  với đăng ký{' '}
                  <span className="text-primary">
                    {formatBNToken(listing.options[chosenOptionId].stake?.amount, true)}
                  </span>
                </p>
              );
            }}
            onConfirm={() => onUnregisterCnfrm(listing?.options ? listing.options[chosenOptionId!].id : 0)}
            onAbort={() => handleModalVisibility(ModalType.REWARD_UNREGISTER, false)}
          />
          <CCol xs={12} className="px-0">
            <i className="detail-title-font">*Lựa chọn Hoạt động bạn muốn SỬA hoặc HỦY đăng ký</i>
          </CCol>
          <CCol xs={12} className="text-center my-2">
            <CLink to={`/${Number(id)}/activity-logs`}>
              <CIcon name="cil-history" /> Activity Logs
            </CLink>
          </CCol>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default Register;
