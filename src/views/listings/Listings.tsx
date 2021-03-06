import { CCard, CCardBody, CCardText, CCardTitle, CCol, CContainer, CImg, CLabel, CPagination, CRow } from '@coreui/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { formatBNToken, returnTheFirstImage } from '../../shared/casual-helpers';
import FilterComponent from '../../shared/components/FilterComponent';
import Loading from '../../shared/components/Loading';
import { ExchangeType } from '../../shared/enumeration/exchangeType';
import useDeviceDetect from '../../shared/hooks/useDeviceDetect';
import useWindowDimensions from '../../shared/hooks/useWindowDimensions';
import { IAsset } from '../../shared/models/assets.model';
import { IParams } from '../../shared/models/base.model';
import { RootState } from '../../shared/reducers';
import { getEntities } from '../assets/assets.api';
import { assetsSelectors, fetchingEntities, setFilterState as setStoredFilterState } from '../assets/assets.reducer';
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
  dailyPayment?: string;
  quality?: string;
  level: ExchangeType;
}

interface IViewComponent {
  item: IAsset;
}

const initialFilterState: IAssetFilter = {
  page: 0,
  size: 12,
  sort: 'createdDate,desc',
  level: ExchangeType.PRIMARY,
};

const Listings = () => {
  const history = useHistory();
  const { location } = history;
  const insideDetailView = location.pathname.includes('detail');

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

  const ListView = ({ item }: IViewComponent) => (
    <CCol md={12} className={`px-0 mx-0 ${hideDetailedListing(item)} `}>
      <div
        className="media info-box bg-white my-2 p-2 align-items-center rounded shadow-sm cursor-pointer"
        onClick={onRedirecting(`/${item.id}/detail`)}
      >
        <img src={returnTheFirstImage(item.images)} alt="realEstateImg" className="rounded" />
        <div className="media-body align-items-around ml-2">
          <span className="info-box-text text-dark">{item.name ? item.name : '_'}</span>
          <table className={`w-100 mt-1`}>
            <tbody>
              <tr className={`info-box-daily-payment text-primary mt-2 mb-0`}>
                <td>{t('anftDapp.listingComponent.listingValue')}</td>
                <td className={`text-right`}>{formatBNToken(item.value, width > minimumWidthDisplayingTokenSymbol)}</td>
              </tr>
              <tr className={`info-box-daily-payment text-success mt-2 mb-0`}>
                <td>{t('anftDapp.listingComponent.dailyPayment')}</td>
                <td className={`text-right`}>
                  {formatBNToken(item.dailyPayment, width > minimumWidthDisplayingTokenSymbol)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </CCol>
  );

  const GridView = ({ item }: IViewComponent) => (
    <CCol sm={12} md={6} lg={6} xl={`${insideDetailView ? '4' : '6'}`} className={`p-3 ${hideDetailedListing(item)} `}>
      <CCard className="h-100 cursor-pointer" onClick={onRedirecting(`/${item.id}/detail`)}>
        <CCard className="m-0 border-0">
          <CImg src={returnTheFirstImage(item.images)} height={250} alt="realEstateImg" className="rounded-top" />
        </CCard>
        <CCard className="m-0 h-100 pb-0 border-0">
          <CCardBody className="pb-0">
            <CCardTitle>{item.name ? item.name : '_'}</CCardTitle>
            <div className="d-flex justify-content-between text-primary">
              <CCardText>{t('anftDapp.listingComponent.listingValue')}</CCardText>
              <CCardText>{formatBNToken(item.value, width > minimumWidthDisplayingTokenSymbol)}</CCardText>
            </div>
            <div className="d-flex justify-content-between text-success">
              <CCardText>{t('anftDapp.listingComponent.dailyPayment')}</CCardText>
              <CCardText> {formatBNToken(item.dailyPayment, width > minimumWidthDisplayingTokenSymbol)}</CCardText>
            </div>
          </CCardBody>
        </CCard>
      </CCard>
    </CCol>
  );

  return (
    <CContainer fluid={isMobile || insideDetailView}>
      <CRow className={`mx-0`}>
        <CCol md={12} lg={`${isMobile || insideDetailView ? '12' : '8'}`}>
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
                    {isMobile || insideDetailView ? <ListView item={item} /> : <GridView item={item} />}
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
        <CCol md={12} lg={4} className={`${isMobile || insideDetailView ? 'd-none' : 'd-none d-lg-block'}`}>
          <CRow className="p-3">
            <FilterComponent />
          </CRow>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default Listings;
