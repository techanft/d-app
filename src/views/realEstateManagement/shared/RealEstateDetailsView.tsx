import { CCol, CLabel, CRow } from '@coreui/react';
import React from 'react';
import { RealEstateDetails } from '../../realEstateDetails/RealEstateDetails';
import { RealEstateInfo } from '../../realEstateInfo/RealEstateInfo';
import { RealEstateListing } from '../../realEstateListing/RealEstateListing';

const RealEstateDetailsView = () => {
  return (
    <>
      <RealEstateInfo />
      <RealEstateDetails />
      <CRow className="mx-0">
        <CCol xs={12}>
          <CLabel className="text-primary detail-title mt-3">More listing</CLabel>
        </CCol>
        <CCol xs={12} className="px-0">
          <RealEstateListing />
        </CCol>
      </CRow>
    </>
  );
};

export default RealEstateDetailsView;
