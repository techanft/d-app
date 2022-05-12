import CIcon from '@coreui/icons-react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardTitle,
  CCol,
  CContainer,
  CDataTable,
  CLabel,
  CPagination,
  CRow,
} from '@coreui/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { LISTING_INSTANCE } from '../../../shared/blockchain-helpers';
import { getEllipsisTxt, returnTheFirstImage, validateOwnership } from '../../../shared/casual-helpers';
import ConfirmationLoading from '../../../shared/components/ConfirmationLoading';
import ConfirmModal from '../../../shared/components/ConfirmModal';
import CopyTextToClipBoard from '../../../shared/components/CopyTextToClipboard';
import InfoLoader from '../../../shared/components/InfoLoader';
import Loading from '../../../shared/components/Loading';
import SubmissionModal from '../../../shared/components/SubmissionModal';
import { ToastError } from '../../../shared/components/Toast';
import { EventType } from '../../../shared/enumeration/eventType';
import useWindowDimensions from '../../../shared/hooks/useWindowDimensions';
import { IParams } from '../../../shared/models/base.model';
import { IRecordWorker } from '../../../shared/models/record.model';
import { RootState } from '../../../shared/reducers';
import { getEntity } from '../../assets/assets.api';
import { fetchingEntity, selectEntityById, softReset } from '../../assets/assets.reducer';
import { getWorkersRecord } from '../../records/records.api';
import { fetchingWorker, softResetWorker } from '../../records/records.reducer';
import { baseSetterArgs } from '../../transactions/settersMapping';
import { IProceedTxBody, proceedTransaction } from '../../transactions/transactions.api';
import { fetching, hardReset } from '../../transactions/transactions.reducer';
import AddWorkerPermission from './AddWorkerModal';

interface IWorkerListParams {
  [x: string]: string;
}

interface IWorkersList extends RouteComponentProps<IWorkerListParams> {}

const titleTableStyle = {
  textAlign: 'left',
  color: '#828282',
  fontSize: '0.875rem',
  lineHeight: '16px',
  fontWeight: '400',
};

