import CIcon from '@coreui/icons-react';
import { CCol, CLink, CPagination, CRow } from '@coreui/react';
import { BigNumber, ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import DAppLoading from '../../shared/components/DAppLoading';
import { ToastError } from '../../shared/components/Toast';
import { insertCommas } from '../../shared/helper';
import { getListingContractRead, getProvider } from '../../shared/helpers';
import { IAsset } from '../../shared/models/assets.model';
import { RootState } from '../../shared/reducers';
import { useGetAssetsQuery } from '../assets/assets.api';
import './index.scss';

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
    size: 5,
    sort: 'createdDate,desc',
  });
  // Đổi tên biến data
  const { isLoading, data } = useGetAssetsQuery(filterState);
  const totalPages = Math.ceil(totalItems / filterState.size);

  const handlePaginationChange = (page: number) => {
    if (page !== 0) {
      window.scrollTo(0, 0);
      setFilterState({ ...filterState, page: page - 1 });
    }
  };

  // Ko check undefined ở đây
  const mapingAssets = async (assets: IAsset[]) => {
    // Type
    const formattedAssets = assets.map(({ id, images, address, tHash }) => ({
      id,
      infoImg: images,
      infoText: `${id} Yên Sở - Hoàng Mai - Hà Nội`,
      infoToken: BigNumber.from(0),
      commissionRate: '0',
      address,
      tHash
    }));
      setListings(formattedAssets);
      setListingLoading(false);

      // Sửa lại phần dưới này, dùng promise.all để gọi data rồi mapping lại, không await lần lượt

    // const blockchainPromises: any[] = [];
    //   for (let index = 0; index < assets.length; index++) {
    //     const asset = assets[index];
    //     const assetContract = getListingContractRead(asset.address, provider);
    //     const body: IRealEstateListing = {
    //       id: asset.id,
    //       infoImg: asset.images,
    //       infoText: `${asset.id} Yên Sở - Hoàng Mai - Hà Nội`,
    //       // infoToken: await assetContract.value(),
    //       // commissionRate: await assetContract.dailyPayment(),
    //       infoToken: BigNumber.from(0),
    //       commissionRate: "0",
    //       address: asset.address,
    //       tHash: asset.tHash,
    //     };
    //     blockchainPromises.push(body);
    //   }

    //   setListings(blockchainPromises);
    //   setListingLoading(false);
    //   // Promise.all(blockchainPromises)
    //   //   .then((result) => {

    //   //     console.log('result', result)
    //   //     setListings(result);
    //   //     setListingLoading(false);
    //   //   })
    //   //   .catch((err) => {
    //   //     console.log(err, 'err');
    //   //     ToastError("Cannot get listing information")
    //   //   });
  };

  useEffect(() => {
    if (assets?.length > 0 && data?.results) {
      setListingLoading(true);
      mapingAssets(data?.results);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <>
    {/* Hoài: Đổi tên component => Loading */}
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
              disabled={isLoading}
              activePage={filterState.page + 1}
              pages={totalPages}
              onActivePageChange={handlePaginationChange}
              align="center"
              className="mt-2"
            />
          )}
        </>
      )}
    </>
  );
};
