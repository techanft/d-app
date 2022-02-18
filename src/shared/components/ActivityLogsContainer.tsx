import { CCol, CNav, CNavItem, CNavLink, CTabContent, CTabPane } from '@coreui/react';
import { ActionCreatorWithoutPayload, AsyncThunk } from '@reduxjs/toolkit';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { IOverviewFilter } from '../../views/logsOverview/LogsOverview';
import {
  getClaimsRecord,
  getOwnershipExtensionRecord,
  getRegisterRecord,
  getUnRegisterRecord,
  getWithdrawRecord,
  getWorkersRecord,
  IRecordParams
} from '../../views/records/records.api';
import {
  fetchingClaim,
  fetchingOwnership,
  fetchingRegister,
  fetchingWithdraw,
  fetchingWorker
} from '../../views/records/records.reducer';
import { RecordType } from '../enumeration/recordType';
import {
  IRecordClaim,
  IRecordOwnership,
  IRecordRegister,
  IRecordUnRegister,
  IRecordWithdraw,
  IRecordWorker
} from '../models/record.model';
import { RootState } from '../reducers';
import ActivityLogsTable from './ActivityLogsTable';

interface IActivityLogsProps {
  shouldDisplayBlockchainAddress: boolean;
  filterState: IOverviewFilter;
}

export type TRecordTypeArray =
  | IRecordClaim
  | IRecordOwnership
  | IRecordRegister
  | IRecordUnRegister
  | IRecordWorker
  | IRecordWithdraw;

// export type TAsyncThunkRecord<T> = AsyncThunk<IGetAllResp<T>, IRecordParams, {}>;
export type TAsyncThunkRecord<T> = AsyncThunk<any, IRecordParams, {}>; // Typescript error

type TRecordTypeMappingApi = {
  [RecordType.REGISTER]: TAsyncThunkRecord<IRecordRegister>;
  [RecordType.UNREGISTER]: TAsyncThunkRecord<IRecordUnRegister>;
  [RecordType.CLAIM]: TAsyncThunkRecord<IRecordClaim>;
  [RecordType.WITHDRAW]: TAsyncThunkRecord<IRecordWithdraw>;
  [RecordType.OWNERSHIP_EXTENSION]: TAsyncThunkRecord<IRecordOwnership>;
  [RecordType.UPDATE_WORKER]: TAsyncThunkRecord<IRecordWorker>;
};

type TRecordTypeMappingFetch = { [key in RecordType]: ActionCreatorWithoutPayload<string> };

type TRecordTypeMappingTotal = { [key in RecordType]: number };

type TRecordTypeMappingResult = { [key in RecordType]: Array<TRecordTypeArray> };

const recordTypeMapingApi: TRecordTypeMappingApi = {
  [RecordType.REGISTER]: getRegisterRecord,
  [RecordType.UNREGISTER]: getUnRegisterRecord,
  [RecordType.CLAIM]: getClaimsRecord,
  [RecordType.WITHDRAW]: getWithdrawRecord,
  [RecordType.OWNERSHIP_EXTENSION]: getOwnershipExtensionRecord,
  [RecordType.UPDATE_WORKER]: getWorkersRecord,
};

const recordTypeMapingFetching: TRecordTypeMappingFetch = {
  [RecordType.REGISTER]: fetchingRegister,
  [RecordType.UNREGISTER]: fetchingRegister,
  [RecordType.CLAIM]: fetchingClaim,
  [RecordType.WITHDRAW]: fetchingWithdraw,
  [RecordType.OWNERSHIP_EXTENSION]: fetchingOwnership,
  [RecordType.UPDATE_WORKER]: fetchingWorker,
};

export enum TableType {
  OWNERSHIP = 'OWNERSHIP',
  INVESTMENT = 'INVESTMENT',
}

type TTableMappingSetFilter = { [key in TableType]: React.Dispatch<React.SetStateAction<IRecordParams>> };

type TTableMappingSetTab = { [key in TableType]: React.Dispatch<React.SetStateAction<RecordType>> };

