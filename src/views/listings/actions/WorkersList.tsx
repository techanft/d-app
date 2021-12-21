import CIcon from '@coreui/icons-react';
import { CBadge, CButton, CCard, CCardBody, CCardTitle, CCol, CContainer, CDataTable, CLabel, CPagination, CRow } from '@coreui/react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import bgImg from '../../../assets/img/registerBonus.svg';
import { LISTING_INSTANCE } from '../../../shared/blockchain-helpers';
import { getEllipsisTxt } from '../../../shared/casual-helpers';
import ConfirmModal from '../../../shared/components/ConfirmModal';
import Loading from '../../../shared/components/Loading';
import SubmissionModal from '../../../shared/components/SubmissionModal';
import { ToastError } from '../../../shared/components/Toast';
import { EventType } from '../../../shared/enumeration/eventType';
import { IEvent } from '../../../shared/models/events.model';
import { RootState } from '../../../shared/reducers';
import { getEntity } from '../../assets/assets.api';
import { fetchingEntity, selectEntityById, softReset } from '../../assets/assets.reducer';
import { getEntities, IEventTrackingFilter } from '../../events/events.api';
import { eventsSelectors, fetchingEntities } from '../../events/events.reducer';
import { disableWorkerOwnership, IDisableWorkerBody, IDisableWorkerIntialValues } from '../../transactions/transactions.api';
import { fetching } from '../../transactions/transactions.reducer';
import AddWorkerPermission from './AddWorkerModal';

interface IWorkerListParams {
  [x: string]: string;
}

interface IWorkersList extends RouteComponentProps<IWorkerListParams> {}

