import { CCard, CCardBody, CCardTitle, CCol, CContainer, CLabel, CRow } from '@coreui/react';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import ActivityLogsContainer from '../../../shared/components/ActivityLogsContainer';
import CopyTextToClipBoard from '../../../shared/components/CopyTextToClipboard';
import InfoLoader from '../../../shared/components/InfoLoader';
import useWindowDimensions from '../../../shared/hooks/useWindowDimensions';
import { RootState } from '../../../shared/reducers';
import { getEntity } from '../../assets/assets.api';
import { fetchingEntity, selectEntityById } from '../../assets/assets.reducer';
import { IOverviewFilter } from '../../logsOverview/LogsOverview';
import '../index.scss';

interface IActivityLogsParams {
  [x: string]: string;
}

interface IActivityLogs extends RouteComponentProps<IActivityLogsParams> {}

const ActivityLogs = (props: IActivityLogs) => {
  const { match } = props;
  const { id } = match.params;
  const dispatch = useDispatch();
  const scrollRef = useRef<null | HTMLParagraphElement>(null);
  const listing = useSelector(selectEntityById(Number(id)));
  const { provider } = useSelector((state: RootState) => state.wallet);
  const { initialState: assetsInitialState } = useSelector((state: RootState) => state.assets);
  const { entityLoading } = assetsInitialState;

  useEffect(() => {
    if (!id || !provider) return;
    dispatch(fetchingEntity());
    dispatch(getEntity({ id: Number(id), provider }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const { width: screenWidth } = useWindowDimensions();

  const { t } = useTranslation();

  return (
    <CContainer fluid className="mx-0 my-2">
      <CRow>
        <CCol xs={12}>
          <CLabel className="text-primary content-title">{t('anftDapp.listingComponent.activityLogs')}</CLabel>
        </CCol>
        <CCol xs={12}>
          <CCard className="m-0 listing-img-card">
            {!entityLoading && listing ? (
              <img src={listing.images} alt="listingImg" className="w-100 h-100" />
            ) : (
              // Ensuring 16:9 ratio for image and image loader
              <InfoLoader width={screenWidth} height={screenWidth / 1.77} />
            )}
            <CCardBody className="p-0 listing-card-body">
              <CCardTitle className="listing-card-title mb-0 px-3 py-2 w-100" innerRef={scrollRef}>
                <p className="mb-0 text-white content-title">202 Yên Sở - Hoàng Mai - Hà Nội</p>
                <p className="mb-0 text-white detail-title-font">
                  {t('anftDapp.listingComponent.primaryInfo.blockchainAddress')}{' '}
                  <b>
                    {!entityLoading && listing?.address ? (
                      <CopyTextToClipBoard
                        text={listing.address}
                        iconClassName="text-white"
                        inputClassName="copy-address"
                      />
                    ) : (
                      <InfoLoader width={155} height={27} />
                    )}
                  </b>
                </p>
              </CCardTitle>
            </CCardBody>
          </CCard>
        </CCol>

     {/* Ownership - Activity Logs */}
        {listing?.address && (
          <ActivityLogsContainer shouldDisplayBlockchainAddress={false} filterState={{ listingAddress: listing.address }} />
        )}
      </CRow>

    </CContainer>
  );
};

export default ActivityLogs;
