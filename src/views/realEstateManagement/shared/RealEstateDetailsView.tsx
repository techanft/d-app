import { CCol, CLabel, CRow } from "@coreui/react";
import React from "react";
import { useSelector } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import DAppLoading from "../../../shared/components/DAppLoading";
import { RootState } from "../../../shared/reducers";
import { useGetAssetQuery } from "../../assets/assets.api";
import { RealEstateDetails } from "../../realEstateDetails/RealEstateDetails";
import { RealEstateInfo } from "../../realEstateInfo/RealEstateInfo";
import { RealEstateListing } from "../../realEstateListing/RealEstateListing";

interface IRealEstateDetailsViewParams {
  [x: string]: string;
}

interface IRealEstateDetailsView extends RouteComponentProps<IRealEstateDetailsViewParams> {}

type IProps = IRealEstateDetailsView;

const RealEstateDetailsView = (props: IProps) => {
  const { match } = props;
  const { id } = match.params;
  const { data,isLoading } = useGetAssetQuery(id);
  const { asset } = useSelector((state: RootState) => state.assetsReducer);
  console.log(data);

  return (
    <>
      {isLoading && asset ? (
       <DAppLoading/>
      ) : (
        <>
          <RealEstateInfo />
          <RealEstateDetails />
          <CRow className="mx-0">
            <CCol xs={12}>
              <CLabel className="text-primary content-title mt-3">More listing</CLabel>
            </CCol>
            <CCol xs={12} className="px-0">
              <RealEstateListing />
            </CCol>
          </CRow>
        </>
      )}
    </>
  );
};

export default RealEstateDetailsView;
