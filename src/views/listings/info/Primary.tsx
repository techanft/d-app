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
  CRow
} from '@coreui/react';
import {
  faArrowAltCircleDown,
  faArrowAltCircleUp,
  faClipboard,
  faDonate,
  faEdit,
  faIdBadge
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { TOKEN_SYMBOL } from '../../../config/constants';
import {
  checkOwnershipExpired,
  convertUnixToDate,
  formatBNToken,
  formatLocalDatetime,
  getEllipsisTxt
} from '../../../shared/casual-helpers';
import ConfirmationLoading from '../../../shared/components/ConfirmationLoading';
import CopyTextToClipBoard from '../../../shared/components/CopyTextToClipboard';
import InfoLoader from '../../../shared/components/InfoLoader';
import { ToastError } from '../../../shared/components/Toast';
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

const ownershipText = (viewerAddr: string | undefined, listingInfo: IAsset) => {
  const { ownership, owner } = listingInfo;
  if (!ownership || !owner) return '';

  const viewerIsOwner = viewerAddr === owner;
  const ownershipExpired = checkOwnershipExpired(ownership.toNumber());

  let textClassname;
  let textContent;

  if (viewerIsOwner && !ownershipExpired) {
    textClassname = 'text-success';
    textContent = 'Đã sở hữu';
  } else if (viewerIsOwner && ownershipExpired) {
    textClassname = 'text-danger';
    textContent = 'Đã hết hạn sở hữu. Listing có thể bị chiếm bởi người khác!';
  } else if (!viewerIsOwner && !ownershipExpired) {
    textClassname = 'text-danger';
    textContent = 'Đã có chủ sở hữu';
  } else if (!viewerIsOwner && ownershipExpired) {
    textClassname = 'text-success';
    textContent = 'Có thể sở hữu';
  }

  return <p className={`ownership-checked m-0 ${textClassname}`}>{textContent}</p>;
};
interface IListingInfoProps {
  listingId: number;
}

const titleTableStyle = {
  textAlign: 'left',
  color: '#828282',
  fontSize: '0.875rem',
  lineHeight: '16px',
  fontWeight: '400',
};

const workerFields = [
  {
    key: 'address',
    _style: titleTableStyle,
    label: 'Address',
  },
  {
    key: 'createdDate',
    _style: titleTableStyle,
    label: 'Since',
  },
];

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
  const viewerIsOwner = Boolean(signerAddress && signerAddress === listing?.owner);

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
    if (!signerAddress && !viewingWorkerList) return ToastError('Please connect your wallet!');
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
    if (!ownershipExpired) return ToastError('This listing is being owned by another address!');
    handleModalVisibility(ModalType.OWNERSHIP_REGISTER, true);
  };

  const onWithdrawToken = () => {
    if (ownershipExpired) return ToastError('No more token to withdraw!');
    handleModalVisibility(ModalType.OWNERSHIP_WITHDRAW, true);
  };

  return (
    <CContainer fluid className="px-0">
      <CCol xs={12} className="p-0">
        {!entityLoading && listing ? (
          <img src={listing.images} className="w-100 h-100" alt="listingImg" />
        ) : (
          // Ensuring 16:9 ratio for image and image loader
          <InfoLoader width={screenWidth} height={screenWidth / 1.77} />
        )}
      </CCol>

      <CCol className="m-0 p-0">
        <CRow className="listing-address-info m-0 p-0">
          <CCol xs={12} className="text-dark btn-font-style mt-3">
            202 Yên Sở - Hoàng Mai - Hà Nội
          </CCol>

          <CCol xs={12} className="text-primary total-token my-3">
            {!entityLoading && listing ? (
              <p className="m-0">
                {formatBNToken(listing.value, false)} <span className="token-name">{TOKEN_SYMBOL}</span>
              </p>
            ) : (
              <InfoLoader width={300} height={29} />
            )}
          </CCol>

          <CCol xs={12} className=" mb-3">
            {!entityLoading && listing?.ownership ? (
              ownershipText(signerAddress, listing)
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
            <p className="detail-title-font my-2">Blockchain address</p>

            {!entityLoading && listing?.address ? (
              <CopyTextToClipBoard text={listing.address} inputClassName="my-2 value-text copy-address" />
            ) : (
              <InfoLoader width={155} height={27} />
            )}
          </CCol>

          <CCol xs={6}>
            <p className="detail-title-font my-2">The current owner</p>

            {!entityLoading && listing?.owner ? (
              <CopyTextToClipBoard text={listing.owner} inputClassName="my-2 value-text copy-address" />
            ) : (
              <InfoLoader width={155} height={27} />
            )}
          </CCol>

          <CCol xs={6}>
            <p className="detail-title-font my-2">Sở hữu tới </p>
            {!entityLoading && listing?.ownership ? (
              <p className={`my-2 value-text ${ownershipExpired ? 'text-danger' : 'text-success'}`}>
                {convertUnixToDate(listing.ownership.toNumber())}
              </p>
            ) : (
              <InfoLoader width={155} height={27} />
            )}
          </CCol>

          <CCol xs={6}>
            <p className="detail-title-font my-2">Daily payment</p>

            {!entityLoading && listing?.dailyPayment ? (
              <p className="my-2 value-text">
                {formatBNToken(listing.dailyPayment, false)} <span className="token-name">ANFT</span>
              </p>
            ) : (
              <InfoLoader width={155} height={27} />
            )}
          </CCol>

          <CCol xs={6}>
            <p className="detail-title-font my-2">Total Stake</p>
            {!entityLoading && listing?.totalStake ? (
              <p className="text-primary my-2 value-text">
                {formatBNToken(listing.totalStake, false)} <span className="token-name">ANFT</span>
              </p>
            ) : (
              <InfoLoader width={155} height={27} />
            )}
          </CCol>

          <CCol xs={6}>
            <p className="detail-title-font my-2">Workers count</p>
            {!loadingWorkers && workers ? (
              <p className="my-2 value-text">{workers.count}</p>
            ) : (
              <InfoLoader width={155} height={27} />
            )}
          </CCol>

          <CCol xs={12} className="text-center">
            <p className="text-primary my-2" onClick={toggleCollapseVisibility(CollapseType.WORKER_LIST)}>
              <FontAwesomeIcon icon={faIdBadge} /> <u>Xem quyền khai thác</u>
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
                    responsive
                    hover
                    header
                    scopedSlots={{
                      address: (item: IRecordWorker) => {
                        return <td>{getEllipsisTxt(item.worker, 10) || '_'}</td>;
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
            >
              Hoạt động đầu tư
            </CButton>
          </CCol>

          <CCol xs={12}>
            <CCollapse show={collapseVisibility.INVESTMENT}>
              <CCard className="activities-card mt-2 mb-0">
                <CCardBody className="p-2">
                  <CRow className="mx-0">
                    <p
                      onClick={onRegisteringOwnership}
                      className={`m-0 ${viewerIsOwner || !ownershipExpired ? 'text-secondary' : 'text-primary'}`}
                    >
                      <FontAwesomeIcon icon={faEdit} /> Đăng ký sở hữu
                    </p>
                  </CRow>
                  <CRow className="mt-2 mx-0">
                    <CLink to={`/listings/${listingId}/register`}>
                      <FontAwesomeIcon icon={faDonate} /> Đăng ký nhận thưởng
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
            >
              Quản lý sở hữu
            </CButton>
          </CCol>

          <CCol xs={12}>
            <CCollapse show={collapseVisibility.MANAGEMENT}>
              <CCard className="mt-2 activities-card mb-0">
                <CCardBody className="p-2">
                  <CRow className="mx-0">
                    <p
                      onClick={onWithdrawToken}
                      className={`m-0 ${ownershipExpired ? 'text-secondary' : 'text-primary'}`}
                    >
                      <FontAwesomeIcon icon={faArrowAltCircleUp} /> Rút ANFT
                    </p>
                  </CRow>

                  <CRow className="my-2 mx-0">
                    <p
                      onClick={() => handleModalVisibility(ModalType.OWNERSHIP_EXTENSION, true)}
                      className={`m-0 text-primary`}
                    >
                      <FontAwesomeIcon icon={faArrowAltCircleDown} /> Nạp thêm
                    </p>
                  </CRow>
                  <CRow className="mx-0">
                    <CLink to={`/${listingId}/workers-list`}>
                      <FontAwesomeIcon icon={faClipboard} /> Quản lý quyền khai thác
                    </CLink>
                  </CRow>
                </CCardBody>
              </CCard>
            </CCollapse>
          </CCol>
          {modalsVisibility[ModalType.OWNERSHIP_EXTENSION] && (
            <ExtendOwnershipModal
              listingId={listingId}
              isVisible={modalsVisibility[ModalType.OWNERSHIP_REGISTER]}
              modelType={ModalType.OWNERSHIP_REGISTER}
              setVisibility={(key: boolean) => handleModalVisibility(ModalType.OWNERSHIP_REGISTER, key)}
              title="Đăng ký sở hữu"
            />
          )}

          {modalsVisibility[ModalType.OWNERSHIP_EXTENSION] && (
            <ExtendOwnershipModal
              listingId={listingId}
              isVisible={modalsVisibility[ModalType.OWNERSHIP_EXTENSION]}
              modelType={ModalType.OWNERSHIP_EXTENSION}
              setVisibility={(key: boolean) => handleModalVisibility(ModalType.OWNERSHIP_EXTENSION, key)}
              title="Nạp ANFT"
            />
          )}

          {modalsVisibility[ModalType.OWNERSHIP_WITHDRAW] && (
            <WithdrawTokenModal
              listingId={listingId}
              isVisible={modalsVisibility[ModalType.OWNERSHIP_WITHDRAW]}
              setVisibility={(key: boolean) => handleModalVisibility(ModalType.OWNERSHIP_WITHDRAW, key)}
            />
          )}
        </CRow>
      </CCol>
    </CContainer>
  );
};

export default ListingInfo;
