import CIcon from '@coreui/icons-react';
import {
  CBadge,
  CCard,
  CCardBody,
  CCardImgOverlay,
  CCol,
  CContainer,
  CImg,
  CLabel,
  CPagination,
  CRow,
} from '@coreui/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { formatBNToken, insertCommas, returnTheFirstImage } from '../../shared/casual-helpers';
import FilterComponent from '../../shared/components/FilterComponent';
import Loading from '../../shared/components/Loading';
import { mapExchangeTypeBadge } from '../../shared/enumeration/exchangeType';
import useDeviceDetect from '../../shared/hooks/useDeviceDetect';
import useWindowDimensions from '../../shared/hooks/useWindowDimensions';
import { IAsset } from '../../shared/models/assets.model';
import { IParams } from '../../shared/models/base.model';
import { RootState } from '../../shared/reducers';
import { getEntities } from '../assets/assets.api';
import { assetsSelectors, fetchingEntities, setFilterState as setStoredFilterState } from '../assets/assets.reducer';
import { getEntities as getListingTypes } from '../productType/category.api';
import { fetching as fetchingListingType } from '../productType/category.reducer';
import { getProvincesEntites } from '../provinces/provinces.api';
import './index.scss';
import { IListingParams } from './Listing';

export interface IAssetFilter extends IParams {
  owner?: string;
  city?: string;
  dist?: string;
  classify?: string;
  segment?: string;
  area?: string;
  orientation?: string;
  dailyPayment?: number;
  quality?: string;
  bedroom?: number;
  livingroom?: number;
  ownershipStatus?: string;
}

interface IViewComponent {
  listing: IAsset;
}

const initialFilterState: IAssetFilter = {
  page: 0,
  size: 10,
  sort: 'createdDate,desc',
};

const hideFilterComponentView = ['activity-logs', 'register', 'workers-list'];

const Listings = () => {
  const history = useHistory();
  const { location } = history;
  const hideFilterComponent = hideFilterComponentView.find((route) => location.pathname.includes(route));
  const insideDetailView = location.pathname.includes('detail') || Boolean(hideFilterComponent);

  const { isMobile } = useDeviceDetect();
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

  useEffect(() => {
    dispatch(fetchingListingType());
    dispatch(getListingTypes());
    dispatch(getProvincesEntites({ country: 'VN' }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRedirecting = (path: string) => {
    return () => {
      window.scrollTo(0, 0);
      history.push(path);
    };
  };

  const { id: listingBeingDetailedId } = useParams<IListingParams>();

  const hideDetailedListing = ({ id }: IAsset) => {
    return listingBeingDetailedId === id ? 'd-none' : '';
  };

  const { width } = useWindowDimensions();
  const minimumWidthDisplayingTokenSymbol = 360;

  const ListView = ({ listing }: IViewComponent) => (
    <CCol md={12} className={`px-0 mx-0 ${hideDetailedListing(listing)} `}>
      <div
        className="media info-box bg-white my-2 p-2 align-items-center rounded shadow-sm cursor-pointer"
        onClick={onRedirecting(`/${listing.id}/detail`)}
      >
        <img src={returnTheFirstImage(listing.images)} alt="realEstateImg" className="rounded" />
        <div className="media-body align-items-around ml-2">
          <span className="info-box-text text-dark">{listing.name ? listing.name : '_'}</span>
          <table className={`w-100 mt-1`}>
            <tbody>
              <tr className={`info-box-daily-payment text-success mt-2 mb-0`}>
                <td className="d-flex align-items-center mb-1">
                  <CIcon name="cil-money" className="mr-1" size="sm" /> {formatBNToken(listing.dailyPayment, true)}
                </td>
              </tr>
              <tr className={`info-box-daily-payment text-primary mt-2 mb-0`}>
                <td className="d-flex align-items-center">
                  <span>
                    <CIcon name="cil-location-pin" className="mr-1" size="sm" />
                    {listing.location || '_'}
                  </span>
                </td>
              </tr>
              <tr className={`info-box-daily-payment`}>
                <td className="d-flex align-items-center">
                  <CBadge color={mapExchangeTypeBadge[listing.level]} className="mt-1">
                    {t(`anftDapp.listingComponent.${listing.level.toLocaleLowerCase()}`)}
                  </CBadge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </CCol>
  );

  const GridView = ({ listing }: IViewComponent) => (
    <CCol xs={12} md={6} xl={4} xxl={3} className={`p-3 ${hideDetailedListing(listing)} `}>
      <CCard className="h-100 cursor-pointer" onClick={onRedirecting(`/${listing.id}/detail`)}>
        <CCard className="m-0 border-0">
          <div className="aspect-ratio-box">
            <CImg
              src={returnTheFirstImage(listing.images)}
              className="aspect-ratio-item rounded-top"
              alt="realEstateImg"
            />
          </div>
          <CCardImgOverlay className="">
            <CBadge color={mapExchangeTypeBadge[listing.level]} className="font-size-075">
              {t(`anftDapp.listingComponent.${listing.level.toLocaleLowerCase()}`)}
            </CBadge>
          </CCardImgOverlay>
        </CCard>
        <CCard className="m-0 h-100 pb-0 border-0">
          <CCardBody className="pb-0">
            <h5 className="text-black-blue text-lead">{listing.name}</h5>
            <h6>
              <CIcon name="cil-money" className="text-success mr-1" />
              {formatBNToken(listing.dailyPayment, width > minimumWidthDisplayingTokenSymbol)}
              <small className="d-none d-lg-inline-block ml-1">{`(${
                listing.fee ? insertCommas(listing.fee) : 0
              } VND)`}</small>
            </h6>
            <h6>
              <CIcon name="cil-location-pin" className="text-info mr-1" />
              <span className={`d-none d-xl-inline`}>{`${listing.location} `}</span>
              {listing.district.name}, {listing.province.name}
            </h6>
            <h6>
              <CIcon name="cil-object-ungroup" className="mr-1 text-primary" />
              {listing.areaLand ? insertCommas(listing.areaLand) : 0} m<sup>2</sup>
            </h6>
            <h6 className="mb-0">
              <CIcon name="cil-tag" className="text-warning" /> {listing.type.name}
            </h6>
          </CCardBody>
        </CCard>
      </CCard>
    </CCol>
  );

  return (
    <CContainer fluid={isMobile || insideDetailView}>
      <CRow className={`mx-0`}>
        <CCol xs={12} className={`${isMobile || insideDetailView ? 'd-none' : 'd-none d-lg-block'}`}>
          <CRow>
            <FilterComponent />
          </CRow>
        </CCol>

        <CCol xs={12}>
          {/* <CCol md={12} lg={`${isMobile || insideDetailView ? '12' : '8'}`}> */}
          <CRow>
            {insideDetailView ? (
              <CLabel className="text-primary content-title mt-3">{t('anftDapp.listingComponent.moreListing')}</CLabel>
            ) : (
              ''
            )}
            {assets.length && !entitiesLoading ? (
              <>
                {assets.map((item, index) => (
                  <React.Fragment key={`list-${index}`}>
                    {isMobile || insideDetailView ? <ListView listing={item} /> : <GridView listing={item} />}
                  </React.Fragment>
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
                ) : (
                  //Finished loading and no result found
                  <div className="alert alert-warning my-3">
                    <span>{t('anftDapp.listingComponent.noListingFound')}</span>
                  </div>
                )}
              </CCol>
            )}
          </CRow>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default Listings;
