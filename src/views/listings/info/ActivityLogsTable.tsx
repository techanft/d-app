import { CDataTable, CPagination } from '@coreui/react';
import dayjs from 'dayjs';
import React from 'react';
import { APP_DATE_FORMAT } from '../../../config/constants';
import { getEllipsisTxt, insertCommas } from '../../../shared/casual-helpers';
import { RecordType } from '../../../shared/enumeration/recordType';
import {
    IRecordClaim,
    IRecordOwnership,
    IRecordRegister,
    IRecordUnRegister,
    IRecordWithdraw
} from '../../../shared/models/record.model';
import { IRecordParams } from '../../records/records.api';
import '../index.scss';
import { TableType, TRecordTypeArray } from './ActivityLogs';

interface ITableStyle {
  textAlign: string;
  color: string;
  fontSize: string;
  lineHeight: string;
  fontWeight: string;
}

interface ITableField {
  key: string;
  _style: ITableStyle;
  label: string;
}

type TRecordTypeMappingField = { [key in RecordType]: Array<ITableField> };

interface IActivityLogs {
  results: Array<TRecordTypeArray>;
  filterState: IRecordParams;
  recordType: RecordType;
  totalPages: number;
  loading: boolean;
  tableType: TableType;
  handlePaginationChange: (page: number, type: TableType) => void;
}

export const noItemsViewTable = { noItems: 'No Item' };

const ActivityLogsTable = (props: IActivityLogs) => {
  const { filterState, totalPages, loading, tableType, handlePaginationChange, results, recordType } = props;

  const titleTableStyle: ITableStyle = {
    textAlign: 'left',
    color: '#828282',
    fontSize: '0.875rem',
    lineHeight: '16px',
    fontWeight: '400',
  };

  const registerField: ITableField[] = [
    { key: 'stakeholder', _style: titleTableStyle, label: 'Stakeholder' },
    { key: 'optionId', _style: titleTableStyle, label: 'optionId' },
    { key: 'amount', _style: titleTableStyle, label: 'amount' },
  ];

  const unregisterField: ITableField[] = [
    { key: 'stakeholder', _style: titleTableStyle, label: 'Stakeholder' },
    { key: 'optionId', _style: titleTableStyle, label: 'optionId' },
  ];

  const claimField: ITableField[] = [
    { key: 'stakeholder', _style: titleTableStyle, label: 'Stakeholder' },
    { key: 'amount', _style: titleTableStyle, label: 'amount' },
    { key: 'from', _style: titleTableStyle, label: 'From' },
    { key: 'to', _style: titleTableStyle, label: 'To' },
  ];

  const withdrawField: ITableField[] = [
    { key: 'owner', _style: titleTableStyle, label: 'Owner' },
    { key: 'amount', _style: titleTableStyle, label: 'amount' },
    { key: 'initialOwnership', _style: titleTableStyle, label: 'Initial Ownership' },
    { key: 'newOwnership', _style: titleTableStyle, label: 'New Ownership' },
  ];

  const ownershipField: ITableField[] = [
    { key: 'previousOwner', _style: titleTableStyle, label: 'Previous Owner' },
    { key: 'newOwner', _style: titleTableStyle, label: 'New Owner' },
    { key: 'from', _style: titleTableStyle, label: 'From' },
    { key: 'to', _style: titleTableStyle, label: 'To' },
  ];

  const recordMappingField: TRecordTypeMappingField = {
    [RecordType.REGISTER]: registerField,
    [RecordType.UNREGISTER]: unregisterField,
    [RecordType.CLAIM]: claimField,
    [RecordType.WITHDRAW]: withdrawField,
    [RecordType.OWNERSHIP_EXTENSION]: ownershipField,
    [RecordType.UPDATE_WORKER]: [],
  };

  return (
    <>
      <CDataTable
        noItemsView={noItemsViewTable}
        striped
        items={results}
        fields={recordMappingField[recordType]}
        responsive
        hover
        header
        scopedSlots={{
          stakeholder: ({ stakeholder }: IRecordRegister | IRecordClaim | IRecordUnRegister) => {
            return (
              <td>
                <span className="d-inline-block ">{getEllipsisTxt(stakeholder, 5)}</span>
              </td>
            );
          },
          amount: ({ amount }: IRecordRegister | IRecordClaim | IRecordWithdraw) => {
            return (
              <td>
                <span className="d-inline-block">{insertCommas(amount || '')}</span>
              </td>
            );
          },
          optionId: ({ optionId }: IRecordRegister | IRecordUnRegister) => {
            return (
              <td>
                <span className="d-inline-block ">{getEllipsisTxt(optionId, 5)}</span>
              </td>
            );
          },
          from: ({ from }: IRecordOwnership | IRecordClaim) => {
            return (
              <td>
                <span className="d-inline-block">{from ? dayjs(from).format(APP_DATE_FORMAT) : '_'}</span>
              </td>
            );
          },
          to: ({ to }: IRecordOwnership | IRecordClaim) => {
            return (
              <td>
                <span className="d-inline-block">{to ? dayjs(to).format(APP_DATE_FORMAT) : '_'}</span>
              </td>
            );
          },
          owner: ({ owner }: IRecordWithdraw) => {
            return (
              <td>
                <span className="d-inline-block ">{getEllipsisTxt(owner, 4)}</span>
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
          previousOwner: ({ previousOwner }: IRecordOwnership) => {
            return (
              <td>
                <span className="d-inline-block ">{getEllipsisTxt(previousOwner, 4)}</span>
              </td>
            );
          },
          newOwner: ({ newOwner }: IRecordOwnership) => {
            return (
              <td>
                <span className="d-inline-block ">{getEllipsisTxt(newOwner, 4)}</span>
              </td>
            );
          },
        }}
      />
      {totalPages > 1 && (
        <CPagination
          disabled={loading}
          activePage={filterState.page + 1}
          pages={totalPages}
          onActivePageChange={(page: number) => handlePaginationChange(page, tableType)}
          align="center"
          className="mt-2"
        />
      )}
    </>
  );
};

export default ActivityLogsTable;
