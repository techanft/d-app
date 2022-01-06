import { CCol, CContainer, CNav, CNavItem, CNavLink, CRow, CTabContent, CTabPane } from '@coreui/react';
import { ActionCreatorWithoutPayload, AsyncThunk } from '@reduxjs/toolkit';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { RecordType } from '../../../shared/enumeration/recordType';
import {
  IRecordClaim,
  IRecordOwnership,
  IRecordRegister,
  IRecordUnRegister,
  IRecordWithdraw,
  IRecordWorker
} from '../../../shared/models/record.model';
import { RootState } from '../../../shared/reducers';
import { getEntity } from '../../assets/assets.api';
import { fetchingEntity, selectEntityById } from '../../assets/assets.reducer';
import {
  getClaimsRecord,
  getOwnershipExtensionRecord,
  getRegisterRecord,
  getUnRegisterRecord,
  getWithdrawRecord,
  getWorkersRecord,
  IRecordParams
} from '../../records/records.api';
import {
  fetchingClaim,
  fetchingOwnership,
  fetchingRegister,
  fetchingWithdraw,
  fetchingWorker
} from '../../records/records.reducer';
import '../index.scss';
import ActivityLogsTable from './ActivityLogsTable';

interface IActivityLogsParams {
  [x: string]: string;
}

export type TRecordTypeArray =
  | IRecordClaim
  | IRecordOwnership
  | IRecordRegister
  | IRecordUnRegister
  | IRecordWorker
  | IRecordWithdraw;

type TRecordTypeMappingApi = { [key in RecordType]: AsyncThunk<unknown, IRecordParams, {}> };

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

interface IActivityLogs extends RouteComponentProps<IActivityLogsParams> {}

const ActivityLogs = (props: IActivityLogs) => {
  const { match } = props;
  const { id } = match.params;
  const dispatch = useDispatch();
  const listing = useSelector(selectEntityById(Number(id)));
  const { signerAddress, provider } = useSelector((state: RootState) => state.wallet);

  const { initialState } = useSelector((state: RootState) => state.records);

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
    if (!id || !provider) return;
    dispatch(fetchingEntity());
    dispatch(getEntity({ id: Number(id), provider }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (!listing?.address || !signerAddress) return;
    const additionalInvestmentFilterParams = {
      ...investmentFilterState,
      listingAddress: listing.address,
      stakeholder: signerAddress,
    };
    const recordFetchingFunc = recordTypeMapingFetching[investmentActiveTab];
    const recordApiFunc = recordTypeMapingApi[investmentActiveTab];
    dispatch(recordFetchingFunc());
    dispatch(recordApiFunc(additionalInvestmentFilterParams));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(investmentFilterState), listing?.address, investmentActiveTab, signerAddress]);

  useEffect(() => {
    if (!listing?.address || !signerAddress) return;
    const additionalOwnerFilterParams =
      ownershipActiveTab === RecordType.OWNERSHIP_EXTENSION ? { newOwner: signerAddress } : { owner: signerAddress };
    const filter = { ...ownershipFilterState, ...additionalOwnerFilterParams, listingAddress: listing.address };
    const recordFetchingFunc = recordTypeMapingFetching[ownershipActiveTab];
    const recordApiFunc = recordTypeMapingApi[ownershipActiveTab];
    dispatch(recordFetchingFunc());
    dispatch(recordApiFunc(filter));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(ownershipFilterState), listing?.address, ownershipActiveTab, signerAddress]);

  return (
    <CContainer fluid className="mx-0 my-2">
      <CRow>
        <CCol xs={12}>
          <CNav variant="" className={'activityLogTableNav'}>
            <CNavItem className="col-4 p-0">
              <CNavLink
                onClick={onTableTypeChange(TableType.INVESTMENT)}
                active={tableType === TableType.INVESTMENT}
                className="content-title px-0 text-center"
              >
                Investment
              </CNavLink>
            </CNavItem>
            <CNavItem className="col-4 p-0">
              <CNavLink
                onClick={onTableTypeChange(TableType.OWNERSHIP)}
                active={tableType === TableType.OWNERSHIP}
                className="content-title px-0 text-center"
              >
                Ownership
              </CNavLink>
            </CNavItem>
          </CNav>
        </CCol>
        <CCol xs={12}>
          <p className="header-title content-title my-2">Activity Logs</p>
          <CTabContent>
            <CTabPane active={tableType === TableType.INVESTMENT}>
              <CNav variant="tabs">
                <CNavItem className="col-4 p-0">
                  <CNavLink
                    onClick={onTabChange(RecordType.REGISTER, TableType.INVESTMENT)}
                    active={investmentActiveTab === RecordType.REGISTER}
                    className="detail-title-font px-0 text-center text-primary"
                  >
                    Register
                  </CNavLink>
                </CNavItem>
                <CNavItem className="col-4 p-0">
                  <CNavLink
                    onClick={onTabChange(RecordType.UNREGISTER, TableType.INVESTMENT)}
                    active={investmentActiveTab === RecordType.UNREGISTER}
                    className="detail-title-font px-0 text-center text-primary"
                  >
                    Unregister
                  </CNavLink>
                </CNavItem>
                <CNavItem className="col-4 p-0">
                  <CNavLink
                    onClick={onTabChange(RecordType.CLAIM, TableType.INVESTMENT)}
                    active={investmentActiveTab === RecordType.CLAIM}
                    className="detail-title-font px-0 text-center text-primary"
                  >          
                    Claim Reward
                  </CNavLink>
                </CNavItem>
              </CNav>
              <CTabContent>
                <CTabPane active={investmentActiveTab === RecordType.REGISTER}>
                  <ActivityLogsTable
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
                    Withdraw Token
                  </CNavLink>
                </CNavItem>
                <CNavItem className="col-4 p-0">
                  <CNavLink
                    onClick={onTabChange(RecordType.OWNERSHIP_EXTENSION, TableType.OWNERSHIP)}
                    active={ownershipActiveTab === RecordType.OWNERSHIP_EXTENSION}
                    className="detail-title-font px-0 text-center text-primary"
                  >
                    Recharge Token
                  </CNavLink>
                </CNavItem>
              </CNav>
              <CTabContent>
                <CTabPane active={ownershipActiveTab === RecordType.WITHDRAW}>
                  <ActivityLogsTable
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
      </CRow>

      {/* Ownership - Activity Logs */}
    </CContainer>
  );
};

export default ActivityLogs;
