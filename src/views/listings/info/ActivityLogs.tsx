import {
  CCol,
  CContainer, CLabel,
  CNav,
  CNavItem,
  CNavLink, CRow,
  CTabContent,
  CTabPane
} from '@coreui/react';
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

// Just number, no undefined here
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
  OWNER = 'OWNER',
  REWARD = 'REWARD', // It should be Ownership & Investment (Hoạt động đầu tư & Hoạt động sở hữu)
}

type TTableMappingSetFilter = { [key in TableType]: React.Dispatch<React.SetStateAction<IRecordParams>> };

type TTableMappingSetTab = { [key in TableType]: React.Dispatch<React.SetStateAction<RecordType>> };

interface IActivityLogs extends RouteComponentProps<IActivityLogsParams> {}

const ActivityLogs = (props: IActivityLogs) => {
  const { match } = props;
  const { id } = match.params;
  const dispatch = useDispatch();
  const listing = useSelector(selectEntityById(Number(id)));
  const { signerAddress } = useSelector((state: RootState) => state.wallet);

  const { initialState } = useSelector((state: RootState) => state.records);

  const { loading: registerLoading, registers } = initialState.registerInitialState;
  const { loading: unregisterLoading, unregisters } = initialState.unregisterInitialState;
  const { loading: claimLoading, claims } = initialState.claimInitialState;
  const { loading: withdrawLoading, withdraws } = initialState.withdrawInitialState;
  const { loading: ownershipLoading, ownerships } = initialState.ownershipInitialState;

  const [rewardActiveTab, setRewardActiveTab] = useState<RecordType>(RecordType.REGISTER);
  const [ownerActiveTab, setOwnerActiveTab] = useState<RecordType>(RecordType.WITHDRAW);

  const activeTabMappingChange: TTableMappingSetTab = {
    [TableType.OWNER]: setOwnerActiveTab,
    [TableType.REWARD]: setRewardActiveTab,
  };

  const [rewardFilterState, setRewardFilterState] = useState<IRecordParams>({
    page: 0,
    size: 10,
    sort: 'createdDate,desc',
  });

  const [ownerFilterState, setOwnerFilterState] = useState<IRecordParams>({
    page: 0,
    size: 1,
    sort: 'createdDate,desc',
  });

  const filterMappingChange: TTableMappingSetFilter = {
    [TableType.OWNER]: setOwnerFilterState,
    [TableType.REWARD]: setRewardFilterState,
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

  const totalRewardPages = Math.ceil((totalRecordMapping[rewardActiveTab] || 0) / rewardFilterState.size);

  const totalOwnerPages = Math.ceil((totalRecordMapping[ownerActiveTab] || 0) / ownerFilterState.size);

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
    if (id) {
      dispatch(fetchingEntity());
      dispatch(getEntity(Number(id)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (!listing?.address || !signerAddress) return;
    const additionalRewardFilterParams = {
      ...rewardFilterState,
      listingAddress: listing.address,
      stakeholder: signerAddress,
    };
    const recordFetchingFunc = recordTypeMapingFetching[rewardActiveTab];
    const recordApiFunc = recordTypeMapingApi[rewardActiveTab];
    dispatch(recordFetchingFunc());
    dispatch(recordApiFunc(additionalRewardFilterParams));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(rewardFilterState), listing?.address, rewardActiveTab, signerAddress]);

  useEffect(() => {
    if (!listing?.address || !signerAddress) return;
    const additionalOwnerFilterParams =
      ownerActiveTab === RecordType.OWNERSHIP_EXTENSION
        ? { previousOwner: signerAddress, newOwner: signerAddress }
        : { owner: signerAddress };
    const filter = { ...ownerFilterState, ...additionalOwnerFilterParams };
    const recordFetchingFunc = recordTypeMapingFetching[ownerActiveTab];
    const recordApiFunc = recordTypeMapingApi[ownerActiveTab];
    dispatch(recordFetchingFunc());
    dispatch(recordApiFunc(filter));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(ownerFilterState), listing?.address, ownerActiveTab, signerAddress]);

  return (
    <CContainer fluid className="mx-0 my-2">
      <CRow>
        <CCol xs={12}>
          <CLabel className="text-primary content-title">Reward</CLabel>
        </CCol>
        <CCol xs={12}>
          <CNav variant="tabs">
            <CNavItem className="col-4 p-0">
              <CNavLink
                onClick={onTabChange(RecordType.REGISTER, TableType.REWARD)}
                active={rewardActiveTab === RecordType.REGISTER}
                className="detail-title-font px-0 text-center text-primary"
              >
                Register
              </CNavLink>
            </CNavItem>
            <CNavItem className="col-4 p-0">
              <CNavLink
                onClick={onTabChange(RecordType.UNREGISTER, TableType.REWARD)}
                active={rewardActiveTab === RecordType.UNREGISTER}
                className="detail-title-font px-0 text-center text-primary"
              >
                Unregister
              </CNavLink>
            </CNavItem>
            <CNavItem className="col-4 p-0">
              <CNavLink
                onClick={onTabChange(RecordType.CLAIM, TableType.REWARD)}
                active={rewardActiveTab === RecordType.CLAIM}
                className="detail-title-font px-0 text-center text-primary"
              >
                Claim Reward
              </CNavLink>
            </CNavItem>
          </CNav>
          <CTabContent>
            <CTabPane active={rewardActiveTab === RecordType.REGISTER}>
              <ActivityLogsTable
                results={recordResultMapping[RecordType.REGISTER]}
                filterState={rewardFilterState}
                recordType={RecordType.REGISTER}
                totalPages={totalRewardPages}
                loading={registerLoading}
                tableType={TableType.REWARD}
                handlePaginationChange={handlePaginationChange}
              />
            </CTabPane>
            <CTabPane active={rewardActiveTab === RecordType.UNREGISTER}>
              <ActivityLogsTable
                results={recordResultMapping[RecordType.UNREGISTER]}
                filterState={rewardFilterState}
                recordType={RecordType.UNREGISTER}
                totalPages={totalRewardPages}
                loading={unregisterLoading}
                tableType={TableType.REWARD}
                handlePaginationChange={handlePaginationChange}
              />
            </CTabPane>
            <CTabPane active={rewardActiveTab === RecordType.CLAIM}>
              <ActivityLogsTable
                results={recordResultMapping[RecordType.CLAIM]}
                filterState={rewardFilterState}
                recordType={RecordType.CLAIM}
                totalPages={totalRewardPages}
                loading={claimLoading}
                tableType={TableType.REWARD}
                handlePaginationChange={handlePaginationChange}
              />
            </CTabPane>
          </CTabContent>
        </CCol>
      </CRow>

      {/* Ownership - Activity Logs */}
      <CRow>
        <CCol xs={12}>
          <CLabel className="text-primary content-title">Ownership</CLabel>
        </CCol>
        <CCol xs={12}>
          <CNav variant="tabs">
            <CNavItem className="col-4 p-0">
              <CNavLink
                onClick={onTabChange(RecordType.WITHDRAW, TableType.OWNER)}
                active={ownerActiveTab === RecordType.WITHDRAW}
                className="detail-title-font px-0 text-center text-primary"
              >
                Withdraw Token
              </CNavLink>
            </CNavItem>
            <CNavItem className="col-4 p-0">
              <CNavLink
                onClick={onTabChange(RecordType.OWNERSHIP_EXTENSION, TableType.OWNER)}
                active={ownerActiveTab === RecordType.OWNERSHIP_EXTENSION}
                className="detail-title-font px-0 text-center text-primary"
              >
                Recharge Token
              </CNavLink>
            </CNavItem>
          </CNav>
          <CTabContent>
            <CTabPane active={ownerActiveTab === RecordType.WITHDRAW}>
              <ActivityLogsTable
                results={recordResultMapping[RecordType.WITHDRAW]}
                filterState={ownerFilterState}
                recordType={RecordType.WITHDRAW}
                totalPages={totalOwnerPages}
                loading={withdrawLoading}
                tableType={TableType.OWNER}
                handlePaginationChange={handlePaginationChange}
              />
            </CTabPane>
            <CTabPane active={ownerActiveTab === RecordType.OWNERSHIP_EXTENSION}>
              <ActivityLogsTable
                results={recordResultMapping[RecordType.OWNERSHIP_EXTENSION]}
                filterState={ownerFilterState}
                recordType={RecordType.OWNERSHIP_EXTENSION}
                totalPages={totalOwnerPages}
                loading={ownershipLoading}
                tableType={TableType.OWNER}
                handlePaginationChange={handlePaginationChange}
              />
            </CTabPane>
          </CTabContent>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default ActivityLogs;
