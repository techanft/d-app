import { CPagination } from '@coreui/react';
import dayjs from 'dayjs';
import moment from 'moment';
import React from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import { APP_DATE_FORMAT } from '../../config/constants';
import { IRecordParams } from '../../views/records/records.api';
import { calculateDateDifference, insertCommas, returnOptionNameById } from '../casual-helpers';
import { RecordType } from '../enumeration/recordType';
import {
  IRecordClaim,
  IRecordOwnership,
  IRecordRegister,
  IRecordUnRegister,
  IRecordWithdraw
} from '../models/record.model';
import { TableType, TRecordTypeArray } from './ActivityLogsContainer';
import CopyTextToClipBoard from './CopyTextToClipboard';

interface IActivityLogsTable {
  overview: boolean;
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
  overview: boolean;
}

type TRecordTypeMappingRender = { [key in RecordType]: ({ record, transFunc }: IRecordTableProps<any>) => JSX.Element };

const renderRecordOwnerShip = ({ record, transFunc, overview }: IRecordTableProps<IRecordOwnership>) => (
  <>
    {overview && (
      <tr>
        <td>{transFunc('anftDapp.listingComponent.primaryInfo.blockchainAddress')}</td>
        <td className="text-right">
          <CopyTextToClipBoard text={record.listingAddress} inputClassName="copy-address" />
        </td>
      </tr>
    )}
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

const renderRecordClaim = ({ record, transFunc, overview }: IRecordTableProps<IRecordClaim>) => (
  <>
    {overview && (
      <tr>
        <td>{transFunc('anftDapp.listingComponent.primaryInfo.blockchainAddress')}</td>
        <td className="text-right">
          <CopyTextToClipBoard text={record.listingAddress} inputClassName="copy-address" />
        </td>
      </tr>
    )}
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

const renderRecordRegister = ({ record, transFunc, overview }: IRecordTableProps<IRecordRegister>) => (
  <>
    {overview && (
      <tr>
        <td>{transFunc('anftDapp.listingComponent.primaryInfo.blockchainAddress')}</td>
        <td className="text-right">
          <CopyTextToClipBoard text={record.listingAddress} inputClassName="copy-address" />
        </td>
      </tr>
    )}
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

const renderRecordUnRegister = ({ record, transFunc, overview }: IRecordTableProps<IRecordUnRegister>) => (
  <>
    {overview && (
      <tr>
        <td>{transFunc('anftDapp.listingComponent.primaryInfo.blockchainAddress')}</td>
        <td className="text-right">
          <CopyTextToClipBoard text={record.listingAddress} inputClassName="copy-address" />
        </td>
      </tr>
    )}
    <tr>
      <td>{transFunc('anftDapp.registerComponent.activity')}</td>
      <td className="text-right">{returnOptionNameById(Number(record.optionId))}</td>
    </tr>
  </>
);

const renderRecordWithdraw = ({ record, transFunc, overview }: IRecordTableProps<IRecordWithdraw>) => (
  <>
    {overview && (
      <tr>
        <td>{transFunc('anftDapp.listingComponent.primaryInfo.blockchainAddress')}</td>
        <td className="text-right">
          <CopyTextToClipBoard text={record.listingAddress} inputClassName="copy-address" />
        </td>
      </tr>
    )}
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

const ActivityLogsTable = (props: IActivityLogsTable) => {
  const { filterState, totalPages, loading, tableType, handlePaginationChange, results, recordType, overview } = props;

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
                <tbody>{renderRecordTbody({ record: result, transFunc: t, overview })}</tbody>
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
