import { CCol, CLabel, CRow } from "@coreui/react";
import React from "react";
import { useSelector } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import DAppLoading from "../../../shared/components/DAppLoading";
import { RootState } from "../../../shared/reducers";
import { useGetAssetQuery } from "../../assets/assets.api";
import ListingDetails from "../../listingDetails/ListingDetails";
import ListingInfo from "../../listingInfo/ListingInfo";
import Listing from "../../listings/Listings";


interface IListingDetailsViewParams {
  [x: string]: string;
}

interface IListingDetailsView extends RouteComponentProps<IListingDetailsViewParams> {}

type IProps = IListingDetailsView;

const ListingDetailsView = (props: IProps) => {
  const { match } = props;
  const { id } = match.params;
  const { isLoading } = useGetAssetQuery(id);
  const { asset } = useSelector((state: RootState) => state.assetsReducer);

  // useEffect(() => {
  //   if (!isLoading) {
  //     console.log(asset);
  //   }
  // }, [isLoading]);

  return (
    <>
      {!isLoading && asset !== null ? (
        <>
          <ListingInfo asset={asset} />
          <ListingDetails />
          <CRow className="mx-0">
            <CCol xs={12}>
              <CLabel className="text-primary content-title mt-3">More listing</CLabel>
            </CCol>
            <CCol xs={12} className="px-0">
              <Listing />
            </CCol>
          </CRow>
        </>
      ) : (
        <DAppLoading />
      )}
    </>
  );
};

export default ListingDetailsView;
