import { CPagination } from '@coreui/react';
import dayjs from 'dayjs';
import moment from 'moment';
import React from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import { APP_DATE_FORMAT } from '../../../config/constants';
import { calculateDateDifference, insertCommas, returnOptionNameById } from '../../../shared/casual-helpers';
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

interface IActivityLogs {
  results: Array<TRecordTypeArray>;
  filterState: IRecordParams;
  recordType: RecordType;
  totalPages: number;
  loading: boolean;
  tableType: TableType;
  handlePaginationChange: (page: number, type: TableType) => void;
}
interface IRecordTableProps<TableType> {
  record: TableType;
  transFunc: TFunction<'translation', undefined>;
}

type TRecordTypeMappingRender = { [key in RecordType]: ({ record, transFunc }: IRecordTableProps<any>) => JSX.Element };

const renderRecordOwnerShip = ({ record, transFunc }: IRecordTableProps<IRecordOwnership>) => (
  <>
    <tr>
      <td>{transFunc('anftDapp.activityLogsComponent.activityLogsTable.from')}</td>
      <td className="text-right">{dayjs(record.from).format(APP_DATE_FORMAT)}</td>
    </tr>
    <tr>
      <td>{transFunc('anftDapp.activityLogsComponent.activityLogsTable.to')}</td>
      <td className="text-right">{dayjs(record.to).format(APP_DATE_FORMAT)}</td>
    </tr>
    <tr>
      <td>{transFunc('anftDapp.activityLogsComponent.activityLogsTable.ownedDay')}</td>
      <td className="text-right">{calculateDateDifference(moment(record.from), moment(record.to))}</td>
    </tr>
    <tr>
      <td>{transFunc('anftDapp.activityLogsComponent.activityLogsTable.amount')}</td>
      <td className="text-right">{insertCommas(record.amount || '')}</td>
    </tr>
  </>
);

const renderRecordClaim = ({ record, transFunc }: IRecordTableProps<IRecordClaim>) => (
  <>
    <tr>
      <td>{transFunc('anftDapp.activityLogsComponent.activityLogsTable.amount')}</td>
      <td className="text-right">{insertCommas(record.amount || '', 10)}</td>
    </tr>

    <tr>
      <td>{transFunc('anftDapp.registerComponent.stakeStart')}</td>
      <td className="text-right">{dayjs(record.from).format(APP_DATE_FORMAT)}</td>
    </tr>
    <tr>
      <td>{transFunc('anftDapp.activityLogsComponent.activityLogsTable.claimTime')}</td>
      <td className="text-right">{dayjs(record.to).format(APP_DATE_FORMAT)}</td>
    </tr>
  </>
);

const renderRecordRegister = ({ record, transFunc }: IRecordTableProps<IRecordRegister>) => (
  <>
    <tr>
      <td>{transFunc('anftDapp.registerComponent.activity')}</td>
      <td className="text-right">{returnOptionNameById(Number(record.optionId))}</td>
    </tr>
    <tr>
      <td>{transFunc('anftDapp.activityLogsComponent.activityLogsTable.amount')}</td>
      <td className="text-right">{insertCommas(record.amount || '')}</td>
    </tr>
  </>
);

const renderRecordUnRegister = ({ record, transFunc }: IRecordTableProps<IRecordUnRegister>) => (
  <>
    <tr>
      <td>{transFunc('anftDapp.registerComponent.activity')}</td>
      <td className="text-right">{returnOptionNameById(Number(record.optionId))}</td>
    </tr>
  </>
);

const renderRecordWithdraw = ({ record, transFunc }: IRecordTableProps<IRecordWithdraw>) => (
  <>
    <tr>
      <td>{transFunc('anftDapp.activityLogsComponent.activityLogsTable.initialOwnership')}</td>
      <td className="text-right">{dayjs.unix(Number(record.initialOwnership)).format(APP_DATE_FORMAT)}</td>
    </tr>
    <tr>
      <td>{transFunc('anftDapp.activityLogsComponent.activityLogsTable.newOwnership')}</td>
      <td className="text-right">{dayjs.unix(Number(record.newOwnership)).format(APP_DATE_FORMAT)}</td>
    </tr>
    <tr>
      <td>{transFunc('anftDapp.activityLogsComponent.activityLogsTable.withdrawDay')}</td>
      <td className="text-right">
        {calculateDateDifference(
          moment.unix(Number(record.newOwnership)),
          moment.unix(Number(record.initialOwnership))
        )}
      </td>
    </tr>
    <tr>
      <td>{transFunc('anftDapp.activityLogsComponent.activityLogsTable.amount')}</td>
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

  const { t } = useTranslation();

  const renderRecordTbody = recordMappingField[recordType];

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
                <tbody>{renderRecordTbody({ record: result, transFunc: t })}</tbody>
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
          <span>{t('anftDapp.activityLogsComponent.noLogFound')}</span>
        </div>
      )}
    </>
  );
};

export default ActivityLogsTable;
