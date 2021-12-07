import { CButton, CCard, CCardBody, CCol, CCollapse, CContainer, CLink, CRow } from '@coreui/react';
import { faArrowAltCircleDown, faArrowAltCircleUp, faClipboard, faDonate, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import realEstateImg from '../../assets/img/realEstateDetail.svg';
import { Roles } from '../../enumeration/roles';
import { IRealEstateInfo } from '../../shared/models/realEstateInfo.model';
import './index.scss';
import RechargeTokenModal from './RechargeTokenModal';
import WithdrawTokenModal from './WithdrawTokenModal';

export const RealEstateInfo = () => {
  const [rechargeToken, setRechargeToken] = useState<boolean>(false);
  const [withdrawToken, setWithDrawToken] = useState<boolean>(false);

  const setRechargeTokenListener = (key: boolean) => (): void => setRechargeToken(key);
  const setWithdrawTokenListener = (key: boolean) => (): void => setWithDrawToken(key);

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

  return (
    <CContainer fluid className="px-0">
      <CCol xs={12} height="289px" className="p-0">
        <img src={realEstateImg} className="w-100 h-100" alt="realEstateImg" />
      </CCol>
      <CCol className="realestate-info m-0 p-0">
        <CRow className="realestate-title-info m-0 p-0">
          <CCol xs={12} className="text-dark realestate-title mt-3">
            202 Yên Sở - Hoàng Mai - Hà Nội
          </CCol>
          <CCol xs={6} className="text-primary total-token my-3">
            <p className="m-0">
              {demoRealEstateInfo.value} <span className="token-name">ANFT</span>
            </p>
          </CCol>
          <CCol xs={6} className="owner-check d-flex align-items-end justify-content-between my-3">
            <p className="ownership mr-3 m-0">Quyền sở hữu</p>
            <p className="ownership-checked m-0">Đã sở hữu</p>
          </CCol>
        </CRow>
        <CRow className="realestate-reward-info p-0 m-0">
          <CCol xs={6}>
            <p className="realestate-reward-title my-2">Reward rate for listing</p>
            <p className="text-success my-2 reward-number">{demoRealEstateInfo.rewardRate}</p>
          </CCol>
          <CCol xs={6}>
            <p className="realestate-reward-title my-2">The current owner</p>
            <p className="my-2 reward-number">{demoRealEstateInfo.currentOwner}</p>
          </CCol>
          <CCol xs={6}>
            <p className="realestate-reward-title my-2">Reward pool of listing</p>
            <p className="my-2 reward-number">
              {demoRealEstateInfo.rewardPool} <span className="token-name">USD/ANFT</span>
            </p>
          </CCol>
          <CCol xs={6}>
            <p className="realestate-reward-title my-2">Total ANFT</p>
            <p className="text-primary my-2 reward-number">
              {demoRealEstateInfo.totalToken} <span className="token-name">ANFT</span>
            </p>
          </CCol>
          <CCol xs={6}>
            <p className="realestate-reward-title my-2">Reward rate for listing</p>
            <p className="my-2 reward-number">
              {demoRealEstateInfo.rewardPoolOfList} <span className="token-name">ANFT</span>
            </p>
          </CCol>
          <CCol xs={6}>
            <p className="realestate-reward-title my-2">Owner wallet</p>
            <p className="text-primary my-2 reward-number">{demoRealEstateInfo.ownerWalletId}</p>
          </CCol>
          {/* Show-more-2-info-if-role-owner */}
          <CCol xs={6}>
            <p className="realestate-reward-title my-2">Tổng ANFT đã nạp</p>
            <p className="text-primary my-2 reward-number">
              {demoRealEstateInfo.tokenRecharged} <span className="token-name">ANFT</span>
            </p>
          </CCol>
          <CCol xs={6}>
            <p className="realestate-reward-title my-2">Thời gian còn lại </p>
            <p className="text-danger my-2 reward-number">
              {demoRealEstateInfo.ownTimeLeft} <span className="token-name">Ngày</span>
            </p>
          </CCol>
          <CCol xs={12} className="mt-2 ">
            <CButton
              className="px-3 w-100 btn-act-management btn btn-outline-primary"
              onClick={() => setActsInvestment(!actsInvestment)}
            >
              Hoạt động đầu tư
            </CButton>
          </CCol>
          <CCol xs={12}>
            <CCollapse show={actsInvestment}>
              <CCard className="activities-card mt-2 mb-0">
                <CCardBody className="py-2">
                  <CRow>
                    <CLink href="" target="_blank" disabled={Roles.OWNER ? true : false}>
                    <FontAwesomeIcon icon={faEdit} /> Đăng ký sở hữu
                    </CLink>
                  </CRow>
                  <CRow className="my-2">
                    <CLink href="" target="_blank">
                      <FontAwesomeIcon icon={faDonate} /> Đăng ký nhận thưởng
                    </CLink>
                  </CRow>
                </CCardBody>
              </CCard>
            </CCollapse>
          </CCol>
          <CCol xs={12} className="mt-2">
            <CButton
              className="px-3 w-100 btn-act-management btn btn-primary"
              onClick={() => setActsOwnerMngmnt(!actsOwnerMngmnt)}
              disabled={!Roles.OWNER ? true : false}
            >
              Quản lý sở hữu
            </CButton>
          </CCol>

          <CCol xs={12}>
            <CCollapse show={actsOwnerMngmnt}>
              <CCard className="mt-2 activities-card mb-0">
                <CCardBody className="py-2">
                  <CRow>
                    <CLink href="#" target="_blank" onClick={setWithdrawTokenListener(true)}>
                    <FontAwesomeIcon icon={faArrowAltCircleUp} /> Rút ANFT
                    </CLink>
                  </CRow>
                  <CRow className="my-2">
                    <CLink href="#" target="_blank" onClick={setRechargeTokenListener(true)}>
                    <FontAwesomeIcon icon={faArrowAltCircleDown} /> Nạp thêm
                    </CLink>
                  </CRow>
                  <CRow>
                    <CLink href="#" target="_blank">
                    <FontAwesomeIcon icon={faClipboard} /> Quản lý quyền khai thác
                    </CLink>
                  </CRow>
                </CCardBody>
              </CCard>
            </CCollapse>
          </CCol>
          <WithdrawTokenModal visible={withdrawToken} setVisible={setWithDrawToken} />
          <RechargeTokenModal visible={rechargeToken} setVisible={setRechargeToken} />
        </CRow>
      </CCol>
    </CContainer>
  );
};
