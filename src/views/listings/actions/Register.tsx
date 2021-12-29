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
import { faClipboardCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import * as Yup from 'yup';
import { LISTING_INSTANCE } from '../../../shared/blockchain-helpers';
import {
  convertBnToDecimal,
  convertDecimalToBn,
  convertUnixToDate,
  formatBNToken,
  unInsertCommas,
} from '../../../shared/casual-helpers';
import ConfirmModal from '../../../shared/components/ConfirmModal';
import InfoLoader from '../../../shared/components/InfoLoader';
import SubmissionModal from '../../../shared/components/SubmissionModal';
import { ToastError } from '../../../shared/components/Toast';
import { EventType } from '../../../shared/enumeration/eventType';
import { ModalType, TModalsVisibility } from '../../../shared/enumeration/modalType';
import useWindowDimensions from '../../../shared/hooks/useWindowDimensions';
import { baseOptions, ICompleteOption } from '../../../shared/models/options.model';
import { RootState } from '../../../shared/reducers';
import { getEntity, getEntityOptions, getStakeholderListingStakes, IGetSHStakes } from '../../assets/assets.api';
import { fetchingEntity, selectEntityById } from '../../assets/assets.reducer';
import { baseSetterArgs } from '../../transactions/settersMapping';
import { IProceedTxBody, proceedTransaction } from '../../transactions/transactions.api';
import { fetching } from '../../transactions/transactions.reducer';
import '../index.scss';
import ClaimRewardModal from './ClaimRewardModal';

interface IRegisterParams {
  [x: string]: string;
}
interface IRegister {
  registerAmount: number;
}
const currentUnix = dayjs().unix();

interface IRegisterProps extends RouteComponentProps<IRegisterParams> {}

const Register = (props: IRegisterProps) => {
  const { match } = props;
  const { id } = match.params;

  const dispatch = useDispatch();
  const { signerAddress, signer } = useSelector((state: RootState) => state.wallet);

  const { initialState } = useSelector((state: RootState) => state.assets);
  // const { entityLoading, registerLogs } = initialState;
  const { entityLoading } = initialState;

  const listingId = Number(id);
  const listing = useSelector(selectEntityById(listingId));

  // const options = listing?.options;
  // const completeOptionValues: ICompleteOption[] = options
  //   ? options.map((e, i) => (e = { ...e, ...registerLogs[i] }))
  //   : [];

  const { width: screenWidth } = useWindowDimensions();

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

  const [details, setDetails] = useState<string[]>([]);

  const toggleDetails = (reqId: string) => {
    if (!signerAddress) return ToastError('Bạn chưa liên kết với ví của mình');
    const position = details.indexOf(reqId);
    let newDetails = details.slice();
    if (position !== -1) {
      newDetails.splice(position, 1);
    } else {
      newDetails = [reqId];
    }
    setDetails(newDetails);
    setChosenOptionId(undefined);
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

  const createGetSHStakesBody = () => {
    if (!listing?.address) {
      throw Error('Error getting listing address');
    }
    if (!signer) {
      throw Error('No Signer found');
    }
    if (!signerAddress) {
      throw Error('No Signer Address found');
    }
    const instance = LISTING_INSTANCE(listing.address, signer);
    if (!instance) {
      throw Error('Error in generating contract instace');
    }

    const output: IGetSHStakes = {
      listingContract: instance,
      stakeholder: signerAddress,
      storedListing: listing,
    };

    return output;
  };

  const handleRawFormValues = (input: IRegister, id: number): IProceedTxBody => {
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
    registerAmount: Yup.number().required('Vui lòng nhập mức đăng ký').typeError('Mức đăng ký không hợp lệ'),
  });

  const handleUnregisterValues = (optionId: number) => {
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
      type: EventType.UNREGISTER,
      args: { ...baseSetterArgs, _optionId: optionId },
    };

    return output;
  };

  const onUnregisterCnfrm = (id: number) => {
    dispatch(fetching());
    const body = handleUnregisterValues(id);
    dispatch(proceedTransaction(body));
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchingEntity());
      dispatch(getEntity(listingId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (listing) {
      dispatch(fetchingEntity());
      dispatch(getEntityOptions(listing));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(listing)]);

  useEffect(() => {
    if (listing?.id && signer && signerAddress) {
      const shStakesBody = createGetSHStakesBody();
      dispatch(getStakeholderListingStakes(shStakesBody));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(listing?.id), signer, signerAddress]);

  const initialValues: IRegister = {
    registerAmount: 0,
  };

  useEffect(() => {
    if (listing) {
      console.log(listing, 'listing');
    }
  }, [listing]);

  const createInitialValues = (item: ICompleteOption): IRegister => {
    if (!item?.amount) return initialValues;
    return { ...initialValues, registerAmount: Number(convertBnToDecimal(item.amount)) };
  };

  const [chosenOptionId, setChosenOptionId] = useState<number | undefined>(undefined);

  // const returnOptionAmount = listing ? listing.options.map(o => ({...o, ...listing.stakes.find(s => s.optionId === o.id) })) : []
  // const merge = (( () => {

  // }))
  // const a = listing?.options && listing.stakes ? (
  //   lis
  // ) : []
  // console.log(listing);

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
              // items={returnOptionAmount}
              items={[] as any}
              fields={registerView}
              responsive
              hover
              header
              scopedSlots={{
                activityName: (item: ICompleteOption) => {
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
                reward: (item: ICompleteOption) => {
                  return <td>{item.reward ? `${item.reward.toString()}%` : '_'}</td>;
                },
                registerAmount: (item: ICompleteOption) => {
                  return <td>{item.amount ? formatBNToken(item.amount, true) : '_'}</td>;
                },
                details: (item: ICompleteOption) => {
                  return (
                    <CCollapse show={details.includes(item.id.toString())}>
                      <CCard className="mb-0">
                        <CCardBody className="px-3">
                          <CRow className="align-items-center">
                            <CCol xs={12}>
                              <CFormGroup row>
                                <CCol xs={6}>
                                  <p className="font-weight-bold my-2">Ngày đăng ký: </p>
                                </CCol>
                                <CCol xs={6}>
                                  {item.start ? (
                                    <p className="my-2">
                                      {item.start.toNumber() ? convertUnixToDate(item.start.toNumber()) : '_'}
                                    </p>
                                  ) : (
                                    ''
                                  )}
                                </CCol>
                              </CFormGroup>
                              <Formik
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
                                            value={values.registerAmount || ''}
                                            onBlur={handleBlur}
                                            placeholder="Mức đăng ký..."
                                            className="register-level-input"
                                          />
                                          <CInputGroupAppend>
                                            <CButton type="submit" color="primary" className="btn-register-level">
                                              <FontAwesomeIcon icon={faClipboardCheck} />
                                            </CButton>
                                          </CInputGroupAppend>
                                        </CInputGroup>
                                      </CCol>
                                      <CCol xs={12}>
                                        <CInvalidFeedback
                                          className={
                                            !!errors.registerAmount && touched.registerAmount
                                              ? 'd-block text-center'
                                              : 'd-none'
                                          }
                                        >
                                          {errors.registerAmount}
                                        </CInvalidFeedback>
                                      </CCol>
                                    </CFormGroup>
                                  </CForm>
                                )}
                              </Formik>{' '}
                              <CFormGroup row>
                                <CCol xs={12} className="d-flex justify-content-center mt-3">
                                  <CButton
                                    className="btn-radius-50 btn btn-sm btn-success mr-2"
                                    onClick={() => (
                                      handleModalVisibility(ModalType.REWARD_CLAIM, true), setChosenOptionId(item.id)
                                    )}
                                  >
                                    Claim Reward
                                  </CButton>
                                  <CButton
                                    className="btn-radius-50 btn btn-sm btn-outline-danger "
                                    variant="ghost"
                                    onClick={() => (
                                      handleModalVisibility(ModalType.REWARD_UNREGISTER, true),
                                      setChosenOptionId(item.id)
                                    )}
                                  >
                                    Unregister
                                  </CButton>
                                </CCol>
                              </CFormGroup>
                            </CCol>
                          </CRow>
                        </CCardBody>
                      </CCard>
                      {/* <ClaimRewardModal
                        isVisible={modalsVisibility[ModalType.REWARD_CLAIM]}
                        setVisibility={(key: boolean) => handleModalVisibility(ModalType.REWARD_CLAIM, key)}
                        listingId={listingId}
                        optionId={item.id}
                      />
                      <ConfirmModal
                        isVisible={modalsVisibility[ModalType.REWARD_UNREGISTER]}
                        color="danger"
                        title="Xác nhận hủy đăng ký"
                        CustomJSX={() => (
                          <p>
                            Bạn chắc chắn muốn hủy <span className="text-primary">“{item.name}”</span> với đăng ký{' '}
                            <span className="text-primary">{formatBNToken(item._amount, true)}</span>
                          </p>
                        )}
                        onConfirm={() => onUnregisterCnfrm(item.id)}
                        onAbort={(key: boolean) => handleModalVisibility(ModalType.REWARD_UNREGISTER, key)}
                      /> */}
                    </CCollapse>
                  );
                },
              }}
            />
          ) : (
            ''
          )}

          <ClaimRewardModal
            isVisible={modalsVisibility[ModalType.REWARD_CLAIM]}
            setVisibility={(key: boolean) => handleModalVisibility(ModalType.REWARD_CLAIM, key)}
            listingId={listingId}
            optionId={chosenOptionId}
          />
          {/* <ConfirmModal
            isVisible={modalsVisibility[ModalType.REWARD_UNREGISTER]}
            color="danger"
            title="Xác nhận hủy đăng ký"
            CustomJSX={() => {
              if (chosenOptionId === undefined) {
                return <></>;
              } else
                return (
                  <p>
                    Bạn chắc chắn muốn hủy{' '}
                    <span className="text-primary">{options ? `“${options[chosenOptionId].name}”` : ''}</span> với đăng
                    ký{' '}
                    <span className="text-primary">
                      {formatBNToken(
                        completeOptionValues ? completeOptionValues[chosenOptionId]._amount : undefined,
                        true
                      )}
                    </span>
                  </p>
                );
            }}
            onConfirm={() => onUnregisterCnfrm(options ? options[chosenOptionId!].id : 0)}
            onAbort={(key: boolean) => handleModalVisibility(ModalType.REWARD_UNREGISTER, key)}
          /> */}
          <CCol xs={12} className="px-0">
            <i className="detail-title-font">*Lựa chọn Hoạt động bạn muốn SỬA hoặc HỦY đăng ký</i>
          </CCol>
          <CCol xs={12} className="text-center my-2">
            <CLink to="/activity-logs">
              <CIcon name="cil-history" /> Activity Logs
            </CLink>
          </CCol>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default Register;
