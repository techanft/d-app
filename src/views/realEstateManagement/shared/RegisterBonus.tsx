import CIcon from '@coreui/icons-react';
import {
  CCard,
  CCardBody, CCardTitle,
  CCol,
  CContainer,
  CDataTable, CLabel,
  CLink,
  CRow
} from '@coreui/react';
import React, { useState } from 'react';
import bgImg from '../../../assets/img/registerBonus.svg';
import { IRealEstateActivity } from '../../../shared/models/realEstateActivity.model';

const RegisterBonus = () => {
  const registerView = [
    {
      key: 'activityName',
      _style: { textAlign: 'left', color: '#828282', fontSize: '0.75rem', lineHeight: '14px', fontWeight: '400' },
      label: 'Hoạt động',
    },
    {
      key: 'bonusRate',
      _style: { textAlign: 'left', color: '#828282', fontSize: '0.75rem', lineHeight: '14px', fontWeight: '400' },
      label: 'Tỉ lệ thưởng',
    },
    {
      key: 'registerLevel',
      _style: { textAlign: 'left', color: '#828282', fontSize: '0.75rem', lineHeight: '14px', fontWeight: '400' },
      label: 'Mức đăng ký',
    },
  ];

  const receiveRewardView = [
    {
      key: 'activityName',
      _style: { textAlign: 'left', color: '#828282', fontSize: '0.75rem', lineHeight: '14px', fontWeight: '400' },
      label: 'Hoạt động',
    },
    {
      key: 'bonusRate',
      _style: { textAlign: 'left', color: '#828282', fontSize: '0.75rem', lineHeight: '14px', fontWeight: '400' },
      label: 'Tỉ lệ thưởng',
    },
    {
      key: 'registerLevel',
      _style: { textAlign: 'left', color: '#828282', fontSize: '0.75rem', lineHeight: '14px', fontWeight: '400' },
      label: 'Mức đăng ký',
    },
    {
      key: 'reward',
      _style: { textAlign: 'left', color: '#828282', fontSize: '0.75rem', lineHeight: '14px', fontWeight: '400' },
      label: 'Est.reward',
    },
  ];

  const activitiesList: IRealEstateActivity[] = [
    {
      activityName: 'Lorem is pum 1 ',
      bonusRate: '0.3%',
      registerLevel: '',
      reward: '',
      registrationDate: '',
    },
    {
      activityName: 'Lorem is pum 2 ',
      bonusRate: '0.3%',
      registerLevel: '',
      reward: '',
      registrationDate: '',
    },
    {
      activityName: 'Lorem is pum 3 ',
      bonusRate: '0.3%',
      registerLevel: '',
      reward: '',
      registrationDate: '',
    },
    {
      activityName: 'Lorem is pum 4 ',
      bonusRate: '0.3%',
      registerLevel: '',
      reward: '',
      registrationDate: '',
    },
    {
      activityName: 'Lorem is pum 5 ',
      bonusRate: '0.3%',
      registerLevel: '',
      reward: '',
      registrationDate: '',
    },
    {
      activityName: 'Lorem is pum 6 ',
      bonusRate: '0.3%',
      registerLevel: '',
      reward: '',
      registrationDate: '',
    },
  ];

  const [registerBonusActs, setRegisterBonusActs] = useState<boolean>(false);

  return (
    <CContainer fluid className="mx-0 my-2">
      <CRow>
        <CCol xs={12}>
          <CLabel className="text-primary rb-title">Chọn mức đăng ký</CLabel>
        </CCol>
        <CCol xs={12}>
          <CCard className="m-0 rb-card-img">
            <img src={bgImg} alt="realEstateImg" className="w-100 h-100" />
            <CCardBody className="p-0 rb-card-body">
              <CCardTitle className="rb-card-title mb-0 px-3 py-2 w-100">
                <p className="mb-2 text-white real-estate-add">125 - Hoàn Kiếm - Hà Nội</p>
                <p className="mb-0 text-white real-estate-act">
                  Hoạt động <b>03</b>
                </p>
              </CCardTitle>
            </CCardBody>
          </CCard>
          {/* <CCardBody className="px-2"> */}
          <CDataTable
            striped
            items={activitiesList}
            fields={registerView}
            responsive
            hover
            header
            scopedSlots={{
              activityName: (item : IRealEstateActivity) => {
                return <td onClick={() => setRegisterBonusActs(!registerBonusActs)}>{item.activityName}</td>
              },
              registerLevel: () => {
                return <td>{'_'}</td>;
              },
            }}
          />
          <CCol xs={12} className="text-center">
            <CLink href="#" target="_blank">
              <CIcon name="cil-history" /> Trade History
            </CLink>
          </CCol>
          {/* </CCardBody> */}
          {/* </CCard> */}
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default RegisterBonus;
