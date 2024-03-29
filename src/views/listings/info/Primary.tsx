import CIcon from '@coreui/icons-react';
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CCollapse,
  CContainer,
  CDataTable,
  CLink,
  CPagination,
  CRow,
} from '@coreui/react';
import {
  faArrowAltCircleDown,
  faArrowAltCircleUp,
  faClipboard,
  faDonate,
  faEdit,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { TFunction, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { MANAGEMENT_SITE_URL, TOKEN_SYMBOL } from '../../../config/constants';
import {
  checkOwnershipAboutToExpire,
  checkOwnershipExpired,
  convertUnixToDate,
  formatBNToken,
  formatLocalDatetime,
  returnTheFirstImage,
} from '../../../shared/casual-helpers';
import ConfirmationLoading from '../../../shared/components/ConfirmationLoading';
import CopyTextToClipBoard from '../../../shared/components/CopyTextToClipboard';
import InfoLoader from '../../../shared/components/InfoLoader';
import { ToastError, ToastInfo } from '../../../shared/components/Toast';
import { SellStatus } from '../../../shared/enumeration/commercialStatus';
import { CollapseType, ModalType, TCollapseVisibility, TModalsVisibility } from '../../../shared/enumeration/modalType';
import useWindowDimensions from '../../../shared/hooks/useWindowDimensions';
import { IAsset } from '../../../shared/models/assets.model';
import { IParams } from '../../../shared/models/base.model';
import { IRecordWorker } from '../../../shared/models/record.model';
import { RootState } from '../../../shared/reducers';
import { selectEntityById } from '../../assets/assets.reducer';
import { getWorkersRecord } from '../../records/records.api';
import { fetchingWorker, softResetWorker } from '../../records/records.reducer';
import { hardReset } from '../../transactions/transactions.reducer';
import ExtendOwnershipModal from '../actions/ExtendOwnershipModal';
import WithdrawTokenModal from '../actions/WithdrawModal';
import '../index.scss';
import CheckWorkerModal from './CheckWorkerModal';

const ownershipText = (viewerAddr: string | undefined, listingInfo: IAsset, t: TFunction<'translation', undefined>) => {
  const { ownership, owner } = listingInfo;
  if (!ownership || !owner) return '';

  const viewerIsOwner = viewerAddr === owner;
  const ownershipAboutToExpire = checkOwnershipAboutToExpire(ownership.toNumber());
  const ownershipExpired = checkOwnershipExpired(ownership.toNumber());

  let textClassname;
  let textContent;

  if (ownershipAboutToExpire) {
    if (ownershipExpired) {
      // Ownership actually expired
      textClassname = viewerIsOwner ? 'text-danger' : 'text-success';
      textContent = viewerIsOwner
        ? t('anftDapp.listingComponent.primaryInfo.ownershipStatus.ownershipExpired')
        : t('anftDapp.listingComponent.primaryInfo.ownershipStatus.notOwned');
    } else {
      // 24 hours before the ownership actually expires
      textClassname = viewerIsOwner ? 'text-warning' : 'text-success';
      textContent = viewerIsOwner
        ? t('anftDapp.listingComponent.primaryInfo.ownershipStatus.ownershipAboutToExpire', {
            time: convertUnixToDate(moment.unix(ownership.toNumber()).subtract(1, 'days').unix()),
          })
        : t('anftDapp.listingComponent.primaryInfo.ownershipStatus.ownershipAbleToExtends');
    }
  } else {
    // Ownership still active
    textClassname = viewerIsOwner ? 'text-success' : 'text-danger';
    textContent = viewerIsOwner
      ? t('anftDapp.listingComponent.primaryInfo.ownershipStatus.owned')
      : t('anftDapp.listingComponent.primaryInfo.ownershipStatus.ownedByAnotherAddress');
  }

  return <p className={`ownership-checked m-0 ${textClassname}`}>{textContent}</p>;
};
export interface IListingInfoProps {
  listingId: number;
}

const titleTableStyle = {
  textAlign: 'left',
  color: '#828282',
  fontSize: '0.875rem',
  lineHeight: '16px',
  fontWeight: '400',
};

const initialCollapseState: TCollapseVisibility = {
  [CollapseType.INVESTMENT]: false,
  [CollapseType.MANAGEMENT]: false,
  [CollapseType.WORKER_LIST]: false,
};

const ListingInfo = (props: IListingInfoProps) => {
  const { listingId } = props;
  const dispatch = useDispatch();
  //get worker list
  const { initialState: recordInitialState } = useSelector((state: RootState) => state.records);
  const { loading: loadingWorkers, workers, errorMessage: workerErrorMessage } = recordInitialState.workerInitialState;
  const { success, submitted } = useSelector((state: RootState) => state.transactions);
  const { t } = useTranslation();

  const workerFields = [
    {
      key: 'address',
      _style: titleTableStyle,
      label: `${t('anftDapp.workersListComponent.address')}`,
    },
    {
      key: 'createdDate',
      _style: titleTableStyle,
      label: `${t('anftDapp.workersListComponent.createdDate')}`,
    },
  ];

  const listing = useSelector(selectEntityById(listingId));
  const [filterState, setFilterState] = useState<IParams>({
    page: 0,
    size: 10,
    sort: 'createdDate,desc',
  });

  const totalPages = Math.ceil((workers?.count || 0) / filterState.size);

  const handlePaginationChange = (page: number) => {
    if (page !== 0) {
      window.scrollTo(0, 0);
      setFilterState({ ...filterState, page: page - 1 });
    }
  };

  useEffect(() => {
    if (workerErrorMessage) {
      ToastError(workerErrorMessage);
      dispatch(softResetWorker());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workerErrorMessage]);

  const { signerAddress } = useSelector((state: RootState) => state.wallet);

  const { width: screenWidth } = useWindowDimensions();

  const { initialState } = useSelector((state: RootState) => state.assets);
  const { entityLoading } = initialState;

  const ownershipExpired = listing?.ownership ? checkOwnershipExpired(listing.ownership.toNumber()) : false;
  const ownershipAboutToExpire = listing?.ownership ? checkOwnershipAboutToExpire(listing.ownership.toNumber()) : false;
  const viewerIsOwner = Boolean(signerAddress && signerAddress === listing?.owner);

  const isListingSold = listing?.sellStatus === SellStatus.TRANSFER_WAITING || listing?.sellStatus === SellStatus.SOLD;

  const initialModalState: TModalsVisibility = {
    [ModalType.OWNERSHIP_EXTENSION]: false,
    [ModalType.OWNERSHIP_WITHDRAW]: false,
    [ModalType.OWNERSHIP_REGISTER]: false,
    [ModalType.REWARD_CLAIM]: false,
    [ModalType.REWARD_UNREGISTER]: false,
  };

  const [modalsVisibility, setModalVisibility] = useState<TModalsVisibility>(initialModalState);

  const handleModalVisibility = (type: ModalType, isVisible: boolean) => {
    setModalVisibility({ ...initialModalState, [type]: isVisible });
  };

  const [collapseVisibility, setCollapseVisibility] = useState<TCollapseVisibility>(initialCollapseState);

  const toggleCollapseVisibility = (type: CollapseType) => () => {
    const viewingWorkerList = type === CollapseType.WORKER_LIST; // Doesnt require wallet connection to view worker list
    if (!signerAddress && !viewingWorkerList) return ToastError(t('anftDapp.global.errors.pleaseConnectWallet'));
    setCollapseVisibility({ ...initialCollapseState, [type]: !collapseVisibility[type] });
  };

  useEffect(() => {
    if (listing?.address) {
      const filter = { ...filterState, listingAddress: listing.address };
      dispatch(fetchingWorker());
      dispatch(getWorkersRecord(filter));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filterState), listing?.address]);

  useEffect(() => {
    if (success) {
      dispatch(hardReset());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]);

  const onRegisteringOwnership = () => {
    if (viewerIsOwner) return;
    if (!ownershipAboutToExpire) {
      return ToastError(t('anftDapp.listingComponent.extendOwnership.cannotRegisterOwnership'));
    }
    handleModalVisibility(ModalType.OWNERSHIP_REGISTER, true);
  };

  const onWithdrawToken = () => {
    if (ownershipExpired) return ToastError(t('anftDapp.listingComponent.withdrawToken.noMoreTokenToWithdraw'));
    handleModalVisibility(ModalType.OWNERSHIP_WITHDRAW, true);
  };

  const [isCheckWorker, setIsCheckWorker] = useState<boolean>(false);

  const onCheckingWorker = () => {
    if (!workers?.count) {
      ToastInfo(t('anftDapp.listingComponent.primaryInfo.checkWorker.checkWorkerInfo'));
    } else {
      setIsCheckWorker(true);
    }
  };

  return (
    <CContainer fluid className="px-0">
      <CCol xs={12} className="p-0">
        {!entityLoading && listing ? (
          <img src={returnTheFirstImage(listing.images)} className="w-100 h-100" alt="listingImg" />
        ) : (
          // Ensuring 16:9 ratio for image and image loader
          <InfoLoader width={screenWidth} height={screenWidth / 1.77} />
        )}
      </CCol>

      <CCol className="m-0 p-0">
        <CRow className="listing-address-info m-0 p-0">
          <CCol xs={12} className="text-dark btn-font-style mt-3 d-flex justify-content-between align-items-center">
            {listing?.name ? listing.name : '_'}
            <CLink
              target="_blank"
              rel="noreferrer noopener"
              href={`${MANAGEMENT_SITE_URL}#/listings/primary/${listingId}/detail`}
            >
              <CButton className=" btn btn-primary btn-font-style btn-radius-50">
                {t('anftDapp.listingComponent.secondaryInfo.details')}
              </CButton>
            </CLink>
          </CCol>

          <CCol xs={12} className="text-primary total-token my-3">
            {!entityLoading && listing?.dailyPayment ? (
              <>
                <p className="m-0">
                  {formatBNToken(listing.dailyPayment, false)}{' '}
                  <span className="token-name">
                    {TOKEN_SYMBOL} / {t('anftDapp.listingComponent.primaryInfo.day')}
                  </span>
                </p>
              </>
            ) : (
              <InfoLoader width={300} height={29} />
            )}
          </CCol>

          <CCol xs={12} className=" mb-3">
            {!entityLoading && listing?.ownership ? (
              !isListingSold ? (
                ownershipText(signerAddress, listing, t)
              ) : (
                ''
              )
            ) : (
              <InfoLoader width={300} height={29} />
            )}
          </CCol>
        </CRow>
        <CRow className="p-0 m-0">
          {submitted && !success ? (
            <CCol xs={12} className="d-flex justify-content-center mt-2">
              <ConfirmationLoading />
            </CCol>
          ) : (
            ''
          )}
          <CCol xs={6}>
            <p className="detail-title-font my-2">{t('anftDapp.listingComponent.primaryInfo.blockchainAddress')}</p>

            {!entityLoading && listing?.address ? (
              <p className="my-2">
                <CopyTextToClipBoard
                  text={listing.address}
                  inputClassName="my-2 value-text copy-address"
                  iconClassName="m-0"
                />
              </p>
            ) : (
              <InfoLoader width={155} height={27} />
            )}
          </CCol>

          {ownershipExpired ? (
            ''
          ) : (
            <>
              <CCol xs={6}>
                <p className="detail-title-font my-2">{t('anftDapp.listingComponent.primaryInfo.currentOwner')}</p>

                {!entityLoading && listing?.owner ? (
                  <p className="my-2">
                    <CopyTextToClipBoard
                      text={listing.owner}
                      inputClassName="my-2 value-text copy-address"
                      iconClassName="m-0"
                    />
                  </p>
                ) : (
                  <InfoLoader width={155} height={27} />
                )}
              </CCol>

              <CCol xs={6}>
                <p className="detail-title-font my-2">{t('anftDapp.listingComponent.primaryInfo.ownershipPeriod')}</p>
                {!entityLoading && listing?.ownership ? (
                  <p className={`my-2 value-text ${ownershipAboutToExpire ? 'text-warning' : 'text-success'}`}>
                    {convertUnixToDate(listing.ownership.toNumber())}
                  </p>
                ) : (
                  <InfoLoader width={155} height={27} />
                )}
              </CCol>
            </>
          )}

          <CCol xs={6}>
            <p className="detail-title-font my-2">{t('anftDapp.listingComponent.primaryInfo.dailyPayment')}</p>

            {!entityLoading && listing?.dailyPayment ? (
              <p className="my-2 value-text">
                {formatBNToken(listing.dailyPayment, false)} <span className="token-name">ANFT</span>
              </p>
            ) : (
              <InfoLoader width={155} height={27} />
            )}
          </CCol>

          <CCol xs={6}>
            <p className="detail-title-font my-2">{t('anftDapp.listingComponent.primaryInfo.totalStake')}</p>
            {!entityLoading && listing?.totalStake ? (
              <p className="text-primary my-2 value-text">
                {formatBNToken(listing.totalStake, false)} <span className="token-name">ANFT</span>
              </p>
            ) : (
              <InfoLoader width={155} height={27} />
            )}
          </CCol>

          <CCol xs={6}>
            <p className="detail-title-font my-2">{t('anftDapp.listingComponent.primaryInfo.workersCount')}</p>
            {!loadingWorkers && workers ? (
              <p className="my-2 value-text">{workers.count}</p>
            ) : (
              <InfoLoader width={155} height={27} />
            )}
          </CCol>

          <CCol xs={6} className="text-left">
            <p
              className="text-primary my-2 cursor-pointer"
              onClick={toggleCollapseVisibility(CollapseType.WORKER_LIST)}
            >
              <CIcon name="cil-description" className="mr-1 pb-1" size="lg" />
              {t('anftDapp.listingComponent.primaryInfo.workersList')}
            </p>
          </CCol>

          <CCol xs={6} className="text-left">
            <p className="text-primary my-2 cursor-pointer" onClick={onCheckingWorker}>
              <CIcon name="cil-find-in-page" className="mr-1 pb-1" size="lg" />
              {t('anftDapp.listingComponent.primaryInfo.checkWorker.checkWorker')}
            </p>
          </CCol>

          <CCol xs={12}>
            <CCollapse show={collapseVisibility.WORKER_LIST}>
              <CRow>
                <CCol xs={12}>
                  <CDataTable
                    striped
                    items={workers?.results}
                    fields={workerFields}
                    noItemsView={{
                      noItems: t('anftDapp.global.noItemText'),
                    }}
                    responsive
                    hover
                    header
                    scopedSlots={{
                      address: (item: IRecordWorker) => {
                        return (
                          <td>
                            <CopyTextToClipBoard text={item.worker} textNumber={10} iconClassName="m-0" />
                          </td>
                        );
                      },
                      createdDate: (item: IRecordWorker) => {
                        return <td>{formatLocalDatetime(item.createdDate)}</td>;
                      },
                    }}
                  />
                </CCol>
              </CRow>
              {totalPages > 1 && (
                <CPagination
                  disabled={loadingWorkers}
                  activePage={filterState.page + 1}
                  pages={totalPages}
                  onActivePageChange={handlePaginationChange}
                  align="center"
                  className="mt-2"
                />
              )}
            </CCollapse>
          </CCol>

          <CCol xs={12} className="mt-2 ">
            <CButton
              className="px-3 w-100 btn-radius-50 btn-font-style btn btn-outline-primary"
              onClick={toggleCollapseVisibility(CollapseType.INVESTMENT)}
              disabled={isListingSold}
            >
              {t('anftDapp.listingComponent.primaryInfo.investmentActivities.investmentActivities')}
            </CButton>
          </CCol>

          <CCol xs={12}>
            <CCollapse show={collapseVisibility.INVESTMENT}>
              <CCard className="activities-card mt-2 mb-0">
                <CCardBody className="p-2">
                  <CRow className="mx-0">
                    <p
                      onClick={onRegisteringOwnership}
                      className={`m-0 cursor-pointer ${
                        viewerIsOwner || !ownershipAboutToExpire ? 'text-secondary' : 'text-primary'
                      }`}
                    >
                      <FontAwesomeIcon icon={faEdit} />{' '}
                      {t('anftDapp.listingComponent.primaryInfo.investmentActivities.registerOwnership')}
                    </p>
                  </CRow>
                  <CRow className="mt-2 mx-0">
                    <CLink to={`/${listingId}/register`} className="text-decoration-none">
                      <FontAwesomeIcon icon={faDonate} />{' '}
                      {t('anftDapp.listingComponent.primaryInfo.investmentActivities.registerClaimReward')}
                    </CLink>
                  </CRow>
                </CCardBody>
              </CCard>
            </CCollapse>
          </CCol>

          <CCol xs={12} className="mt-2">
            <CButton
              className={`px-3 w-100 btn-radius-50 btn-font-style btn btn-primary ${
                viewerIsOwner ? 'd-block' : 'd-none'
              }`}
              onClick={toggleCollapseVisibility(CollapseType.MANAGEMENT)}
              disabled={isListingSold}
            >
              {t('anftDapp.listingComponent.primaryInfo.ownershipManagement.ownershipManagement')}
            </CButton>
          </CCol>

          <CCol xs={12}>
            <CCollapse show={collapseVisibility.MANAGEMENT}>
              <CCard className="mt-2 activities-card mb-0">
                <CCardBody className="p-2">
                  <CRow className="mx-0">
                    <p
                      onClick={onWithdrawToken}
                      className={`m-0 cursor-pointer ${ownershipExpired ? 'text-secondary' : 'text-primary'}`}
                    >
                      <FontAwesomeIcon icon={faArrowAltCircleUp} />{' '}
                      {t('anftDapp.listingComponent.primaryInfo.ownershipManagement.withdrawToken')}
                    </p>
                  </CRow>

                  <CRow className="my-2 mx-0">
                    <p
                      onClick={() => handleModalVisibility(ModalType.OWNERSHIP_EXTENSION, true)}
                      className={`m-0 cursor-pointer text-primary`}
                    >
                      <FontAwesomeIcon icon={faArrowAltCircleDown} />{' '}
                      {t('anftDapp.listingComponent.primaryInfo.ownershipManagement.extendOwnership')}
                    </p>
                  </CRow>
                  <CRow className="mx-0">
                    <CLink to={`/${listingId}/workers-list`} className="text-decoration-none">
                      <FontAwesomeIcon icon={faClipboard} />{' '}
                      {t('anftDapp.listingComponent.primaryInfo.ownershipManagement.workerManagement')}
                    </CLink>
                  </CRow>
                </CCardBody>
              </CCard>
            </CCollapse>
          </CCol>
          {modalsVisibility[ModalType.OWNERSHIP_REGISTER] && (
            <ExtendOwnershipModal
              listingId={listingId}
              isVisible={modalsVisibility[ModalType.OWNERSHIP_REGISTER]}
              modelType={ModalType.OWNERSHIP_REGISTER}
              setVisibility={(key: boolean) => handleModalVisibility(ModalType.OWNERSHIP_REGISTER, key)}
              title={t('anftDapp.listingComponent.primaryInfo.investmentActivities.registerOwnership')}
            />
          )}

          {modalsVisibility[ModalType.OWNERSHIP_EXTENSION] && (
            <ExtendOwnershipModal
              listingId={listingId}
              isVisible={modalsVisibility[ModalType.OWNERSHIP_EXTENSION]}
              modelType={ModalType.OWNERSHIP_EXTENSION}
              setVisibility={(key: boolean) => handleModalVisibility(ModalType.OWNERSHIP_EXTENSION, key)}
              title={t('anftDapp.listingComponent.primaryInfo.ownershipManagement.extendOwnership')}
            />
          )}

          {modalsVisibility[ModalType.OWNERSHIP_WITHDRAW] && (
            <WithdrawTokenModal
              listingId={listingId}
              isVisible={modalsVisibility[ModalType.OWNERSHIP_WITHDRAW]}
              setVisibility={(key: boolean) => handleModalVisibility(ModalType.OWNERSHIP_WITHDRAW, key)}
            />
          )}
          <CheckWorkerModal visible={isCheckWorker} setVisible={setIsCheckWorker} />
        </CRow>
      </CCol>
    </CContainer>
  );
};

export default ListingInfo;
