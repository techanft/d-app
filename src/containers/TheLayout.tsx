import React from 'react';
import { TheContent, TheHeader } from '.';
import { RealEstateDetails } from '../views/realEstateDetails/RealEstateDetails';
import { RealEstateInfo } from '../views/realEstateInfo/RealEstateInfo';
import { RealEstateListing } from '../views/realEstateListing/RealEstateListing';
import ExploitedManagement from '../views/realEstateManagement/owner/ExploitedManagement';
import ActivityLogs from '../views/realEstateManagement/shared/ActivityLogs';
import RealEstateDetailsView from '../views/realEstateManagement/shared/RealEstateDetailsView';
import RegisterReward from '../views/realEstateManagement/shared/RegisterReward';

const TheLayout = () => {
  return (
    <>
      <div className="dapp-layout">
        <div className="c-wrapper">
          <TheHeader />
          <div className="c-body">
            <TheContent />
            {/* <RealEstateListing /> */}
            {/* <RealEstateInfo /> */}
            {/* <RealEstateDetails/> */}
            <RealEstateDetailsView />
            <RegisterReward />
            <ActivityLogs/>
            <ExploitedManagement/>
          </div>
        </div>
      </div>
    </>
  );
};

export default TheLayout;