const WorkerManagement = (props: IWorkersList) => {
  const { match } = props;
  const { id } = match.params;

  const dispatch = useDispatch();
  const listing = useSelector(selectEntityById(Number(id)));
  const { signer } = useSelector((state: RootState) => state.wallet);
  const { initialState } = useSelector((state: RootState) => state.events);
  const { success, deleteSuccess } = useSelector((state: RootState) => state.transactions);
  const { totalItems, entitiesLoading } = initialState;


  const { selectAll } = eventsSelectors;
  const events = useSelector(selectAll);
  
  console.log(events, 'events');

  const [filterState, setFilterState] = useState<IEventTrackingFilter>({
    page: 0,
    size: 5,
    sort: 'createdDate,desc',
    eventType: EventType.UPDATE_WORKER,
    listingId: id,
  });

  const totalPages = Math.ceil(totalItems / filterState.size);

  const handlePaginationChange = (page: number) => {
    if (page !== 0) {
      window.scrollTo(0, 0);
      setFilterState({ ...filterState, page: page - 1 });
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchingEntity());
      dispatch(getEntity(Number(id)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    dispatch(fetchingEntities());
    dispatch(getEntities(filterState));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filterState), success, deleteSuccess]);

  const titleTableStyle = {
    textAlign: 'left',
    color: '#828282',
    fontSize: '0.875rem',
    lineHeight: '16px',
    fontWeight: '400',
  };
  const fields = [
    { key: 'address', _style: titleTableStyle, label: 'Address' },
    { key: 'status', _style: titleTableStyle, label: 'Status' },
    { key: 'action', _style: titleTableStyle, label: 'Action' },
  ];

  const handleRawFormValues = (input: IDisableWorkerIntialValues): IDisableWorkerBody => {
    if (!listing?.address) {
      throw Error('Error getting listing address');
    }
    if (!signer) {
      throw Error('No Signer found');
    }
    const instance = LISTING_INSTANCE(listing.address, signer);
    if (!instance) {
      throw Error('Error in generating contract instace');
    }
    return {
      eventId: input.eventId,
      type: EventType.UPDATE_WORKER,
      address: input.address,
      contract: instance,
    };
  };

  const [entityToDelete, setEntityToDelete] = useState<IDisableWorkerIntialValues | undefined>(undefined);
  const [delAlrtMdl, setDeltAlrtMdl] = useState<boolean>(false);

  const onDelMldConfrmed = () => {
    if (entityToDelete !== undefined) {
      const initialValues = {
        eventId: entityToDelete.eventId,
        address: entityToDelete.address,
      };
      try {
        const value = handleRawFormValues(initialValues);
        dispatch(fetching());
        dispatch(disableWorkerOwnership(value));
        setDeltAlrtMdl(false);
        setEntityToDelete(undefined);
      } catch (error) {
        console.log(`Error submitting form ${error}`);
        ToastError(`Error submitting form ${error}`);
        dispatch(softReset());
      }
    }
  };
  const onDelMldAbort = () => {
    setEntityToDelete(undefined);
    setDeltAlrtMdl(false);
  };

  const onEntityRemoval = (eventId: number, address: string) => (): void => {
    setDeltAlrtMdl(true);
    setEntityToDelete({ eventId, address });
  };

  const [addWorkerPermission, setAddWorkerPermission] = useState<boolean>(false);

  const setRequestListener = (key: boolean, setRequestState: any) => (): void => setRequestState(key);

  return (
    <CContainer fluid className="mx-0 my-2">
      <SubmissionModal />
      <CRow>
        <CCol xs={12}>
          <CLabel className="text-primary content-title">Danh sách quyền khai thác</CLabel>
        </CCol>
        <CCol xs={12}>
          <CCard className="m-0 listing-img-card">
            <img src={bgImg} alt="listingImg" className="w-100 h-100" />
            <CCardBody className="p-0 listing-card-body">
              <CCardTitle className="listing-card-title mb-0 px-3 py-2 w-100">
                <p className="mb-2 text-white content-title">125 - Hoàn Kiếm - Hà Nội</p>
                <p className="mb-0 text-white detail-title-font">
                  Hoạt động <b>03</b>
                </p>
              </CCardTitle>
            </CCardBody>
          </CCard>
        </CCol>
        <>
          {entitiesLoading && !events.length ? (
            <Loading />
          ) : (
            <>
              <CCol xs={12}>
                <CDataTable
                  striped
                  items={events}
                  fields={fields}
                  responsive
                  hover
                  header
                  scopedSlots={{
                    address: (item: IEvent) => {
                      return <td>{item.eventArgs && item.eventArgs[0] ? getEllipsisTxt(item.eventArgs[0].args?._worker || '_', 10) : '_'}</td>;
                    },
                    status: (item: IEvent) => {
                      return (
                        <td>
                          {item.eventArgs
                            ? (
                                <>
                                  <CBadge color={item.eventArgs[0].args?._isAuthorized ? 'success' : 'danger'}>Active</CBadge>
                                </>
                              ) || '_'
                            : '_'}
                        </td>
                      );
                    },
                    action: (item: IEvent) => {
                      return (
                        <td>
                          <CButton className="text-danger p-0" onClick={onEntityRemoval(item.id, item.eventArgs && item.eventArgs[0] ? item.eventArgs[0].args?._worker || '_' : '_')}>
                            <CIcon name="cil-trash" />
                          </CButton>
                        </td>
                      );
                    },
                  }}
                />
              </CCol>
              {totalPages > 1 && (
                <CPagination disabled={entitiesLoading} activePage={filterState.page + 1} pages={totalPages} onActivePageChange={handlePaginationChange} align="center" className="mt-2" />
              )}
            </>
          )}
        </>

        <CCol xs={12} className="d-flex justify-content-center">
          <CButton className="my-2 px-3 w-100 btn-radius-50 btn-font-style btn-primary" onClick={setRequestListener(true, setAddWorkerPermission)}>
            Thêm quyền sở hữu
          </CButton>
        </CCol>
        <AddWorkerPermission listingId={Number(id)} visible={addWorkerPermission} setVisible={setAddWorkerPermission} />
      </CRow>
      <ConfirmModal
        isVisible={delAlrtMdl}
        color="danger"
        title="Hủy quyền khai thác"
        CustomJSX={() => (
          <p>
            Bạn chắc chắn muốn hủy quyền khai thác của {entityToDelete?.eventId} <span className="text-primary">{entityToDelete?.address || '_'}</span>
          </p>
        )}
        onConfirm={onDelMldConfrmed}
        onAbort={onDelMldAbort}
      />
    </CContainer>
  );
};

export default WorkerManagement;
