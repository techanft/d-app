import { CCol, CLabel, CRow } from '@coreui/react';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import SubmissionModal from '../../shared/components/SubmissionModal';
import { RootState } from '../../shared/reducers';
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
  const { success } = useSelector((state: RootState) => state.transactions);
  const { provider } = useSelector((state: RootState) => state.wallet);
  const { match } = props;
  const { id } = match.params;

  useEffect(() => {
    if (!id || !provider) return;
    dispatch(fetchingEntity());
    dispatch(getEntity({ id: Number(id), provider }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, success]);

  return (
    <>
      <SubmissionModal />

      <Primary listingId={Number(id)} />
      <Secondary listingId={Number(id)} />
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
