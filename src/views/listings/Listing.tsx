import { CCol, CLabel, CRow } from '@coreui/react';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import SubmissionModal from '../../shared/components/SubmissionModal';
import { getEntity } from '../assets/assets.api';
import { fetchingEntity } from '../assets/assets.reducer';
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
  const { match } = props;
  const { id } = match.params;

  useEffect(() => {
    if (id) {
      dispatch(fetchingEntity());
      dispatch(getEntity(Number(id)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);


  return (
    <>
      <SubmissionModal />

      <Primary listingId={Number(id)} />
      <Secondary />
      <CRow className="mx-0">
        <CCol xs={12}>
          <CLabel className="text-primary content-title mt-3">More listing</CLabel>
        </CCol>
        <CCol xs={12} className="px-0">
          <Listings routingProps={props} />
        </CCol>
      </CRow>
    </>
  );
};

export default Listing;
