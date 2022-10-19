import { CCol, CContainer, CLabel, CRow } from '@coreui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { insertCommas } from '../../../shared/casual-helpers';
import { selectEntityById } from '../../assets/assets.reducer';
import '../index.scss';
import { IListingInfoProps } from './Primary';

const ListingDetails = (props: IListingInfoProps) => {
  const { t } = useTranslation();
  const { listingId } = props;

  const listing = useSelector(selectEntityById(listingId));

  return (
    <CContainer className="px-0" fluid>
      <CRow className="p-0 m-0">
        <CCol xs={12}>
          <CLabel className="text-primary content-title mt-3">
            {t('anftDapp.listingComponent.secondaryInfo.details')}
          </CLabel>
        </CCol>
        <CCol xs={6}>
          <p className="detail-title-font my-2">{t('anftDapp.listingComponent.secondaryInfo.sector')}</p>
          <p className="my-2 detail-value">{listing?.location || '_'}</p>
        </CCol>
        <CCol xs={6}>
          <p className="detail-title-font my-2">{t('anftDapp.listingComponent.secondaryInfo.propertyType')}</p>
          <p className="my-2 detail-value">{listing?.type.name || '_'}</p>
        </CCol>
        <CCol xs={6}>
          <p className="detail-title-font my-2">{t('anftDapp.listingComponent.secondaryInfo.area')}</p>
          <p className="my-2 detail-value">{listing?.areaLand ? insertCommas(listing.areaLand) : 0} m<sup>2</sup></p>
        </CCol>
        <CCol xs={6}>
          <p className="detail-title-font my-2">{t('anftDapp.listingComponent.secondaryInfo.floorAndOrientation')}</p>
          <p className="my-2 detail-value">{listing?.numberOfStorey ? insertCommas(listing.numberOfStorey) : 0}</p>
        </CCol>
        <CCol xs={6}>
          <p className="detail-title-font my-2">{t('anftDapp.listingComponent.secondaryInfo.quality')}</p>
          <p className="my-2 detail-value">{listing?.quality || '_'}</p>
        </CCol>
        <CCol xs={6}>
          <p className="detail-title-font my-2">{t('anftDapp.listingComponent.secondaryInfo.services')}</p>
          <p className="my-2 detail-value">{listing?.listingPotentials?.map(item => item.name).join(', ')}</p>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default ListingDetails;
