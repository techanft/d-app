import CIcon from '@coreui/icons-react';
import { CCol, CPagination, CRow } from '@coreui/react';
import { BigNumber } from 'ethers';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { formatBNToken } from '../../shared/casual-helpers';
import Loading from '../../shared/components/Loading';
import { IParams } from '../../shared/models/base.model';
import { RootState } from '../../shared/reducers';
import { getEntities } from '../assets/assets.api';
import { assetsSelectors, fetchingEntities } from '../assets/assets.reducer';
// import { useGetAssetsQuery } from '../assets/assets.api';
import './index.scss';
 
export interface IListingShortInfo {
  id: number;
  infoImg: string;
  infoText: string | JSX.Element;
  infoToken: BigNumber;
  commissionRate: string;
  address: string;
  tHash: string;
}

export interface IAssetFilter extends IParams {}

interface IListingsProps {
  routingProps: RouteComponentProps;
}

const Listings = ({routingProps}: IListingsProps) => {

  const {history} = routingProps
  
  // const {  totalItems } = useSelector((state: RootState) => state.assets);
  const dispatch = useDispatch();
  const { initialState } = useSelector((state: RootState) => state.assets);
  const { totalItems, entitiesLoading } = initialState;
  const assets = useSelector(assetsSelectors.selectAll);

  const [filterState, setFilterState] = useState<IAssetFilter>({
    page: 0,
    size: 5,
    sort: 'createdDate,desc',
  });

  // const { isLoading, data: dataAssets, refetch } = useGetAssetsQuery(filterState);
  const totalPages = Math.ceil(totalItems / filterState.size);

  const handlePaginationChange = (page: number) => {
    if (page !== 0) {
      window.scrollTo(0, 0);
      setFilterState({ ...filterState, page: page - 1 });
    }
  };

  // console.log(loading, 'loading many')

  useEffect(() => {
    dispatch(fetchingEntities());
    dispatch(getEntities(filterState));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filterState)]);


  const onRedirecting = (path: string) => {
    window.scrollTo(0, 0); 
    return () => {
      history.push(path);
    }
  }

  return (
    <>
      {entitiesLoading && !assets.length ? (
        <Loading />
      ) : (
        <>
          <CRow className="mx-0">
            {assets.map((item, index) => (
              <CCol xs={12} key={`listing-${index}`} className="px-0">
                  <div className="media info-box bg-white mx-3 my-2 p-2 align-items-center rounded shadow-sm" onClick={onRedirecting(`/listings/${item.id}/detail`)}>
                    <img src={item.images} alt="realEstateImg" className="rounded" />
                    <div className="media-body align-items-around ml-2">
                      <span className="info-box-text text-dark">{`${item.id} Yên Sở - Hoàng Mai - Hà Nội`}</span>
                      <p className={`info-box-token text-primary mt-2 mb-0`}>
                        Value: {formatBNToken(item.value, true)}
                      </p>
                      <p className={`info-box-commissionRate text-success mt-2 mb-0`}>
                        <CIcon name="cil-flower" />{' '}
                        {formatBNToken(item.dailyPayment, true)}
                      </p>
                    </div>
                  </div>
              </CCol>
            ))}
          </CRow>
          {totalPages > 1 && (
            <CPagination
              disabled={entitiesLoading}
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

export default Listings;
