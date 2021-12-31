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
  CLabel,
  CLink,
  CRow,
} from '@coreui/react';
import { faClipboardCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import ConfirmModal from '../../../shared/components/ConfirmModal';
import InfoLoader from '../../../shared/components/InfoLoader';
import { ToastError } from '../../../shared/components/Toast';
import useWindowDimensions from '../../../shared/hooks/useWindowDimensions';
import { IListingActivity } from '../../../shared/models/listingActivity.model';
import { RootState } from '../../../shared/reducers';
import { getEntity } from '../../assets/assets.api';
import { fetchingEntity, selectEntityById } from '../../assets/assets.reducer';
import '../index.scss';

interface IRegisterParams {
  [x: string]: string;
}

interface IRegisterProps extends RouteComponentProps<IRegisterParams> {}

const Register = (props: IRegisterProps) => {
  const { match } = props;
  const { id } = match.params;

  const dispatch = useDispatch();
  const { signerAddress, provider } = useSelector((state: RootState) => state.wallet);

  const { initialState } = useSelector((state: RootState) => state.assets);
  const { entityLoading } = initialState;
  const listing = useSelector(selectEntityById(Number(id)));

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
      key: 'bonusRate',
      _style: titleTableStyle,
      label: 'Tỉ lệ thưởng',
    },
    {
      key: 'registerLevel',
      _style: titleTableStyle,
      label: 'Mức đăng ký',
    },
  ];

  const activitiesList: IListingActivity[] = [
    {
      activityName: 'HỆ SINH THÁI BĐS SỐ 4.0',
      bonusRate: '0.2%',
      registerLevel: '300',
      reward: '',
      createdDate: '',
    },
    {
      activityName: 'QUẢN LÝ TÀI SẢN BĐS NFT',
      bonusRate: '0.1%',
      registerLevel: '',
      reward: '',
      createdDate: '',
    },
    {
      activityName: 'QUỸ ĐẦU TƯ BĐS "ETF"',
      bonusRate: '0.2%',
      registerLevel: '',
      reward: '',
      createdDate: '',
    },
    {
      activityName: 'SÀN GIAO DỊCH BĐS 4.0',
      bonusRate: '0.2%',
      registerLevel: '',
      reward: '',
      createdDate: '',
    },
    {
      activityName: 'ĐỐI TÁC VÀ CHUYÊN GIA',
      bonusRate: '0.1%',
      registerLevel: '',
      reward: '',
      createdDate: '',
    },
    {
      activityName: 'ĐÀO TẠO ĐẦU TƯ BĐS',
      bonusRate: '0.2%',
      registerLevel: '',
      reward: '',
      createdDate: '',
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
  };

  const [unregister, setUnregister] = useState<boolean>(false);
  const [claimReward, setClaimReward] = useState<boolean>(false);

  const setUnregisterListener = (key: boolean) => (): void => setUnregister(key);
  const setClaimRewardListener = (key: boolean) => (): void => setClaimReward(key);

  const onCloseModal = () => {
    setUnregister(false);
    setClaimReward(false);
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

  return (
    <CContainer fluid className="mx-0 my-2">
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
                  Hoạt động <b>{activitiesList.length}</b>
                </p>
              </CCardTitle>
            </CCardBody>
          </CCard>
          <CDataTable
            striped
            items={activitiesList}
            fields={registerView}
            responsive
            hover
            header
            scopedSlots={{
              activityName: (item: IListingActivity) => {
                return (
                  <td
                    onClick={() => {
                      toggleDetails(item.activityName);
                    }}
                  >
                    <span className="text-primary d-inline-block text-truncate" style={{ maxWidth: '100px' }}>
                      {item.activityName ? item.activityName : '_'}
                    </span>
                  </td>
                );
              },
              bonusRate: (item: IListingActivity) => {
                return <td>{item.bonusRate ? item.bonusRate : '_'}</td>;
              },
              registerLevel: (item: IListingActivity) => {
                return <td>{item.registerLevel ? item.registerLevel : '_'}</td>;
              },
              reward: (item: IListingActivity) => {
                return <td>{item.reward ? item.reward : '_'}</td>;
              },
              details: (item: IListingActivity) => {
                return (
                  <Formik enableReinitialize initialValues={item} onSubmit={(values) => {}}>
                    {({ values, handleChange, handleBlur, handleSubmit }) => (
                      <CForm className="form-horizontal" onSubmit={handleSubmit}>
                        <CCollapse show={details.includes(item.activityName)}>
                          <CCard className="mb-0">
                            <CCardBody className="px-3">
                              <CRow className="align-items-center">
                                <CCol xs={12}>
                                  <CFormGroup row>
                                    <CCol xs={6}>
                                      <p className="font-weight-bold my-2">Ngày đăng ký: </p>
                                    </CCol>
                                    <CCol xs={6}>
                                      <p className="my-2">{item.createdDate ? item.createdDate : '_'}</p>
                                    </CCol>
                                  </CFormGroup>

                                  <CFormGroup row>
                                    <CCol xs={6}>
                                      <p className="font-weight-bold my-2">Mức đăng ký: </p>
                                    </CCol>
                                    <CCol xs={6}>
                                      <CInputGroup>
                                        <CInput
                                          type="text"
                                          id="registerLevel"
                                          autoComplete="none"
                                          name="registerLevel"
                                          value={values.registerLevel}
                                          onChange={handleChange}
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
                                  </CFormGroup>

                                  <CFormGroup row>
                                    <CCol xs={12} className="d-flex justify-content-center mt-3">
                                      <CButton
                                        className="btn-radius-50 btn btn-sm btn-success mr-2"
                                        onClick={setClaimRewardListener(true)}
                                      >
                                        Claim Reward
                                      </CButton>
                                      <CButton
                                        className="btn-radius-50 btn btn-sm btn-outline-danger "
                                        variant="ghost"
                                        onClick={setUnregisterListener(true)}
                                      >
                                        Unregister
                                      </CButton>
                                      <ConfirmModal
                                        isVisible={claimReward}
                                        color="success"
                                        title="Nhận thưởng hoạt động"
                                        CustomJSX={() => (
                                          <p>
                                            Bạn chắc chắn muốn nhận thưởng{' '}
                                            <span className="text-primary">{values.reward} ANFT</span> của hoạt động{' '}
                                            <span className="text-primary">“{values.activityName}”</span>
                                          </p>
                                        )}
                                        onConfirm={() => {}}
                                        onAbort={onCloseModal}
                                      />
                                      <ConfirmModal
                                        isVisible={unregister}
                                        color="danger"
                                        title="Xác nhận hủy đăng ký"
                                        CustomJSX={() => (
                                          <p>
                                            Bạn chắc chắn muốn hủy{' '}
                                            <span className="text-primary">“{values.activityName}”</span> với đăng ký{' '}
                                            <span className="text-primary">{values.registerLevel} ANFT</span>
                                          </p>
                                        )}
                                        onConfirm={() => {}}
                                        onAbort={onCloseModal}
                                      />
                                    </CCol>
                                  </CFormGroup>
                                </CCol>
                              </CRow>
                            </CCardBody>
                          </CCard>
                        </CCollapse>
                      </CForm>
                    )}
                  </Formik>
                );
              },
            }}
          />
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
