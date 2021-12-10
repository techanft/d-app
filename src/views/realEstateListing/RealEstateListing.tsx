import CIcon from '@coreui/icons-react';
import { CCol, CLink, CRow } from '@coreui/react';
import React from 'react';
import realEstate1 from '../../assets/img/bds-01.svg';
import realEstate2 from '../../assets/img/bds-02.svg';
import realEstate3 from '../../assets/img/bds-03.svg';
import realEstate4 from '../../assets/img/bds-04.svg';
import realEstate5 from '../../assets/img/bds-05.svg';
import './index.scss';

export interface IRealEstateListing {
  infoImg: string;
  infoText: string | JSX.Element;
  infoToken: string;
  commissionRate: string;
}

export const RealEstateListing = () => {
  const demoRealEstateListing: IRealEstateListing[] = [
    {
      infoImg: realEstate1,
      infoText: '202 Yên Sở - Hoàng Mai - Hà Nội',
      infoToken: '10.000 ANFT',
      commissionRate: '0.5%',
    },
    {
      infoImg: realEstate2,
      infoText: '121- Bà Triệu - Hai Bà Trưng - Hà Nội',
      infoToken: '10.000 ANFT',
      commissionRate: '0.5%',
    },
    {
      infoImg: realEstate3,
      infoText: '121- Bà Triệu - Hai Bà Trưng - Hà Nội',
      infoToken: '10.000 ANFT',
      commissionRate: '0.5%',
    },
    {
      infoImg: realEstate4,
      infoText: '121- Bà Triệu - Hai Bà Trưng - Hà Nội',
      infoToken: '10.000 ANFT',
      commissionRate: '0.5%',
    },
    {
      infoImg: realEstate5,
      infoText: '121- Bà Triệu - Hai Bà Trưng - Hà Nội',
      infoToken: '10.000 ANFT',
      commissionRate: '0.5%',
    },
  ];

  return (
    <>
      <CRow className="mx-0">
        {demoRealEstateListing.map((item, index) => (
          <CCol xs={12} key={`listing-${index}`} className="px-0">
            <CLink to={`cms/${`listing-${index}`}/realestate_details_view`}>
              <div className="media info-box bg-white mx-3 my-2 p-2 align-items-center rounded shadow-sm">
                <img src={item.infoImg} alt="realEstateImg" height="98px" width="120px" className="rounded"/>
                <div className="media-body align-items-around ml-2">
                  <span className="info-box-text text-dark">{item.infoText}</span>
                  <p className={`info-box-token text-primary mt-2 mb-0`}>{item.infoToken}</p>
                  <p className={`info-box-commissionRate text-success mt-2 mb-0`}>
                    <CIcon name="cil-flower" /> {item.commissionRate}
                  </p>
                </div>
              </div>
            </CLink>
          </CCol>
        ))}
      </CRow>

      {/* {demoRealEstateListing.map((item, index) => (
      //   <div key={`listing-${index}`}>
      //     <div className="media info-box-container bg-white m-2 p-2 align-items-center rounded shadow-sm">
      //       <img src={item.infoImg} alt="realEstateImg" />
      //       <div className="media-body align-items-around ml-2">
      //         <div className="info-box">
      //           <div className="info-box-content">
      //             <span className="info-box-text text-dark">{item.infoText}</span>
      //             <p className={`info-box-token text-primary mt-2 mb-0`}>{item.infoToken}</p>
      //             <p className={`info-box-commissionRate text-success mt-2 mb-0`}>
      //               <Icon icon={flowerIcon} width="14px" height="14px"/> {item.commissionRate}
      //             </p>
      //           </div>
      //         </div>
      //       </div>
      //     </div>
      //   </div> */}
    </>
  );
};
