import CIcon from "@coreui/icons-react";
import { CCol, CLink, CPagination, CRow } from "@coreui/react";
import { BigNumber, ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DAppLoading from "../../shared/components/DAppLoading";
import { ToastError } from "../../shared/components/Toast";
import { insertCommas } from "../../shared/helper";
import { getListingContractRead, getProvider } from "../../shared/helpers";
import { IAsset } from "../../shared/models/assets.model";
import { RootState } from "../../shared/reducers";
import { useGetAssetsQuery } from "../assets/assets.api";
import "./index.scss";

export interface IRealEstateListing {
  id: string;
  infoImg: string;
  infoText: string | JSX.Element;
  infoToken: BigNumber;
  commissionRate: string;
  address: string;
  tHash: string;
}

export interface IParams {
  size: number;
  page: number;
  sort?: string;
}

export interface IAssetFilter extends IParams {}

export const RealEstateListing = () => {
  const { assets, totalItems } = useSelector((state: RootState) => state.assetsReducer);
  const provider = getProvider();
  const [listingLoading, setListingLoading] = useState<boolean>(false);
  const [listings, setListings] = useState<IRealEstateListing[]>([]);

  const [filterState, setFilterState] = useState<IAssetFilter>({
    page: 0,
    size: 10,
  });

  useGetAssetsQuery(filterState);

  const totalPages = Math.ceil(totalItems / filterState.size);
  console.log(totalPages)
  const handlePaginationChange = (page: number) => {
    if (page !== 0) {
      window.scrollTo(0, 0);
      setFilterState({ ...filterState, page: page - 1 });
    }
  };

  const mapingAssets = async (assets: IAsset[]) => {
    const blockchainPromises: any[] = [];
    for (let index = 0; index < assets.length; index++) {
      const addr = assets[index];
      const assetContract = getListingContractRead(addr.address, provider);
      const body: IRealEstateListing = {
        id: addr.id,
        infoImg: addr.images,
        infoText: `${addr.id} Yên Sở - Hoàng Mai - Hà Nội`,
        infoToken: await assetContract.value(),
        commissionRate: await assetContract.dailyPayment(),
        address: addr.address,
        tHash: addr.tHash,
      };
      blockchainPromises.push(body);
    }

    Promise.all(blockchainPromises)
      .then((result) => {
        setListings(result);
        setListingLoading(false);
      })
      .catch((err) => {
        console.log(err, "err");
        ToastError("Cannot get listing information")
      });
  };

  useEffect(() => {
    if (assets?.length > 0) {
      setListingLoading(true);
      mapingAssets(assets);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assets]);

  // const demoRealEstateListing: IRealEstateListing[] = [
  //   {
  //     infoImg: realEstate1,
  //     infoText: "202 Yên Sở - Hoàng Mai - Hà Nội",
  //     infoToken: "10.000 ANFT",
  //     commissionRate: "0.5%",
  //   },
  //   {
  //     infoImg: realEstate2,
  //     infoText: "121- Bà Triệu - Hai Bà Trưng - Hà Nội",
  //     infoToken: "10.000 ANFT",
  //     commissionRate: "0.5%",
  //   },
  //   {
  //     infoImg: realEstate3,
  //     infoText: "121- Bà Triệu - Hai Bà Trưng - Hà Nội",
  //     infoToken: "10.000 ANFT",
  //     commissionRate: "0.5%",
  //   },
  //   {
  //     infoImg: realEstate4,
  //     infoText: "121- Bà Triệu - Hai Bà Trưng - Hà Nội",
  //     infoToken: "10.000 ANFT",
  //     commissionRate: "0.5%",
  //   },
  //   {
  //     infoImg: realEstate5,
  //     infoText: "121- Bà Triệu - Hai Bà Trưng - Hà Nội",
  //     infoToken: "10.000 ANFT",
  //     commissionRate: "0.5%",
  //   },
  // ];

  // console.log(ethers.utils.parseUnits(listings[0].infoToken.toString()));

  return (
    <>
      {listingLoading ? (
        <DAppLoading />
      ) : (
        <>
          <CRow className="mx-0">
            {listings!.map((item, index) => (
              <CCol xs={12} key={`listing-${index}`} className="px-0">
                <CLink to={`cms/${item.id}/realestate_details_view`}>
                  <div className="media info-box bg-white mx-3 my-2 p-2 align-items-center rounded shadow-sm">
                    <img src={item.infoImg} alt="realEstateImg" className="rounded" />
                    <div className="media-body align-items-around ml-2">
                      <span className="info-box-text text-dark">{item?.infoText}</span>
                      <p className={`info-box-token text-primary mt-2 mb-0`}>
                        {insertCommas(ethers.utils.formatEther(item.infoToken.toString()))}
                      </p>
                      <p className={`info-box-commissionRate text-success mt-2 mb-0`}>
                        <CIcon name="cil-flower" />{' '}
                        {insertCommas(ethers.utils.formatEther(item.commissionRate.toString()))}
                      </p>
                    </div>
                  </div>
                </CLink>
              </CCol>
            ))}
          </CRow>
          {totalPages > 1 && (
            <CPagination
              // disabled={isLoading}
              activePage={filterState.page + 1}
              pages={totalPages}
              onActivePageChange={handlePaginationChange}
              align="center"
              className="mt-2"
            />
          )}
        </>
      )}

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
