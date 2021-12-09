import CIcon from '@coreui/icons-react';
import { CCol, CContainer, CLabel, CLink, CRow } from '@coreui/react';
import React from 'react';
import { IRealEstateDetails } from '../../shared/models/realEstateDetails.model';
import './index.scss';

export const RealEstateDetails = () => {
  const demoRealEstateDetails: IRealEstateDetails = {
    address: 'Ciputra Hanoi',
    type: 'Thuê Biệt Thự/Nhà Ciputra Hanoi',
    area: '400',
    floorDirect: '03/ Đông Nam',
    quality: 'A',
    service: 'Văn phòng',
  };

  return (
    <CContainer className="px-0" fluid>
      <CRow className="p-0 m-0">
        <CCol xs={12}>
          <CLabel className="text-primary content-title mt-3">Details</CLabel>
        </CCol>
        <CCol xs={6}>
          <p className="detail-title-font my-2">Khu Vực</p>
          <p className="my-2 detail-value">{demoRealEstateDetails.address}</p>
        </CCol>
        <CCol xs={6}>
          <p className="detail-title-font my-2">Loại BDS</p>
          <p className="my-2 detail-value">{demoRealEstateDetails.type}</p>
        </CCol>
        <CCol xs={6}>
          <p className="detail-title-font my-2">Diện tích</p>
          <p className="my-2 detail-value">{demoRealEstateDetails.area}</p>
        </CCol>
        <CCol xs={6}>
          <p className="detail-title-font my-2">Tầng/hướng</p>
          <p className="my-2 detail-value">{demoRealEstateDetails.floorDirect}</p>
        </CCol>
        <CCol xs={6}>
          <p className="detail-title-font my-2">Chất lượng công trình</p>
          <p className="my-2 detail-value">{demoRealEstateDetails.quality}</p>
        </CCol>
        <CCol xs={6}>
          <p className="detail-title-font my-2">Dịch vụ khai thác</p>
          <p className="my-2 detail-value">{demoRealEstateDetails.service}</p>
        </CCol>
      </CRow>
      <CRow className="m-0 p-0">
        <CCol xs={12}>
          <CLabel className="text-primary content-title mt-3">Trading history</CLabel>
        </CCol>
        <CCol>
          <p className="detail-title-font my-2">Price</p>
          <p className="my-2 detail-value">10.000</p>
        </CCol>
        <CCol>
          <p className="detail-title-font my-2">From</p>
          <p className="my-2 detail-value">1x366...366999</p>
        </CCol>
        <CCol>
          <p className="detail-title-font my-2">Time</p>
          <p className="my-2 detail-value">30 minutes ago</p>
        </CCol>
      </CRow>
      <CRow className="m-0 p-0">
      <CCol xs={12} className="text-center mt-3">
            <CLink to="/cms/activity_logs">
              <CIcon name="cil-history" /> <u>Activity Logs</u>
            </CLink>
          </CCol>
      </CRow>
    </CContainer>
  );
};
