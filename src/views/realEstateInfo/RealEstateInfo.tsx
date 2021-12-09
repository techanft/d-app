import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CCollapse,
  CContainer,
  CDataTable,
  CForm,
  CFormGroup,
  CInput,
  CInvalidFeedback,
  CLabel,
  CLink,
  CRow,
} from '@coreui/react';
import {
  faArrowAltCircleDown,
  faArrowAltCircleUp,
  faClipboard,
  faDonate,
  faEdit,
  faIdBadge,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Formik } from 'formik';
import React, { useState } from 'react';
import * as Yup from 'yup';
import realEstateImg from '../../assets/img/realEstateDetail.svg';
import { ExploitedStatus } from '../../enumeration/exploitedStatus';
import { Roles } from '../../enumeration/roles';
import ConfirmModal from '../../shared/components/ConfirmModal';
import { calculateOwnerTime } from '../../shared/helper';
import { IExploitedPermission } from '../../shared/models/exploitedPermission.model';
import { IRealEstateInfo } from '../../shared/models/realEstateInfo.model';
import './index.scss';
import RegisterOwnershipModal from './RegisterOwnershipModal';

export const RealEstateInfo = () => {
  const [rechargeToken, setRechargeToken] = useState<boolean>(false);
  const [withdrawToken, setWithDrawToken] = useState<boolean>(false);
  const [registerOwnership, setRegisterOwnership] = useState<boolean>(false);

  const setRechargeTokenListener = (key: boolean) => (): void => setRechargeToken(key);
  const setWithdrawTokenListener = (key: boolean) => (): void => setWithDrawToken(key);
  const setRegisterOwnershipListener = (key: boolean) => (): void => setRegisterOwnership(key);

  const demoRealEstateInfo: IRealEstateInfo = {
    value: '15.000',
    rewardRate: '0.5%',
    currentOwner: 'DD/MM/YYYY',
    rewardPool: '0.5',
    totalToken: '120',
    rewardPoolOfList: '12.000',
    ownerWalletId: '0xda3ac...9999',
    ownTimeLeft: '01',
    tokenRecharged: '5.000',
  };

  const [actsInvestment, setActsInvestment] = useState(false);
  const [actsOwnerMngmnt, setActsOwnerMngmnt] = useState(false);
  const [exploiterListing, setExploiterListing] = useState(false);

  const initialValues = {
    totalToken: '10000',
    totalTokenRecharged: '5000',
    maxTokenWithdraw: '1000',
    tokenWithdraw: 0,
    tokenRecharge: 0,
    exploitedFee: 5000,
    registrationToken: 0,
  };

  const validationSchema = Yup.object().shape({
    tokenWithdraw: Yup.number().required('Vui lòng nhập số token muốn rút'),
    tokenRecharge: Yup.number().required('Vui lòng nhập số token muốn nạp'),
    registrationToken: Yup.number().required('Vui lòng nhập số token muốn đăng ký'),
  });

  const titleTableStyle = {
    textAlign: 'left',
    color: '#828282',
    fontSize: '0.875rem',
    lineHeight: '16px',
    fontWeight: '400',
  };

  const exploitedFields = [
    {
      key: 'address',
      _style: titleTableStyle,
      label: 'Address Wallet',
    },
    {
      key: 'createdDate',
      _style: titleTableStyle,
      label: 'Thời gian bắt đầu',
    },
  ];

  const exploitedListing: IExploitedPermission[] = [
    {
      address: 'h1-0xda3ac...9999',
      createdDate: 'h1-17:10- 29/11/2021',
      status: ExploitedStatus.Active,
    },
    {
      address: 'h2-0xda3ac...9999',
      createdDate: 'h2-17:10- 29/11/2021',
      status: ExploitedStatus.Active,
    },
    {
      address: '0xda3ac...9999',
      createdDate: '17:10- 29/11/2021',
      status: ExploitedStatus.Inactive,
    },
  ];

  const exploitedActiveListing = exploitedListing.filter((e) => e.status === ExploitedStatus.Active);

  const onCloseModal = () => {
    setRechargeToken(false);
    setWithDrawToken(false);
    setRegisterOwnership(false);
  }

  return (
    <CContainer fluid className="px-0">
      <CCol xs={12} height="289px" className="p-0">
        <img src={realEstateImg} className="w-100 h-100" alt="realEstateImg" />
      </CCol>
      <CCol className="realestate-info m-0 p-0">
        <CRow className="realestate-title-info m-0 p-0">
          <CCol xs={12} className="text-dark btn-font-style mt-3">
            202 Yên Sở - Hoàng Mai - Hà Nội
          </CCol>
          <CCol xs={6} className="text-primary total-token my-3">
            <p className="m-0">
              {demoRealEstateInfo.value} <span className="token-name">ANFT</span>
            </p>
          </CCol>
          <CCol xs={6} className="owner-check d-flex align-items-end justify-content-between my-3">
            <p className="detail-title-font mr-3 m-0">Quyền sở hữu</p>
            <p className="ownership-checked m-0">Đã sở hữu</p>
          </CCol>
        </CRow>
        <CRow className="realestate-reward-info p-0 m-0">
          <CCol xs={6}>
            <p className="detail-title-font my-2">Reward rate for listing</p>
            <p className="text-success my-2 reward-number">{demoRealEstateInfo.rewardRate}</p>
          </CCol>
          <CCol xs={6}>
            <p className="detail-title-font my-2">The current owner</p>
            <p className="my-2 reward-number">{demoRealEstateInfo.currentOwner}</p>
          </CCol>
          <CCol xs={6}>
            <p className="detail-title-font my-2">Reward pool of listing</p>
            <p className="my-2 reward-number">
              {demoRealEstateInfo.rewardPool} <span className="token-name">USD/ANFT</span>
            </p>
          </CCol>
          <CCol xs={6}>
            <p className="detail-title-font my-2">Total ANFT</p>
            <p className="text-primary my-2 reward-number">
              {demoRealEstateInfo.totalToken} <span className="token-name">ANFT</span>
            </p>
          </CCol>
          <CCol xs={6}>
            <p className="detail-title-font my-2">Reward rate for listing</p>
            <p className="my-2 reward-number">
              {demoRealEstateInfo.rewardPoolOfList} <span className="token-name">ANFT</span>
            </p>
          </CCol>
          <CCol xs={6}>
            <p className="detail-title-font my-2">Owner wallet</p>
            <p className="text-primary my-2 reward-number">{demoRealEstateInfo.ownerWalletId}</p>
          </CCol>
          {/* Show-more-2-info-if-role-owner */}
          <CCol xs={6}>
            <p className="detail-title-font my-2">Tổng ANFT đã nạp</p>
            <p className="text-primary my-2 reward-number">
              {demoRealEstateInfo.tokenRecharged} <span className="token-name">ANFT</span>
            </p>
          </CCol>
          <CCol xs={6}>
            <p className="detail-title-font my-2">Thời gian còn lại </p>
            <p className="text-danger my-2 reward-number">
              {demoRealEstateInfo.ownTimeLeft} <span className="token-name">Ngày</span>
            </p>
          </CCol>
          <CCol xs={12} className="text-center">
            <p className="text-primary my-2">
              <CLink to="#" onClick={() => setExploiterListing(!exploiterListing)}>
                <FontAwesomeIcon icon={faIdBadge} /> <u>Xem quyền khai thác</u>
              </CLink>
            </p>
          </CCol>
          <CCol xs={12}>
            <CCollapse show={exploiterListing}>
              <CRow>
                {/* <CCol xs={6}>
                  <p className="detail-title-font my-2">Address Wallet</p>
                </CCol>
                <CCol xs={6}>
                  <p className="detail-title-font my-2">Thời gian bắt đầu</p>
                </CCol>
                
                {exploitedActiveListing.map((e) => (
                  <>
                  <CCol xs={6}>
                    <p className="my-2 detail-value">{e.address}</p>
                  </CCol>
                  <CCol xs={6}>
                    <p className="my-2 detail-value">{e.createdDate}</p>
                  </CCol>
                  </>
                ))} */}
                <CCol xs={12}>
                  <CDataTable
                    striped
                    items={exploitedActiveListing}
                    fields={exploitedFields}
                    responsive
                    hover
                    header
                    scopedSlots={{
                      address: ({ address }: IExploitedPermission) => {
                        return <td>{address ? address : '_'}</td>;
                      },
                      createdDate: ({ createdDate }: IExploitedPermission) => {
                        return <td>{createdDate ? createdDate : '_'}</td>;
                      },
                    }}
                  />
                </CCol>
              </CRow>
            </CCollapse>
          </CCol>

          <CCol xs={12} className="mt-2 ">
            <CButton
              className="px-3 w-100 btn-radius-50 btn-font-style btn btn-outline-primary"
              onClick={() => setActsInvestment(!actsInvestment)}
            >
              Hoạt động đầu tư
            </CButton>
          </CCol>
          <CCol xs={12}>
            <CCollapse show={actsInvestment}>
              <CCard className="activities-card mt-2 mb-0">
                <CCardBody className="p-2">
                  <CRow className="mx-0">
                    <CLink href="#" target="_blank" onClick={setRegisterOwnershipListener(true)}>
                      <FontAwesomeIcon icon={faEdit} /> Đăng ký sở hữu
                    </CLink>
                  </CRow>
                  <CRow className="mt-2 mx-0">
                    <CLink to="/cms/register_reward">
                      <FontAwesomeIcon icon={faDonate} /> Đăng ký nhận thưởng
                    </CLink>
                  </CRow>
                </CCardBody>
              </CCard>
            </CCollapse>
          </CCol>
          <CCol xs={12} className="mt-2">
            <CButton
              className="px-3 w-100 btn-radius-50 btn-font-style btn btn-primary"
              onClick={() => setActsOwnerMngmnt(!actsOwnerMngmnt)}
              disabled={!Roles.OWNER ? true : false}
            >
              Quản lý sở hữu
            </CButton>
          </CCol>
          <RegisterOwnershipModal visible={registerOwnership} setVisible={setRegisterOwnership} />

          <CCol xs={12}>
            <CCollapse show={actsOwnerMngmnt}>
              <CCard className="mt-2 activities-card mb-0">
                <CCardBody className="p-2">
                  <CRow className="mx-0">
                    <CLink href="#" target="_blank" onClick={setWithdrawTokenListener(true)}>
                      <FontAwesomeIcon icon={faArrowAltCircleUp} /> Rút ANFT
                    </CLink>
                  </CRow>
                  <CRow className="my-2 mx-0">
                    <CLink href="#" target="_blank" onClick={setRechargeTokenListener(true)}>
                      <FontAwesomeIcon icon={faArrowAltCircleDown} /> Nạp thêm
                    </CLink>
                  </CRow>
                  <CRow className="mx-0">
                    <CLink to="/cms/exploited_management">
                      <FontAwesomeIcon icon={faClipboard} /> Quản lý quyền khai thác
                    </CLink>
                  </CRow>
                </CCardBody>
              </CCard>
            </CCollapse>
          </CCol>
          {/* <WithdrawTokenModal visible={withdrawToken} setVisible={setWithDrawToken} />
          <RechargeTokenModal visible={rechargeToken} setVisible={setRechargeToken} /> */}
          <ConfirmModal
            isVisible={registerOwnership}
            setVisible={setRegisterOwnership}
            color="primary"
            title="Đăng ký sở hữu"
            CustomJSX={() => (
              <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values) => {}}
              >
                {({ values, errors, touched, handleChange, handleSubmit, handleBlur }) => (
                  <CForm onSubmit={handleSubmit}>
                    <CRow>
                      <CCol xs={12}>
                        <CFormGroup row>
                          <CCol xs={8}>
                            <CLabel className="recharge-token-title">Chi phí khai thác/ngày</CLabel>
                          </CCol>
                          <CCol xs={4}>
                            <p className="text-primary text-right">{values.exploitedFee}</p>
                          </CCol>
                        </CFormGroup>
                        <CFormGroup row>
                          <CCol xs={12}>
                            <CLabel className="recharge-token-title">Số ANFT muốn nạp</CLabel>
                          </CCol>
                          <CCol>
                            <CInput
                              onChange={handleChange}
                              id="registrationToken"
                              autoComplete="off"
                              name="registrationToken"
                              value={values.registrationToken || ''}
                              invalid={!!errors.registrationToken && touched.registrationToken}
                              onBlur={handleBlur}
                              className="btn-radius-50"
                              type="number"
                            />
                            <CInvalidFeedback
                              className={!!errors.registrationToken && touched.registrationToken ? 'd-block' : 'd-none'}
                            >
                              {errors.registrationToken}
                            </CInvalidFeedback>
                          </CCol>
                        </CFormGroup>
                        <CFormGroup row>
                          <CCol xs={8}>
                            <CLabel className="recharge-token-title">Ownership Period</CLabel>
                          </CCol>
                          <CCol xs={4}>
                            <p className="text-primary text-right">
                              {calculateOwnerTime(values.registrationToken, values.exploitedFee)} days
                            </p>
                          </CCol>
                        </CFormGroup>
                      </CCol>
                    </CRow>
                  </CForm>
                )}
              </Formik>
            )}
            onConfirm={() => {}}
            onAbort={onCloseModal}
          />
          <ConfirmModal
            isVisible={withdrawToken}
            setVisible={setWithDrawToken}
            color="primary"
            title="Rút ANFT"
            CustomJSX={() => (
              <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values) => {}}
              >
                {({ values, errors, touched, handleChange, handleSubmit, handleBlur }) => (
                  <CForm onSubmit={handleSubmit}>
                    <CRow>
                      <CCol xs={12}>
                        <CFormGroup row>
                          <CCol xs={8}>
                            <CLabel className="withdraw-token-title">Số ANFT bạn đã nạp</CLabel>
                          </CCol>
                          <CCol xs={4}>
                            <p className="text-primary text-right">{values.totalTokenRecharged}</p>
                          </CCol>
                        </CFormGroup>
                        <CFormGroup row>
                          <CCol xs={8}>
                            <CLabel className="withdraw-token-title">Số ANFT Tối đa bạn rút</CLabel>
                          </CCol>
                          <CCol xs={4}>
                            <p className="text-primary text-right">{values.maxTokenWithdraw}</p>
                          </CCol>
                        </CFormGroup>
                        <CFormGroup row>
                          <CCol xs={12}>
                            <CLabel className="withdraw-token-title">Số ANFT muốn rút</CLabel>
                          </CCol>
                          <CCol>
                            <CInput
                              onChange={handleChange}
                              id="tokenWithdraw"
                              autoComplete="off"
                              name="tokenWithdraw"
                              value={values.tokenWithdraw || ''}
                              invalid={!!errors.tokenWithdraw && touched.tokenWithdraw}
                              onBlur={handleBlur}
                              className="btn-radius-50"
                              type="number"
                            />
                            <CInvalidFeedback
                              className={!!errors.tokenWithdraw && touched.tokenWithdraw ? 'd-block' : 'd-none'}
                            >
                              {errors.tokenWithdraw}
                            </CInvalidFeedback>
                          </CCol>
                        </CFormGroup>
                      </CCol>
                    </CRow>
                  </CForm>
                )}
              </Formik>
            )}
            onConfirm={() => {}}
            onAbort={onCloseModal}
          />
          <ConfirmModal
            isVisible={rechargeToken}
            setVisible={setRechargeToken}
            color="primary"
            title="Nạp ANFT"
            CustomJSX={() => (
              <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values) => {}}
              >
                {({ values, errors, touched, handleChange, handleSubmit, handleBlur }) => (
                  <CForm onSubmit={handleSubmit}>
                    <CRow>
                      <CCol xs={12}>
                        <CFormGroup row>
                          <CCol xs={8}>
                            <CLabel className="recharge-token-title">Số ANFT bạn đã nạp</CLabel>
                          </CCol>
                          <CCol xs={4}>
                            <p className="text-primary text-right">{values.totalTokenRecharged}</p>
                          </CCol>
                        </CFormGroup>
                        <CFormGroup row>
                          <CCol xs={12}>
                            <CLabel className="recharge-token-title">Số ANFT muốn nạp</CLabel>
                          </CCol>
                          <CCol>
                            <CInput
                              onChange={handleChange}
                              id="tokenRecharge"
                              autoComplete="off"
                              name="tokenRecharge"
                              value={values.tokenRecharge || ''}
                              invalid={!!errors.tokenRecharge && touched.tokenRecharge}
                              onBlur={handleBlur}
                              className="btn-radius-50"
                              type="number"
                            />
                            <CInvalidFeedback
                              className={!!errors.tokenRecharge && touched.tokenRecharge ? 'd-block' : 'd-none'}
                            >
                              {errors.tokenRecharge}
                            </CInvalidFeedback>
                          </CCol>
                        </CFormGroup>
                        <CFormGroup row>
                          <CCol xs={8}>
                            <CLabel className="recharge-token-title">Ownership Period</CLabel>
                          </CCol>
                          <CCol xs={4}>
                            <p className="text-primary text-right">
                              {calculateOwnerTime(values.tokenRecharge, values.exploitedFee)} days
                            </p>
                          </CCol>
                        </CFormGroup>
                      </CCol>
                    </CRow>
                  </CForm>
                )}
              </Formik>
            )}
            onConfirm={() => {}}
            onAbort={onCloseModal}
          />
        </CRow>
      </CCol>
    </CContainer>
  );
};
