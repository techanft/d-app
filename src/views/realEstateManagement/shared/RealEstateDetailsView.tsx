import { CCol, CLabel, CRow } from "@coreui/react";
import React from "react";
import { RouteComponentProps } from "react-router-dom";
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
  useGetAssetQuery(id)
  
  return (
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
  );
};

export default RealEstateDetailsView;
