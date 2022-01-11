import { CCol, CContainer, CLabel, CRow } from '@coreui/react';
import React from 'react';
import { IListingDetails } from '../../../shared/models/listingDetails.model';
import '../index.scss';

const ListingDetails = () => {

  const demoListingDetails: IListingDetails = {
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
          <p className="my-2 detail-value">{demoListingDetails.address}</p>
        </CCol>
        <CCol xs={6}>
          <p className="detail-title-font my-2">Loại BDS</p>
          <p className="my-2 detail-value">{demoListingDetails.type}</p>
        </CCol>
        <CCol xs={6}>
          <p className="detail-title-font my-2">Diện tích</p>
          <p className="my-2 detail-value">{demoListingDetails.area}</p>
        </CCol>
        <CCol xs={6}>
          <p className="detail-title-font my-2">Tầng/hướng</p>
          <p className="my-2 detail-value">{demoListingDetails.floorDirect}</p>
        </CCol>
        <CCol xs={6}>
          <p className="detail-title-font my-2">Chất lượng công trình</p>
          <p className="my-2 detail-value">{demoListingDetails.quality}</p>
        </CCol>
        <CCol xs={6}>
          <p className="detail-title-font my-2">Dịch vụ khai thác</p>
          <p className="my-2 detail-value">{demoListingDetails.service}</p>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default ListingDetails;
