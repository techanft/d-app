import { CCol, CLabel, CRow } from '@coreui/react';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import Loading from '../../../shared/components/Loading';
import { RootState } from '../../../shared/reducers';
import { getEntity } from '../../assets/assets.api';
import { fetchingEntity, selectEntityById } from '../../assets/assets.reducer';
// import { useGetAssetQuery } from "../../assets/assets.api";
import ListingDetails from '../../listingDetails/ListingDetails';
import ListingInfo from '../../listingInfo/ListingInfo';
import Listings from '../../listings/Listings';

interface IListingDetailsViewParams {
  [x: string]: string;
}

interface IListingDetailsView extends RouteComponentProps<IListingDetailsViewParams> {}


const ListingDetailsView = (props: IListingDetailsView) => {
  const dispatch = useDispatch();
  const { match } = props;
  const { id } = match.params; 

  const { initialState } = useSelector((state: RootState) => state.assets);
  const { errorMessage, entityLoading } = initialState;
  const listing = useSelector(selectEntityById(id));

  useEffect(() => {
    if (id) {
      dispatch(fetchingEntity());
      dispatch(getEntity(Number(id)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <>
      {listing ? (
        <>
          <ListingInfo asset={listing} />
          <ListingDetails />
          <CRow className="mx-0">
            <CCol xs={12}>
              <CLabel className="text-primary content-title mt-3">More listing</CLabel>
            </CCol>
            <CCol xs={12} className="px-0">
              <Listings routingProps={props} />
            </CCol>
          </CRow>
        </>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default ListingDetailsView;
