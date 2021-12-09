import {
  CBadge, CCol,
  CContainer,
  CDataTable,
  CLabel,
  CNav,
  CNavItem,
  CNavLink,
  CRow,
  CTabContent,
  CTabPane,
  CTabs
} from '@coreui/react';
import React from 'react';
import { mapExploitedStatusBadge, ExploitedStatus } from '../../../enumeration/exploitedStatus';
import { mapStatus, mapStatusBadge, Status } from '../../../enumeration/status';
import { IExploitedPermission } from '../../../shared/models/exploitedPermission.model';
import { IRegisterRewardHistory } from '../../../shared/models/realEstateActivity.model';
import './index.scss';

const ActivityLogs = () => {
  const titleTableStyle = {
    textAlign: 'left',
    color: '#828282',
    fontSize: '0.875rem',
    lineHeight: '16px',
    fontWeight: '400',
  };

  const fields = [
    { key: 'activityName', _style: titleTableStyle, label: 'Activity' },
    { key: 'createdDate', _style: titleTableStyle, label: 'Time' },
    { key: 'value', _style: titleTableStyle, label: 'Value' },
  ];

  const exchangeWallet = [
    { key: 'createdDate', _style: titleTableStyle, label: 'Time' },
    { key: 'amount', _style: titleTableStyle, label: 'Amount' },
  ];

  const exploitedPermission = [
    { key: 'address', _style: titleTableStyle, label: 'Address Wallet' },
    { key: 'createdDate', _style: titleTableStyle, label: 'Time' },
    { key: 'status', _style: titleTableStyle, label: 'Status' },
  ];

  const demoHistoryActivityLogs: IRegisterRewardHistory[] = [
    {
      activityName: 'Lorem is pum 1',
      createdDate: '17:10- 29/11/2021',
      status: Status.REGISTER,
      bonusRate: '',
      registerLevel: '1.00000000000',
      reward: '',
    },
    {
      activityName: 'Lorem is pum 1',
      createdDate: '',
      status: Status.UNREGISTER,
      bonusRate: '',
      registerLevel: '2.000',
      reward: '',
    },
    {
      activityName: 'Lorem is pum 1',
      createdDate: '',
      status: Status.CLAIMREWARD,
      bonusRate: '',
      registerLevel: '1.000',
      reward: '500',
    },
  ];

  const demoExchangeWallet = [
    {
      createdDate: '17:10- 29/11/2021',
      amount: '1.000',
      type: 'withdraw',
    },
    {
      createdDate: '17:10- 29/11/2021',
      amount: '500',
      type: 'withdraw',
    },
    {
      createdDate: '17:10- 29/11/2021',
      amount: '2.000',
      type: 'recharge',
    },
  ];

  const demoExploitedPermission: IExploitedPermission[] = [
    {
      createdDate: '17:10- 29/11/2021',
      status: ExploitedStatus.Active,
      address: '0xda3ac...9999',
    },
    {
      createdDate: '17:10- 29/11/2021',
      status: ExploitedStatus.Inactive,
      address: '0xda3ac...9999',
    },
    {
      createdDate: '17:10- 29/11/2021',
      status: ExploitedStatus.Active,
      address: '0xda3ac...9999',
    },
  ];

  return (
    <CContainer fluid className="mx-0 my-2">
      <CRow>
        <CCol xs={12}>
          <CLabel className="text-primary content-title">Reward</CLabel>
        </CCol>
        <CCol xs={12}>
          <CTabs activeTab="register-reward-history">
            <CNav variant="tabs">
              <CNavItem className="col-4 p-0">
                <CNavLink
                  data-tab="register-reward-history"
                  className="detail-title-font px-0 text-center text-primary"
                >
                  Register
                </CNavLink>
              </CNavItem>
              <CNavItem className="col-4 p-0">
                <CNavLink
                  data-tab="unregister-reward-history"
                  className="detail-title-font px-0 text-center text-primary"
                >
                  Unregister
                </CNavLink>
              </CNavItem>
              <CNavItem className="col-4 p-0">
                <CNavLink data-tab="claim-reward-history" className="detail-title-font px-0 text-center text-primary">
                  Claim Reward
                </CNavLink>
              </CNavItem>
            </CNav>
            <CTabContent>
              <CTabPane data-tab="register-reward-history">
                <CDataTable
                  striped
                  items={demoHistoryActivityLogs.filter((e) => e.status === Status.REGISTER)}
                  fields={fields}
                  responsive
                  hover
                  header
                  scopedSlots={{
                    activityName: (item: IRegisterRewardHistory) => {
                      return (
                        <td>
                          <span className="d-inline-block text-truncate" style={{ maxWidth: '60px' }}>
                            {item.activityName ? item.activityName : '_'}
                          </span>
                        </td>
                      );
                    },
                    createdDate: (item: IRegisterRewardHistory) => {
                      return <td>{item.createdDate ? item.createdDate : '_'}</td>;
                    },
                    status: (item: IRegisterRewardHistory) => {
                      return (
                        <td>
                          {
                            <CBadge color={mapStatusBadge[item.status]}>
                              {item.status ? mapStatus[item.status] : '_'}
                            </CBadge>
                          }
                        </td>
                      );
                    },
                    value: (item: IRegisterRewardHistory) => {
                      return (
                        <td>
                          <span className="d-inline-block text-truncate" style={{ maxWidth: '60px' }}>
                            {item.registerLevel ? item.registerLevel : '_'}
                          </span>
                        </td>
                      );
                    },
                  }}
                />
              </CTabPane>
              <CTabPane data-tab="unregister-reward-history">
                <CDataTable
                  striped
                  items={demoHistoryActivityLogs.filter((e) => e.status === Status.UNREGISTER)}
                  fields={fields}
                  responsive
                  hover
                  header
                  scopedSlots={{
                    activityName: (item: IRegisterRewardHistory) => {
                      return (
                        <td>
                          <span className="d-inline-block text-truncate" style={{ maxWidth: '60px' }}>
                            {item.activityName ? item.activityName : '_'}
                          </span>
                        </td>
                      );
                    },
                    createdDate: (item: IRegisterRewardHistory) => {
                      return <td>{item.createdDate ? item.createdDate : '_'}</td>;
                    },
                    status: (item: IRegisterRewardHistory) => {
                      return (
                        <td>
                          {
                            <CBadge color={mapStatusBadge[item.status]}>
                              {item.status ? mapStatus[item.status] : '_'}
                            </CBadge>
                          }
                        </td>
                      );
                    },
                    value: (item: IRegisterRewardHistory) => {
                      return (
                        <td>
                          <span className="d-inline-block text-truncate" style={{ maxWidth: '60px' }}>
                            {item.registerLevel ? item.registerLevel : '_'}
                          </span>
                        </td>
                      );
                    },
                  }}
                />
              </CTabPane>
              <CTabPane data-tab="claim-reward-history">
                <CDataTable
                  striped
                  items={demoHistoryActivityLogs.filter((e) => e.status === Status.CLAIMREWARD)}
                  fields={fields}
                  responsive
                  hover
                  header
                  scopedSlots={{
                    activityName: (item: IRegisterRewardHistory) => {
                      return (
                        <td>
                          <span className="d-inline-block text-truncate" style={{ maxWidth: '60px' }}>
                            {item.activityName ? item.activityName : '_'}
                          </span>
                        </td>
                      );
                    },
                    createdDate: (item: IRegisterRewardHistory) => {
                      return <td>{item.createdDate ? item.createdDate : '_'}</td>;
                    },
                    status: (item: IRegisterRewardHistory) => {
                      return (
                        <td>
                          {
                            <CBadge color={mapStatusBadge[item.status]}>
                              {item.status ? mapStatus[item.status] : '_'}
                            </CBadge>
                          }
                        </td>
                      );
                    },
                    value: (item: IRegisterRewardHistory) => {
                      return (
                        <td>
                          <span className="d-inline-block text-truncate" style={{ maxWidth: '60px' }}>
                            {item.reward ? item.reward : '_'}
                          </span>
                        </td>
                      );
                    },
                  }}
                />
              </CTabPane>
            </CTabContent>
          </CTabs>
        </CCol>
      </CRow>

      {/* Ownership - Activity Logs */}
      <CRow>
        <CCol xs={12}>
          <CLabel className="text-primary content-title">Ownership</CLabel>
        </CCol>
        <CCol xs={12}>
          <CTabs activeTab="withdraw-token-history">
            <CNav variant="tabs">
              <CNavItem className="col-4 p-0">
                <CNavLink data-tab="withdraw-token-history" className="detail-title-font px-0 text-center text-primary">
                  Withdraw Token
                </CNavLink>
              </CNavItem>
              <CNavItem className="col-4 p-0">
                <CNavLink data-tab="recharge-token-history" className="detail-title-font px-0 text-center text-primary">
                  Recharge Token
                </CNavLink>
              </CNavItem>
              <CNavItem className="col-4 p-0">
                <CNavLink data-tab="exploited-permission" className="detail-title-font px-0 text-center text-primary">
                  Exploited Permission
                </CNavLink>
              </CNavItem>
            </CNav>
            <CTabContent>
              <CTabPane data-tab="withdraw-token-history">
                <CDataTable
                  striped
                  items={demoExchangeWallet.filter((e) => e.type === 'withdraw')}
                  fields={exchangeWallet}
                  responsive
                  hover
                  header
                  scopedSlots={{}}
                />
              </CTabPane>
              <CTabPane data-tab="recharge-token-history">
                <CDataTable
                  striped
                  items={demoExchangeWallet.filter((e) => e.type === 'recharge')}
                  fields={exchangeWallet}
                  responsive
                  hover
                  header
                  scopedSlots={{}}
                />
              </CTabPane>
              <CTabPane data-tab="exploited-permission">
                <CDataTable
                  striped
                  items={demoExploitedPermission}
                  fields={exploitedPermission}
                  responsive
                  hover
                  header
                  scopedSlots={{
                    status: (item: IExploitedPermission) => {
                      return (
                        <td>
                          {
                            <CBadge color={mapExploitedStatusBadge[item.status]}>
                              {item.status ? item.status : '_'}
                            </CBadge>
                          }
                        </td>
                      );
                    },
                  }}
                />
              </CTabPane>
            </CTabContent>
          </CTabs>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default ActivityLogs;
