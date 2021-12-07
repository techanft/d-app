import React from 'react';
import { TheContent, TheHeader } from '.';
import { RealEstateDetails } from '../views/realEstateDetails/RealEstateDetails';
import { RealEstateInfo } from '../views/realEstateInfo/RealEstateInfo';
import { RealEstateListing } from '../views/realEstateListing/RealEstateListing';
import RealEstateDetailsView from '../views/realEstateManagement/shared/RealEstateDetailsView';
import RegisterBonus from '../views/realEstateManagement/shared/RegisterBonus';

const TheLayout = () => {
  return (
    <>
      <div className="dapp-layout">
        <div className="c-wrapper">
          <TheHeader />
          <div className="c-body">
            {/* <TheContent /> */}
            {/* <RealEstateListing /> */}
            {/* <RealEstateInfo /> */}
            {/* <RealEstateDetails/> */}
            {/* <RegisterBonus/> */}
            <RealEstateDetailsView/>
          </div>
        </div>
      </div>
    </>
  );
};

export default TheLayout;
