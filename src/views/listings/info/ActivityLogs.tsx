import {
  CCol,
  CContainer,
  CDataTable,
  CLabel,
  CNav,
  CNavItem,
  CNavLink,
  CPagination,
  CRow,
  CTabContent,
  CTabPane
} from '@coreui/react';
import { ActionCreatorWithoutPayload, AsyncThunk } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { APP_DATE_FORMAT } from '../../../config/constants';
import { getEllipsisTxt, insertCommas } from '../../../shared/casual-helpers';
import { RecordType } from '../../../shared/enumeration/recordType';
import { IRecordClaim, IRecordOwnership, IRecordRegister, IRecordUnRegister, IRecordWithdraw } from '../../../shared/models/record.model';
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

interface IActivityLogsParams {
  [x: string]: string;
}

type TRecordTypeMappingApi = { [key in RecordType]: AsyncThunk<unknown, IRecordParams, {}> };

type TRecordTypeMappingFetch = { [key in RecordType]: ActionCreatorWithoutPayload<string> };

// Just number, no undefined here
type TRecordTypeMappingTotal = { [key in RecordType]: number | undefined };

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

enum TableType {
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
    size: 10,
    sort: 'createdDate,desc',
  });

  const filterMappingChange: TTableMappingSetFilter = {
    [TableType.OWNER]: setOwnerFilterState,
    [TableType.REWARD]: setRewardFilterState,
  };

  // Use || 0 here
  const totalRecordMapping: TRecordTypeMappingTotal = {
    [RecordType.REGISTER]: registers?.count,
    [RecordType.UNREGISTER]: unregisters?.count,
    [RecordType.CLAIM]: claims?.count,
    [RecordType.WITHDRAW]: withdraws?.count,
    [RecordType.OWNERSHIP_EXTENSION]: ownerships?.count,
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
    if (listing?.address) {
      const filter = { ...rewardFilterState, listingAddress: listing.address };
      dispatch(recordTypeMapingFetching[rewardActiveTab]());
      dispatch(recordTypeMapingApi[rewardActiveTab](filter));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(rewardFilterState), listing?.address, rewardActiveTab]);

  useEffect(() => {
    /*
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
    */

    if (listing?.address && signerAddress) {
      // ownerFilter => additionalOwnerFilterParams
      const ownerFilter =
        ownerActiveTab === RecordType.OWNERSHIP_EXTENSION
          ? { previousOwner: signerAddress, newOwner: signerAddress }
          : { owner: signerAddress };
      const filter = { ...ownerFilterState, ...ownerFilter };
      dispatch(recordTypeMapingFetching[ownerActiveTab]());
      dispatch(recordTypeMapingApi[ownerActiveTab](filter));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(ownerFilterState), listing?.address, ownerActiveTab, signerAddress]);

  const titleTableStyle = {
    textAlign: 'left',
    color: '#828282',
    fontSize: '0.875rem',
    lineHeight: '16px',
    fontWeight: '400',
  };

  const registerField = [
    { key: 'stakeholder', _style: titleTableStyle, label: 'Stakeholder' },
    { key: 'optionId', _style: titleTableStyle, label: 'optionId' },
    { key: 'amount', _style: titleTableStyle, label: 'amount' },
  ];

  const unregisterField = [
    { key: 'stakeholder', _style: titleTableStyle, label: 'Stakeholder' },
    { key: 'optionId', _style: titleTableStyle, label: 'optionId' },
  ];

  const claimField = [
    { key: 'stakeholder', _style: titleTableStyle, label: 'Stakeholder' },
    { key: 'amount', _style: titleTableStyle, label: 'amount' },
    { key: 'from', _style: titleTableStyle, label: 'From' },
    { key: 'to', _style: titleTableStyle, label: 'To' },
  ];

  const withdrawField = [
    { key: 'owner', _style: titleTableStyle, label: 'Owner' },
    { key: 'amount', _style: titleTableStyle, label: 'amount' },
    { key: 'initialOwnership', _style: titleTableStyle, label: 'Initial Ownership' },
    { key: 'newOwnership', _style: titleTableStyle, label: 'New Ownership' },
  ];

  const ownershipField = [
    { key: 'previousOwner', _style: titleTableStyle, label: 'Previous Owner' },
    { key: 'newOwner', _style: titleTableStyle, label: 'New Owner' },
    { key: 'from', _style: titleTableStyle, label: 'From' },
    { key: 'to', _style: titleTableStyle, label: 'To' },
  ];

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
            {/* 
            
              create a shared CDataTable with differents properties according to tabType
            
            */}
            <CTabPane active={rewardActiveTab === RecordType.REGISTER}>
              <CDataTable
                noItemsView={{
                  noItems: 'No Item',
                }}
                striped
                // registers?.results || [] ; hoặc tốt nhất là check { registers.result?.length bên ngoài }
                items={registers?.results}
                fields={registerField}
                responsive
                hover
                header
                scopedSlots={{
                  stakeholder: (item: IRecordRegister) => {
                    return (
                      <td>
                        <span className="d-inline-block ">{getEllipsisTxt(item.stakeholder, 5)}</span>
                      </td>
                    );
                  },
                  amount: (item: IRecordRegister) => {
                    return (
                      <td>
                        <span className="d-inline-block">{insertCommas(item.amount || '')}</span>
                      </td>
                    );
                  },
                }}
              />
              {totalRewardPages > 1 && (
                <CPagination
                  disabled={registerLoading}
                  activePage={rewardFilterState.page + 1}
                  pages={totalRewardPages}
                  onActivePageChange={(page: number) => handlePaginationChange(page, TableType.REWARD)}
                  align="center"
                  className="mt-2"
                />
              )}
            </CTabPane>
            <CTabPane active={rewardActiveTab === RecordType.UNREGISTER}>
              <CDataTable
              // create an object noItemsViewTable = { noItems: 'No Item'} and use it globally
                noItemsView={{
                  noItems: 'No Item',
                }}
                striped
                items={unregisters?.results}
                fields={unregisterField}
                responsive
                hover
                header
                scopedSlots={{
                  stakeholder: (item: IRecordUnRegister) => {
                    return (
                      <td>
                        <span className="d-inline-block ">{getEllipsisTxt(item.stakeholder, 5)}</span>
                      </td>
                    );
                  },
                  optionId: (item: IRecordUnRegister) => {
                    return (
                      <td>
                        <span className="d-inline-block ">{getEllipsisTxt(item.optionId, 5)}</span>
                      </td>
                    );
                  },
                }}
              />
              {totalRewardPages > 1 && (
                <CPagination
                  disabled={unregisterLoading}
                  activePage={rewardFilterState.page + 1}
                  pages={totalRewardPages}
                  onActivePageChange={(page: number) => handlePaginationChange(page, TableType.REWARD)}
                  align="center"
                  className="mt-2"
                />
              )}
            </CTabPane>
            <CTabPane active={rewardActiveTab === RecordType.CLAIM}>
              <CDataTable
                noItemsView={{
                  noItems: 'No Item',
                }}
                striped
                items={claims?.results} // same as above
                fields={claimField}
                responsive
                hover
                header
                scopedSlots={{
                  // value: (item: IRegisterRewardHistory) => {
                  //   return (
                  //     <td>
                  //       <span className="d-inline-block text-truncate" style={{ maxWidth: '60px' }}>
                  //         {item.reward ? item.reward : '_'}
                  //       </span>
                  //     </td>
                  //   );
                  // },
                  stakeholder: (item: IRecordClaim) => {
                    return (
                      <td>
                        <span className="d-inline-block ">{getEllipsisTxt(item.stakeholder, 4)}</span>
                      </td>
                    );
                  },
                  amount: (item: IRecordClaim) => {
                    return (
                      <td>
                        <span className="d-inline-block">{insertCommas(item.amount || '')}</span>
                      </td>
                    );
                  },
                  from: ({ from }: IRecordClaim) => {
                    return (
                      <td>
                        <span className="d-inline-block">{from ? dayjs(from).format(APP_DATE_FORMAT) : '_'}</span>
                      </td>
                    );
                  },
                  to: ({ to }: IRecordClaim) => {
                    return (
                      <td>
                        <span className="d-inline-block">{to ? dayjs(to).format(APP_DATE_FORMAT) : '_'}</span>
                      </td>
                    );
                  },
                }}
              />
              {totalRewardPages > 1 && (
                <CPagination
                  disabled={claimLoading}
                  activePage={rewardFilterState.page + 1}
                  pages={totalRewardPages}
                  onActivePageChange={(page: number) => handlePaginationChange(page, TableType.REWARD)}
                  align="center"
                  className="mt-2"
                />
              )}
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
              <CDataTable
                noItemsView={{
                  noItems: 'No Item',
                }}
                striped
                items={withdraws?.results}
                fields={withdrawField}
                responsive
                hover
                header
                scopedSlots={{
                  owner: (item: IRecordWithdraw) => {
                    return (
                      <td>
                        <span className="d-inline-block ">{getEllipsisTxt(item.owner, 4)}</span>
                      </td>
                    );
                  },
                  amount: (item: IRecordWithdraw) => {
                    return (
                      <td>
                        <span className="d-inline-block ">{insertCommas(item.amount || '')}</span>
                      </td>
                    );
                  },
                  initialOwnership: ({ initialOwnership }: IRecordWithdraw) => {
                    return (
                      <td>
                        <span className="d-inline-block ">
                          {initialOwnership ? dayjs.unix(Number(initialOwnership)).format(APP_DATE_FORMAT) : '_'}
                        </span>
                      </td>
                    );
                  },
                  newOwnership: ({ newOwnership }: IRecordWithdraw) => {
                    return (
                      <td>
                        <span className="d-inline-block ">
                          {newOwnership ? dayjs.unix(Number(newOwnership)).format(APP_DATE_FORMAT) : '_'}
                        </span>
                      </td>
                    );
                  },
                }}
              />
              {totalOwnerPages > 1 && (
                <CPagination
                  disabled={withdrawLoading}
                  activePage={ownerFilterState.page + 1}
                  pages={totalOwnerPages}
                  onActivePageChange={(page: number) => handlePaginationChange(page, TableType.OWNER)}
                  align="center"
                  className="mt-2"
                />
              )}
            </CTabPane>
            <CTabPane active={ownerActiveTab === RecordType.OWNERSHIP_EXTENSION}>
              <CDataTable
                noItemsView={{
                  noItems: 'No Item',
                }}
                striped
                items={ownerships?.results}
                fields={ownershipField}
                responsive
                hover
                header
                scopedSlots={{
                  previousOwner: (item: IRecordOwnership) => {
                    return (
                      <td>
                        <span className="d-inline-block ">{getEllipsisTxt(item.previousOwner, 4)}</span>
                      </td>
                    );
                  },
                  newOwner: (item: IRecordOwnership) => {
                    return (
                      <td>
                        <span className="d-inline-block ">{getEllipsisTxt(item.newOwner, 4)}</span>
                      </td>
                    );
                  },
                  from: ({ from }: IRecordOwnership) => {
                    return (
                      <td>
                        <span className="d-inline-block">{from ? dayjs(from).format(APP_DATE_FORMAT) : '_'}</span>
                      </td>
                    );
                  },
                  to: ({ to }: IRecordOwnership) => {
                    return (
                      <td>
                        <span className="d-inline-block">{to ? dayjs(to).format(APP_DATE_FORMAT) : '_'}</span>
                      </td>
                    );
                  },
                }}
              />
              {totalOwnerPages > 1 && (
                <CPagination
                  disabled={ownershipLoading}
                  activePage={ownerFilterState.page + 1}
                  pages={totalOwnerPages}
                  onActivePageChange={(page: number) => handlePaginationChange(page, TableType.OWNER)}
                  align="center"
                  className="mt-2"
                />
              )}
            </CTabPane>
          </CTabContent>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default ActivityLogs;
