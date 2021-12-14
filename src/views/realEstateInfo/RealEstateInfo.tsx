import { CButton, CCard, CCardBody, CCol, CCollapse, CContainer, CDataTable, CLink, CRow } from '@coreui/react';
import {
  faArrowAltCircleDown,
  faArrowAltCircleUp,
  faClipboard,
  faDonate,
  faEdit,
  faIdBadge,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import realEstateImg from '../../assets/img/realEstateDetail.svg';
import { Roles } from '../../enumeration/roles';
import { WorkerStatus } from '../../enumeration/workerStatus';
import { IRealEstateInfo } from '../../shared/models/realEstateInfo.model';
import { IWorkerPermission } from '../../shared/models/workerPermission.model';
import ExtendOwnershipModal from './ExtendOwnershipModal';
import './index.scss';
import RegisterOwnershipModal from './RegisterOwnershipModal';
import WithdrawTokenModal from './WithdrawTokenModal';

export const RealEstateInfo = () => {
  const [extendOwnership, setExtendOwnership] = useState<boolean>(false);
  const [withdrawToken, setWithDrawToken] = useState<boolean>(false);
  const [registerOwnership, setRegisterOwnership] = useState<boolean>(false);

  const setRequestListener = (key: boolean, setRequestState: any) => (): void => setRequestState(key);

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

  const [investmentCollapse, setInvestmentCollapse] = useState(false); 
  const [managementCollapse, setManagementCollapse] = useState(false); 
  const [workerCollapse, setWorkerCollapse] = useState(false); 

  const titleTableStyle = {
    textAlign: 'left',
    color: '#828282',
    fontSize: '0.875rem',
    lineHeight: '16px',
    fontWeight: '400',
  };

  const workerFields = [
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

  const workerListing: IWorkerPermission[] = [
    {
      address: 'h1-0xda3ac...9999',
      createdDate: 'h1-17:10- 29/11/2021',
      status: WorkerStatus.true,
    },
    {
      address: 'h2-0xda3ac...9999',
      createdDate: 'h2-17:10- 29/11/2021',
      status: WorkerStatus.true,
    },
    {
      address: '0xda3ac...9999',
      createdDate: '17:10- 29/11/2021',
      status: WorkerStatus.false,
    },
  ];

  const workerActiveListing = workerListing.filter((e) => e.status === WorkerStatus.true);

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
              <CLink to="#" onClick={() => setWorkerCollapse(!workerCollapse)}>
                <FontAwesomeIcon icon={faIdBadge} /> <u>Xem quyền khai thác</u>
              </CLink>
            </p>
          </CCol>
          <CCol xs={12}>
            <CCollapse show={workerCollapse}>
              <CRow>
                <CCol xs={12}>
                  <CDataTable
                    striped
                    items={workerActiveListing}
                    fields={workerFields}
                    responsive
                    hover
                    header
                    scopedSlots={{
                      address: ({ address }: IWorkerPermission) => {
                        return <td>{address ? address : '_'}</td>;
                      },
                      createdDate: ({ createdDate }: IWorkerPermission) => {
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
              onClick={() => setInvestmentCollapse(!investmentCollapse)}
            >
              Hoạt động đầu tư
            </CButton>
          </CCol>
          <CCol xs={12}>
            <CCollapse show={investmentCollapse}>
              <CCard className="activities-card mt-2 mb-0">
                <CCardBody className="p-2">
                  <CRow className="mx-0">
                    <CLink href="#" target="_blank" onClick={setRequestListener(true, setRegisterOwnership)}>
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
              onClick={() => setManagementCollapse(!managementCollapse)}
              disabled={!Roles.OWNER ? true : false}
            >
              Quản lý sở hữu
            </CButton>
          </CCol>
          <RegisterOwnershipModal visible={registerOwnership} setVisible={setRegisterOwnership} />

          <CCol xs={12}>
            <CCollapse show={managementCollapse}>
              <CCard className="mt-2 activities-card mb-0">
                <CCardBody className="p-2">
                  <CRow className="mx-0">
                    <CLink href="#" target="_blank" onClick={setRequestListener(true, setWithDrawToken)}>
                      <FontAwesomeIcon icon={faArrowAltCircleUp} /> Rút ANFT
                    </CLink>
                  </CRow>
                  <CRow className="my-2 mx-0">
                    <CLink href="#" target="_blank" onClick={setRequestListener(true, setExtendOwnership)}>
                      <FontAwesomeIcon icon={faArrowAltCircleDown} /> Nạp thêm
                    </CLink>
                  </CRow>
                  <CRow className="mx-0">
                    <CLink to="/cms/worker_management">
                      <FontAwesomeIcon icon={faClipboard} /> Quản lý quyền khai thác
                    </CLink>
                  </CRow>
                </CCardBody>
              </CCard>
            </CCollapse>
          </CCol>
          <RegisterOwnershipModal visible={registerOwnership} setVisible={setRegisterOwnership} />
          <ExtendOwnershipModal visible={extendOwnership} setVisible={setExtendOwnership} />
          <WithdrawTokenModal visible={withdrawToken} setVisible={setWithDrawToken} />
        </CRow>
      </CCol>
    </CContainer>
  );
};
