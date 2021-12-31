import { CCol, CLabel, CRow } from '@coreui/react';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import Loading from '../../shared/components/Loading';
import SubmissionModal from '../../shared/components/SubmissionModal';
import { RootState } from '../../shared/reducers';
import { getEntity } from '../assets/assets.api';
import { fetchingEntity, selectEntityById } from '../assets/assets.reducer';
// import { useGetAssetQuery } from "../../assets/assets.api";
import Primary from './info/Primary';
import Secondary from './info/Secondary';
import Listings from './Listings';

interface IListingParams {
  [x: string]: string;
}

interface IListingProps extends RouteComponentProps<IListingParams> {}

const Listing = (props: IListingProps) => {
  const dispatch = useDispatch();
  const { success } = useSelector((state: RootState) => state.transactions);
  const { match, history } = props;
  const { id } = match.params;
  const { initialState } = useSelector((state: RootState) => state.assets);
  const { entityLoading, errorMessage } = initialState;
  const listing = useSelector(selectEntityById(Number(id)));

  useEffect(() => {
    if (id) {
      console.log('count getListing');

      dispatch(fetchingEntity());
      dispatch(getEntity(Number(id)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, success]);

  useEffect(() => {
    if (errorMessage) {
      history.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorMessage]);

  return (
    <>
      {!entityLoading && listing?.id ? (
        <>
          <SubmissionModal />

          <Primary listing={listing} />
          <Secondary listing={listing} />
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

export default Listing;
