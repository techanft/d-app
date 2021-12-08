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
  CInput,
  CInputGroup,
  CInputGroupAppend,
  CInvalidFeedback,
  CLabel,
  CLink,
  CRow,
} from '@coreui/react';
import { Formik } from 'formik';
import React, { useState } from 'react';
import bgImg from '../../../assets/img/registerBonus.svg';
import { IRealEstateActivity } from '../../../shared/models/realEstateActivity.model';
import ClaimRewardModal from './ConfirmClaimRewardModal';
import './index.scss';
import UnregisterModal from './ConfirmUnregisterModal';

const RegisterReward = () => {
  const titleTableStyle = {
    textAlign: 'left',
    color: '#828282',
    fontSize: '0.75rem',
    lineHeight: '14px',
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

  const activitiesList: IRealEstateActivity[] = [
    {
      activityName: 'Lorem is pum 100000000000000000000000',
      bonusRate: '0.3%',
      registerLevel: '300',
      reward: '500',
      createdDate: '',
    },
    {
      activityName: 'Lorem is pum 2 ',
      bonusRate: '0.3%',
      registerLevel: '',
      reward: '',
      createdDate: '',
    },
    {
      activityName: 'Lorem is pum 3 ',
      bonusRate: '0.3%',
      registerLevel: '',
      reward: '',
      createdDate: '',
    },
    {
      activityName: 'Lorem is pum 4 ',
      bonusRate: '0.3%',
      registerLevel: '',
      reward: '',
      createdDate: '',
    },
    {
      activityName: 'Lorem is pum 5 ',
      bonusRate: '0.3%',
      registerLevel: '',
      reward: '',
      createdDate: '',
    },
    {
      activityName: 'Lorem is pum 6 ',
      bonusRate: '0.3%',
      registerLevel: '',
      reward: '',
      createdDate: '',
    },
  ];

  const [details, setDetails] = useState<string[]>([]);

  const toggleDetails = (reqId: string) => {
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

  return (
    <CContainer fluid className="mx-0 my-2">
      <CRow>
        <CCol xs={12}>
          <CLabel className="text-primary content-title">Chọn mức đăng ký</CLabel>
        </CCol>
        <CCol xs={12}>
          <CCard className="m-0 rb-card-img">
            <img src={bgImg} alt="realEstateImg" className="w-100 h-100" />
            <CCardBody className="p-0 rb-card-body">
              <CCardTitle className="rb-card-title mb-0 px-3 py-2 w-100">
                <p className="mb-2 text-white content-title">125 - Hoàn Kiếm - Hà Nội</p>
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
              activityName: (item: IRealEstateActivity) => {
                return (
                  <td
                    onClick={() => {
                      toggleDetails(item.activityName);
                    }}
                  >
                    <span className="text-primary d-inline-block text-truncate" style={{ maxWidth: '120px' }}>
                      {item.activityName ? item.activityName : '_'}
                    </span>
                  </td>
                );
              },
              bonusRate: (item: IRealEstateActivity) => {
                return <td>{item.bonusRate ? item.bonusRate : '_'}</td>;
              },
              registerLevel: (item: IRealEstateActivity) => {
                return <td>{item.registerLevel ? item.registerLevel : '_'}</td>;
              },
              reward: (item: IRealEstateActivity) => {
                return <td>{item.reward ? item.reward : '_'}</td>;
              },
              details: (item: IRealEstateActivity) => {
                return (
                  <Formik
                    enableReinitialize
                    initialValues={item}
                    // validationSchema={validationSchema}
                    onSubmit={(values) => {}}
                  >
                    {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
                      <CForm className="form-horizontal" onSubmit={handleSubmit}>
                        <CCollapse show={details.includes(item.activityName)}>
                          <CCard className="mb-0">
                            <CCardBody className="p-3">
                              <CRow className="align-items-center">
                                <CCol xs={6}>
                                  <p className="font-weight-bold my-2">Ngày đăng ký: </p>
                                </CCol>
                                <CCol xs={6}>
                                  <p className="my-2">{item.createdDate ? item.createdDate : '_'}</p>
                                </CCol>
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
                                        <CIcon name="cil-pencil" className="p-0 m-0" />
                                      </CButton>
                                    </CInputGroupAppend>
                                  </CInputGroup>
                                  <CInvalidFeedback
                                    className={!!errors.registerLevel && touched.registerLevel ? 'd-block' : 'd-none'}
                                  >
                                    {errors.registerLevel}
                                  </CInvalidFeedback>
                                </CCol>
                                <CCol xs={12} className="d-flex justify-content-center mt-3 mb-2">
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
                                  <ClaimRewardModal visible={claimReward} setVisible={setClaimReward} reward={values.reward} activityName={values.activityName}/>
                                  <UnregisterModal visible={unregister} setVisible={setUnregister} registerLevel={values.registerLevel} activityName={values.activityName}/>
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
            <CLink href="#" target="_blank">
              <CIcon name="cil-history" /> Activity Logs
            </CLink>
          </CCol>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default RegisterReward;
