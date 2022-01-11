import { CPagination } from '@coreui/react';
import dayjs from 'dayjs';
import React from 'react';
import { APP_DATE_FORMAT } from '../../../config/constants';
import { insertCommas, returnOptionNameById } from '../../../shared/casual-helpers';
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

type TRecordTypeMappingRender = { [key in RecordType]: Function };

interface IActivityLogs {
  results: Array<TRecordTypeArray>;
  filterState: IRecordParams;
  recordType: RecordType;
  totalPages: number;
  loading: boolean;
  tableType: TableType;
  handlePaginationChange: (page: number, type: TableType) => void;
}

const renderRecordOwnerShip = (record: IRecordOwnership) => (
  <>
    <tr>
      <td>From</td>
      <td className="text-right">{dayjs(record.from).format(APP_DATE_FORMAT)}</td>
    </tr>
    <tr>
      <td>To</td>
      <td className="text-right">{dayjs(record.to).format(APP_DATE_FORMAT)}</td>
    </tr>
  </>
);

const renderRecordClaim = (record: IRecordClaim) => (
  <>
    <tr>
      <td>Amount</td>
      <td className="text-right">{insertCommas(record.amount || '')}</td>
    </tr>

    <tr>
      <td>From</td>
      <td className="text-right">{dayjs(record.from).format(APP_DATE_FORMAT)}</td>
    </tr>
    <tr>
      <td>To</td>
      <td className="text-right">{dayjs(record.to).format(APP_DATE_FORMAT)}</td>
    </tr>
  </>
);

const renderRecordRegister = (record: IRecordRegister) => (
  <>
    <tr>
      <td>Option</td>
      <td className="text-right">{returnOptionNameById(Number(record.optionId))}</td>
    </tr>
    <tr>
      <td>Amount</td>
      <td className="text-right">{insertCommas(record.amount || '')}</td>
    </tr>
  </>
);

const renderRecordUnRegister = (record: IRecordUnRegister) => (
  <>
    <tr>
      <td>Option</td>
      <td className="text-right">{returnOptionNameById(Number(record.optionId))}</td>
    </tr>
  </>
);

const renderRecordWithdraw = (record: IRecordWithdraw) => (
  <>
    <tr>
      <td>Initial Ownership</td>
      <td className="text-right">{dayjs.unix(Number(record.initialOwnership)).format(APP_DATE_FORMAT)}</td>
    </tr>
    <tr>
      <td>New Ownership</td>
      <td className="text-right">{dayjs.unix(Number(record.newOwnership)).format(APP_DATE_FORMAT)}</td>
    </tr>
    <tr>
      <td>Ammount</td>
      <td className="text-right">{insertCommas(record.amount || '')}</td>
    </tr>
  </>
);

const renderRecordWorker = () => <></>;

const recordMappingField: TRecordTypeMappingRender = {
  [RecordType.REGISTER]: renderRecordRegister,
  [RecordType.UNREGISTER]: renderRecordUnRegister,
  [RecordType.CLAIM]: renderRecordClaim,
  [RecordType.WITHDRAW]: renderRecordWithdraw,
  [RecordType.OWNERSHIP_EXTENSION]: renderRecordOwnerShip,
  [RecordType.UPDATE_WORKER]: renderRecordWorker,
};

const ActivityLogsTable = (props: IActivityLogs) => {
  const { filterState, totalPages, loading, tableType, handlePaginationChange, results, recordType } = props;

  return (
    <>
      {results.length > 0 ? (
        <>
          {results.map((result, index) => {
            return (
              <table key={index} className="w-100 mb-3">
                <thead>
                  <tr>
                    <th>{dayjs(result.createdDate).format(APP_DATE_FORMAT)}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>{recordMappingField[recordType](result)}</tbody>
              </table>
            );
          })}
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
      ) : (
        <div className="alert alert-warning my-3">
          <span>Không có bản ghi nào !</span>
        </div>
      )}
    </>
  );
};

export default ActivityLogsTable;
