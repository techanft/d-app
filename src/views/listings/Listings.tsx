import CIcon from '@coreui/icons-react';
import { CCol, CPagination, CRow } from '@coreui/react';
import { BigNumber } from 'ethers';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { formatBNToken } from '../../shared/casual-helpers';
import Loading from '../../shared/components/Loading';
import { IParams } from '../../shared/models/base.model';
import { RootState } from '../../shared/reducers';
import { getEntities } from '../assets/assets.api';
import { assetsSelectors, fetchingEntities, setFilterState as setStoredFilterState } from '../assets/assets.reducer';
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

export interface IAssetFilter extends IParams {
  owner?: string;
  city?: string;
  dist?: string;
  classify?: string;
  segment?: string;
  area?: string;
  orientation?: string;
  dailyPayment?: string;
  quality?: string;
}

const initialFilterState: IAssetFilter = {
  page: 0,
  size: 5,
  sort: 'createdDate,desc',
};

const Listings = () => {
  const history = useHistory();
  const { location } = history;
  const insideDetailView = location.pathname.includes('detail');

  const dispatch = useDispatch();
  const { initialState } = useSelector((state: RootState) => state.assets);
  const { provider, signerAddress } = useSelector((state: RootState) => state.wallet);
  const { totalItems, entitiesLoading, filterState: storedFilterState } = initialState;
  const assets = useSelector(assetsSelectors.selectAll);

  const { t } = useTranslation();

  const [filterState, setFilterState] = useState<IAssetFilter>(storedFilterState || initialFilterState);

  const totalPages = Math.ceil(totalItems / filterState.size);

  const handlePaginationChange = (page: number) => {
    if (page !== 0) {
      window.scrollTo(0, 0);
      setFilterState({ ...filterState, page: page - 1 });
    }
  };
  useEffect(() => {
    if (!provider) return;
    dispatch(fetchingEntities());
    dispatch(getEntities({ fields: filterState, provider }));
    dispatch(setStoredFilterState(filterState));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filterState), signerAddress]);

  const onRedirecting = (path: string) => {
    return () => {
      window.scrollTo(0, 0);
      history.push(path);
    };
  };

  return (
    <CRow className={`mx-0`}>
      {assets.length ? (
        <>
          {assets.map((item, index) => (
            <CCol xs={12} key={`listing-${index}`} className="px-0">
              <div
                className="media info-box bg-white mx-3 my-2 p-2 align-items-center rounded shadow-sm"
                onClick={onRedirecting(`/${item.id}/detail`)}
              >
                <img src={item.images} alt="realEstateImg" className="rounded" />
                <div className="media-body align-items-around ml-2">
                  <span className="info-box-text text-dark">{`${item.id} Yên Sở - Hoàng Mai - Hà Nội`}</span>
                  <p className={`info-box-token text-primary mt-2 mb-0`}>
                    {t('anftDapp.listingComponent.listingValue')}: {formatBNToken(item.value, true)}
                  </p>
                  <p className={`info-box-commissionRate text-success mt-2 mb-0`}>
                    <CIcon name="cil-flower" /> {formatBNToken(item.dailyPayment, true)}
                  </p>
                </div>
              </div>
            </CCol>
          ))}
          <CCol xs={12} className="p-0">
            {totalPages > 1 && !insideDetailView ? (
              <CPagination
                disabled={entitiesLoading}
                activePage={filterState.page + 1}
                pages={totalPages}
                onActivePageChange={handlePaginationChange}
                align="center"
                className="mt-2"
              />
            ) : (
              ''
            )}
          </CCol>
        </>
      ) : (
        <CCol xs={12}>
          {entitiesLoading ? ( //Still loading and waiting for results
            <Loading /> 
          ) : ( //Finished loading and no result found
            <div className="alert alert-warning my-3">
              <span>{t('anftDapp.listingComponent.noListingFound')}</span>
            </div>
          )}
        </CCol>
      )}
    </CRow>
  );
};

export default Listings;