const WorkersList = (props: IWorkersList) => {
  const { match, history } = props;
  const { id } = match.params;

  const dispatch = useDispatch();
  const listing = useSelector(selectEntityById(Number(id)));
  const { signer, provider, signerAddress } = useSelector((state: RootState) => state.wallet);
  const { initialState } = useSelector((state: RootState) => state.records);
  const { success, submitted, errorMessage } = useSelector((state: RootState) => state.transactions);
  const { loading, workers, errorMessage: workerErrorMessage } = initialState.workerInitialState;
  const { initialState: assetsInitialState } = useSelector((state: RootState) => state.assets);
  const { entityLoading } = assetsInitialState;

  const { width: screenWidth } = useWindowDimensions();
  const { t } = useTranslation();

  const fields = [
    {
      key: 'address',
      _style: { ...titleTableStyle, textAlign: 'left' },
      label: `${t('anftDapp.workersListComponent.address')}`,
    },
    {
      key: 'action',
      _style: { ...titleTableStyle, textAlign: 'center' },
      label: `${t('anftDapp.workersListComponent.action')}`,
    },
  ];

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

  useEffect(() => {
    if (submitted) {
      setDeltAlrtMdl(false);
    }
  }, [submitted]);

  useEffect(() => {
    if (errorMessage) {
      setDeltAlrtMdl(false);
      setIsFormSubmitted(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorMessage]);

  useEffect(() => {
    if (!id || !provider) return;
    dispatch(fetchingEntity());
    dispatch(getEntity({ id: Number(id), provider }));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (success && listing?.address) {
      const refetchTimer = window.setTimeout(() => {
        const filter = { ...filterState, listingAddress: listing.address };
        dispatch(fetchingWorker());
        dispatch(getWorkersRecord(filter));
        dispatch(hardReset());
      }, 5000);
      return () => window.clearTimeout(refetchTimer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]);

  useEffect(() => {
    if (listing?.address) {
      const filter = { ...filterState, listingAddress: listing.address };
      dispatch(fetchingWorker());
      dispatch(getWorkersRecord(filter));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filterState), listing?.address]);

  const handleRawFormValues = (input: string): IProceedTxBody => {
    if (!listing?.address) {
      throw Error('Error getting listing address');
    }
    if (!signer) {
      throw Error('No Signer found');
    }
    const instance = LISTING_INSTANCE({ address: listing.address, signer });
    if (!instance) {
      throw Error('Error in generating contract instance');
    }

    const output: IProceedTxBody = {
      listingId: Number(id),
      contract: instance,
      type: EventType.UPDATE_WORKER,
      args: { ...baseSetterArgs, _worker: input },
    };

    return output;
  };

  const [entityToDelete, setEntityToDelete] = useState<string>('');
  const [delAlrtMdl, setDeltAlrtMdl] = useState<boolean>(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState<Boolean>(false);

  const onDelMldConfrmed = () => {
    if (isFormSubmitted) return;
    if (entityToDelete !== undefined) {
      try {
        setIsFormSubmitted(true);
        const value = handleRawFormValues(entityToDelete);
        dispatch(fetching());
        dispatch(proceedTransaction(value));
      } catch (error) {
        ToastError(`${t('anftDapp.global.errors.errorSubmittingForm')}: ${error}`);
        dispatch(softReset());
        setIsFormSubmitted(false);
      }
    }
  };
  const onDelMldAbort = () => {
    setEntityToDelete('');
    setDeltAlrtMdl(false);
    setIsFormSubmitted(false);
  };

  const onEntityRemoval = (address: string) => (): void => {
    setDeltAlrtMdl(true);
    setEntityToDelete(address);
  };

  const [addWorkerPermission, setAddWorkerPermission] = useState<boolean>(false);

  type TSetAWPModal = React.Dispatch<React.SetStateAction<boolean>>;

  const setRequestListener = (key: boolean, setRequestState: TSetAWPModal) => (): void => setRequestState(key);

  const isLoadingTransaction = (submitted && !success) || (success && !loading);

  return (
    <CContainer fluid className="mx-0 my-2">
      <SubmissionModal />
      <CRow>
        <CCol xs={12}>
          <CButton className="text-primary p-0 pb-1 ">
            <CIcon name="cil-arrow-circle-left" onClick={() => history.goBack()} size="lg" />
          </CButton>
          <CLabel className="text-primary content-title ml-1">{t('anftDapp.workersListComponent.workersList')}</CLabel>
        </CCol>
        <CCol xs={12}>
          <CCard className="mt-1 listing-img-card mb-0">
            {!entityLoading && listing ? (
              <img src={returnTheFirstImage(listing.images)} alt="listingImg" className="w-100 h-100" />
            ) : (
              // Ensuring 16:9 ratio for image and image loader
              <InfoLoader width={screenWidth} height={screenWidth / 1.77} />
            )}
            <CCardBody className="p-0 listing-card-body">
              <CCardTitle className="listing-card-title mb-0 px-3 py-2 w-100">
                <p className="mb-2 text-white content-title">{listing?.name ? listing.name : '_'}</p>
                <p className="mb-0 text-white detail-title-font">
                  {t('anftDapp.listingComponent.primaryInfo.workersCount')} <b>{workers?.count || 0}</b>
                </p>
              </CCardTitle>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12}>
          {loading && !workers?.results.length ? (
            <Loading />
          ) : (
            <>
              {isLoadingTransaction ? (
                <CCol xs={12} className="d-flex justify-content-center my-2">
                  <ConfirmationLoading />
                </CCol>
              ) : (
                ''
              )}
              <CDataTable
                striped
                items={workers?.results}
                fields={fields}
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
                  action: (item: IRecordWorker) => {
                    return (
                      <td className="text-center">
                        {!isLoadingTransaction ? (
                          <CButton
                            className="text-danger p-0"
                            disabled={listing ? !validateOwnership(signerAddress, listing) : true}
                            onClick={onEntityRemoval(item.worker || '_')}
                          >
                            <CIcon name="cil-trash" />
                          </CButton>
                        ) : (
                          <CIcon name="cil-trash" />
                        )}
                      </td>
                    );
                  },
                }}
              />
            </>
          )}
          {totalPages > 1 && (
            <CPagination
              disabled={loading}
              activePage={filterState.page + 1}
              pages={totalPages}
              onActivePageChange={handlePaginationChange}
              align="center"
              className="mt-2"
            />
          )}
        </CCol>
        <CCol xs={12} className="d-flex justify-content-center">
          <CButton
            className="my-2 px-3 w-100 btn-radius-50 btn-font-style btn-primary"
            onClick={setRequestListener(true, setAddWorkerPermission)}
            disabled={listing ? !validateOwnership(signerAddress, listing) : true}
          >
            {t('anftDapp.workersListComponent.addWorkerPermission')}
          </CButton>
        </CCol>
        <AddWorkerPermission listingId={Number(id)} visible={addWorkerPermission} setVisible={setAddWorkerPermission} />
      </CRow>
      <ConfirmModal
        isVisible={delAlrtMdl}
        color="danger"
        title={t('anftDapp.workersListComponent.deltWorkerPermission')}
        CustomJSX={() => (
          <p>
            {entityToDelete && (
              <>
                {t('anftDapp.workersListComponent.confirmDeltWorkerPermission')}{' '}
                <span className="text-primary">{getEllipsisTxt(entityToDelete, 6) || '_'}</span>?
              </>
            )}
          </p>
        )}
        onConfirm={onDelMldConfrmed}
        onAbort={onDelMldAbort}
      />
    </CContainer>
  );
};

export default WorkersList;