const ActivityLogsContainer = (props: IActivityLogsProps) => {
  const { shouldDisplayBlockchainAddress, filterState } = props;
  const scrollRef = useRef<null | HTMLParagraphElement>(null);
  const dispatch = useDispatch();
  const location = useLocation();
  const isLogOverview = location.pathname === '/logs-overview';
  const { signerAddress } = useSelector((state: RootState) => state.wallet);

  const { initialState } = useSelector((state: RootState) => state.records);

  const { t } = useTranslation();

  const { loading: registerLoading, registers } = initialState.registerInitialState;
  const { loading: unregisterLoading, unregisters } = initialState.unregisterInitialState;
  const { loading: claimLoading, claims } = initialState.claimInitialState;
  const { loading: withdrawLoading, withdraws } = initialState.withdrawInitialState;
  const { loading: ownershipLoading, ownerships } = initialState.ownershipInitialState;

  const [tableType, setTableType] = useState<TableType>(TableType.INVESTMENT);

  const [investmentActiveTab, setInvestmentActiveTab] = useState<RecordType>(RecordType.REGISTER);
  const [ownershipActiveTab, setOwnershipActiveTab] = useState<RecordType>(RecordType.WITHDRAW);

  const activeTabMappingChange: TTableMappingSetTab = {
    [TableType.OWNERSHIP]: setOwnershipActiveTab,
    [TableType.INVESTMENT]: setInvestmentActiveTab,
  };

  const [investmentFilterState, setInvestmentFilterState] = useState<IRecordParams>({
    page: 0,
    size: 10,
    sort: 'createdDate,desc',
  });

  const [ownershipFilterState, setOwnershipFilterState] = useState<IRecordParams>({
    page: 0,
    size: 10,
    sort: 'createdDate,desc',
  });

  const filterMappingChange: TTableMappingSetFilter = {
    [TableType.OWNERSHIP]: setOwnershipFilterState,
    [TableType.INVESTMENT]: setInvestmentFilterState,
  };

  const recordResultMapping: TRecordTypeMappingResult = {
    [RecordType.REGISTER]: registers?.results || [],
    [RecordType.UNREGISTER]: unregisters?.results || [],
    [RecordType.CLAIM]: claims?.results || [],
    [RecordType.WITHDRAW]: withdraws?.results || [],
    [RecordType.OWNERSHIP_EXTENSION]: ownerships?.results || [],
    [RecordType.UPDATE_WORKER]: [],
  };

  const totalRecordMapping: TRecordTypeMappingTotal = {
    [RecordType.REGISTER]: registers?.count || 0,
    [RecordType.UNREGISTER]: unregisters?.count || 0,
    [RecordType.CLAIM]: claims?.count || 0,
    [RecordType.WITHDRAW]: withdraws?.count || 0,
    [RecordType.OWNERSHIP_EXTENSION]: ownerships?.count || 0,
    [RecordType.UPDATE_WORKER]: 0,
  };

  const totalInvestmentPages = Math.ceil(totalRecordMapping[investmentActiveTab] / investmentFilterState.size);

  const totalOwnershipPages = Math.ceil(totalRecordMapping[ownershipActiveTab] / ownershipFilterState.size);

  const handlePaginationChange = (page: number, type: TableType) => {
    if (page !== 0) {
      window.scrollTo(0, 0);
      filterMappingChange[type]((prevState) => {
        return {
          ...prevState,
          page: page - 1,
        };
      });
    }
  };

  const onTableTypeChange = (tableType: TableType) => () => {
    setTableType(tableType);
  };

  const onTabChange = (recordType: RecordType, tableType: TableType) => () => {
    filterMappingChange[tableType]((prevState) => {
      return {
        ...prevState,
        page: 0,
      };
    });
    activeTabMappingChange[tableType](recordType);
  };

  useEffect(() => {
    scrollRef.current && scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [initialState]);

  useEffect(() => {
    if (!signerAddress) return;
    if (!isLogOverview && !filterState.listingAddress) return;
    const additionalInvestmentFilterParams = {
      ...investmentFilterState,
      ...filterState,
      stakeholder: signerAddress,
    };
    const recordFetchingFunc = recordTypeMapingFetching[investmentActiveTab];
    const recordApiFunc = recordTypeMapingApi[investmentActiveTab];
    dispatch(recordFetchingFunc());
    dispatch(recordApiFunc(additionalInvestmentFilterParams));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(investmentFilterState), JSON.stringify(filterState), investmentActiveTab, signerAddress]);

  useEffect(() => {
    if (!signerAddress) return;
    if (!isLogOverview && !filterState.listingAddress) return;
    
    const additionalOwnerFilterParams =
      ownershipActiveTab === RecordType.OWNERSHIP_EXTENSION ? { newOwner: signerAddress } : { owner: signerAddress };
    const filter = {
      ...ownershipFilterState,
      ...additionalOwnerFilterParams,
      ...filterState,
    };
    const recordFetchingFunc = recordTypeMapingFetching[ownershipActiveTab];
    const recordApiFunc = recordTypeMapingApi[ownershipActiveTab];
    dispatch(recordFetchingFunc());
    dispatch(recordApiFunc(filter));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(ownershipFilterState), JSON.stringify(filterState), ownershipActiveTab, signerAddress]);

  return (
    <>
      {signerAddress ? (
        <>
          <CCol xs={12}>
            <CNav variant="" className={'activity-log-table-nav my-3'}>
              <CNavItem className="col-6 p-0">
                <CNavLink
                  onClick={onTableTypeChange(TableType.INVESTMENT)}
                  active={tableType === TableType.INVESTMENT}
                  className="content-title px-0 text-center font-weight-bold"
                >
                  {t('anftDapp.activityLogsComponent.investment')}
                </CNavLink>
              </CNavItem>
              <CNavItem className="col-6 p-0">
                <CNavLink
                  onClick={onTableTypeChange(TableType.OWNERSHIP)}
                  active={tableType === TableType.OWNERSHIP}
                  className="content-title px-0 text-center font-weight-bold"
                >
                  {t('anftDapp.activityLogsComponent.ownership')}
                </CNavLink>
              </CNavItem>
            </CNav>
          </CCol>
          <CCol xs={12}>
            <CTabContent>
              <CTabPane active={tableType === TableType.INVESTMENT}>
                <CNav variant="tabs">
                  <CNavItem className="col-4 p-0">
                    <CNavLink
                      onClick={onTabChange(RecordType.REGISTER, TableType.INVESTMENT)}
                      active={investmentActiveTab === RecordType.REGISTER}
                      className="detail-title-font px-0 text-center text-primary"
                    >
                      {t('anftDapp.registerComponent.register')}
                    </CNavLink>
                  </CNavItem>
                  <CNavItem className="col-4 p-0">
                    <CNavLink
                      onClick={onTabChange(RecordType.UNREGISTER, TableType.INVESTMENT)}
                      active={investmentActiveTab === RecordType.UNREGISTER}
                      className="detail-title-font px-0 text-center text-primary"
                    >
                      {t('anftDapp.registerComponent.unregister.unregister')}
                    </CNavLink>
                  </CNavItem>
                  <CNavItem className="col-4 p-0">
                    <CNavLink
                      onClick={onTabChange(RecordType.CLAIM, TableType.INVESTMENT)}
                      active={investmentActiveTab === RecordType.CLAIM}
                      className="detail-title-font px-0 text-center text-primary"
                    >
                      {t('anftDapp.registerComponent.claimReward.claimReward')}
                    </CNavLink>
                  </CNavItem>
                </CNav>
                <CTabContent className="mt-3">
                  <CTabPane active={investmentActiveTab === RecordType.REGISTER}>
                    <ActivityLogsTable
                      shouldDisplayBlockchainAddress={shouldDisplayBlockchainAddress}
                      results={recordResultMapping[RecordType.REGISTER]}
                      filterState={investmentFilterState}
                      recordType={RecordType.REGISTER}
                      totalPages={totalInvestmentPages}
                      loading={registerLoading}
                      tableType={TableType.INVESTMENT}
                      handlePaginationChange={handlePaginationChange}
                    />
                  </CTabPane>
                  <CTabPane active={investmentActiveTab === RecordType.UNREGISTER}>
                    <ActivityLogsTable
                      shouldDisplayBlockchainAddress={shouldDisplayBlockchainAddress}
                      results={recordResultMapping[RecordType.UNREGISTER]}
                      filterState={investmentFilterState}
                      recordType={RecordType.UNREGISTER}
                      totalPages={totalInvestmentPages}
                      loading={unregisterLoading}
                      tableType={TableType.INVESTMENT}
                      handlePaginationChange={handlePaginationChange}
                    />
                  </CTabPane>
                  <CTabPane active={investmentActiveTab === RecordType.CLAIM}>
                    <ActivityLogsTable
                      shouldDisplayBlockchainAddress={shouldDisplayBlockchainAddress}
                      results={recordResultMapping[RecordType.CLAIM]}
                      filterState={investmentFilterState}
                      recordType={RecordType.CLAIM}
                      totalPages={totalInvestmentPages}
                      loading={claimLoading}
                      tableType={TableType.INVESTMENT}
                      handlePaginationChange={handlePaginationChange}
                    />
                  </CTabPane>
                </CTabContent>
              </CTabPane>
              <CTabPane active={tableType === TableType.OWNERSHIP}>
                <CNav variant="tabs">
                  <CNavItem className="col-4 p-0">
                    <CNavLink
                      onClick={onTabChange(RecordType.WITHDRAW, TableType.OWNERSHIP)}
                      active={ownershipActiveTab === RecordType.WITHDRAW}
                      className="detail-title-font px-0 text-center text-primary"
                    >
                      {t('anftDapp.listingComponent.primaryInfo.ownershipManagement.withdrawToken')}
                    </CNavLink>
                  </CNavItem>
                  <CNavItem className="col-4 p-0">
                    <CNavLink
                      onClick={onTabChange(RecordType.OWNERSHIP_EXTENSION, TableType.OWNERSHIP)}
                      active={ownershipActiveTab === RecordType.OWNERSHIP_EXTENSION}
                      className="detail-title-font px-0 text-center text-primary"
                    >
                      {t('anftDapp.listingComponent.primaryInfo.ownershipManagement.extendOwnership')}
                    </CNavLink>
                  </CNavItem>
                </CNav>
                <CTabContent className="mt-3">
                  <CTabPane active={ownershipActiveTab === RecordType.WITHDRAW}>
                    <ActivityLogsTable
                      shouldDisplayBlockchainAddress={shouldDisplayBlockchainAddress}
                      results={recordResultMapping[RecordType.WITHDRAW]}
                      filterState={ownershipFilterState}
                      recordType={RecordType.WITHDRAW}
                      totalPages={totalOwnershipPages}
                      loading={withdrawLoading}
                      tableType={TableType.OWNERSHIP}
                      handlePaginationChange={handlePaginationChange}
                    />
                  </CTabPane>
                  <CTabPane active={ownershipActiveTab === RecordType.OWNERSHIP_EXTENSION}>
                    <ActivityLogsTable
                      shouldDisplayBlockchainAddress={shouldDisplayBlockchainAddress}
                      results={recordResultMapping[RecordType.OWNERSHIP_EXTENSION]}
                      filterState={ownershipFilterState}
                      recordType={RecordType.OWNERSHIP_EXTENSION}
                      totalPages={totalOwnershipPages}
                      loading={ownershipLoading}
                      tableType={TableType.OWNERSHIP}
                      handlePaginationChange={handlePaginationChange}
                    />
                  </CTabPane>
                </CTabContent>
              </CTabPane>
            </CTabContent>
          </CCol>
        </>
      ) : (
        <CCol xs={12}>
          <div className="alert alert-warning my-3">
            <span>{t('anftDapp.activityLogsComponent.pleaseConnectWallet')}</span>
          </div>
        </CCol>
      )}
    </>
  );
};

export default ActivityLogsContainer;
