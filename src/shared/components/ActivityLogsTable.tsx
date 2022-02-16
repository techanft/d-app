import { CLink, CPagination } from '@coreui/react';
import moment from 'moment';
import React from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import { APP_DATE_FORMAT, BLOCKCHAIN_NETWORK } from '../../config/constants';
import { IRecordParams } from '../../views/records/records.api';
import { calculateDateDifference, getEllipsisTxt, insertCommas, returnOptionNameById } from '../casual-helpers';
import { RecordType } from '../enumeration/recordType';
import {
  IRecordClaim,
  IRecordOwnership,
  IRecordRegister,
  IRecordUnRegister,
  IRecordWithdraw
} from '../models/record.model';
import { TableType, TRecordTypeArray } from './ActivityLogsContainer';

interface IActivityLogsTable {
  shouldDisplayBlockchainAddress: boolean;
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
  shouldDisplayBlockchainAddress: boolean;
}

type TRecordTypeMappingRender = { [key in RecordType]: ({ record, transFunc }: IRecordTableProps<any>) => JSX.Element };

const renderRecordOwnerShip = ({
  record,
  transFunc,
  shouldDisplayBlockchainAddress,
}: IRecordTableProps<IRecordOwnership>) => (
  <>
    <tr>
      <td>{transFunc('anftDapp.activityLogsComponent.activityLogsTable.listing')}</td>
      <td className="text-right text-truncate" style={{ maxWidth: '100px' }}>
        <CLink to={`/${record.listingId}/detail`}>{`BĐS thử nghiệm ${record.listingId}`}</CLink>
      </td>
    </tr>
    {record.txHash && (
      <tr>
        <td>{transFunc('anftDapp.activityLogsComponent.activityLogsTable.txHash')}</td>
        <td className="text-right">
          <span>
            <CLink
              target="_blank"
              rel="noreferrer noopener"
              href={`${BLOCKCHAIN_NETWORK.blockExplorerUrls}/tx/${record.txHash}`}
            >
              {getEllipsisTxt(record.txHash, 6)}
            </CLink>
          </span>
        </td>
      </tr>
    )}
    {shouldDisplayBlockchainAddress && (
      <tr>
        <td>{transFunc('anftDapp.listingComponent.primaryInfo.blockchainAddress')}</td>
        <td className="text-right">
          <span>
            <CLink
              target="_blank"
              rel="noreferrer noopener"
              href={`${BLOCKCHAIN_NETWORK.blockExplorerUrls}/address/${record.listingAddress}`}
            >
              {getEllipsisTxt(record.listingAddress, 6)}
            </CLink>
          </span>
        </td>
      </tr>
    )}
    <tr>
      <td>{transFunc('anftDapp.activityLogsComponent.activityLogsTable.from')}</td>
      <td className="text-right">{moment(record.from).format(APP_DATE_FORMAT)}</td>
    </tr>
    <tr>
      <td>{transFunc('anftDapp.activityLogsComponent.activityLogsTable.to')}</td>
      <td className="text-right">{moment(record.to).format(APP_DATE_FORMAT)}</td>
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

const renderRecordClaim = ({ record, transFunc, shouldDisplayBlockchainAddress }: IRecordTableProps<IRecordClaim>) => (
  <>
    <tr>
      <td>{transFunc('anftDapp.activityLogsComponent.activityLogsTable.listing')}</td>
      <td className="text-right text-truncate" style={{ maxWidth: '100px' }}>
        <CLink to={`/${record.listingId}/detail`}>{`BĐS thử nghiệm ${record.listingId}`}</CLink>
      </td>
    </tr>
    {record.txHash && (
      <tr>
        <td>{transFunc('anftDapp.activityLogsComponent.activityLogsTable.txHash')}</td>
        <td className="text-right">
          <span>
            <CLink
              target="_blank"
              rel="noreferrer noopener"
              href={`${BLOCKCHAIN_NETWORK.blockExplorerUrls}/tx/${record.txHash}`}
            >
              {getEllipsisTxt(record.txHash, 6)}
            </CLink>
          </span>
        </td>
      </tr>
    )}
    {shouldDisplayBlockchainAddress && (
      <tr>
        <td>{transFunc('anftDapp.listingComponent.primaryInfo.blockchainAddress')}</td>
        <td className="text-right">
          <span>
            <CLink
              target="_blank"
              rel="noreferrer noopener"
              href={`${BLOCKCHAIN_NETWORK.blockExplorerUrls}/address/${record.listingAddress}`}
            >
              {getEllipsisTxt(record.listingAddress, 6)}
            </CLink>
          </span>
        </td>
      </tr>
    )}
    <tr>
      <td>{transFunc('anftDapp.activityLogsComponent.activityLogsTable.amount')}</td>
      <td className="text-right">{insertCommas(record.amount || '', 6)}</td>
    </tr>

    <tr>
      <td>{transFunc('anftDapp.registerComponent.stakeStart')}</td>
      <td className="text-right">{moment(record.from).format(APP_DATE_FORMAT)}</td>
    </tr>
    <tr>
      <td>{transFunc('anftDapp.activityLogsComponent.activityLogsTable.claimTime')}</td>
      <td className="text-right">{moment(record.to).format(APP_DATE_FORMAT)}</td>
    </tr>
  </>
);

const renderRecordRegister = ({
  record,
  transFunc,
  shouldDisplayBlockchainAddress,
}: IRecordTableProps<IRecordRegister>) => (
  <>
    <tr>
      <td>{transFunc('anftDapp.activityLogsComponent.activityLogsTable.listing')}</td>
      <td className="text-right text-truncate" style={{ maxWidth: '100px' }}>
        <CLink to={`/${record.listingId}/detail`}>{`BĐS thử nghiệm ${record.listingId}`}</CLink>
      </td>
    </tr>
    {record.txHash && (
      <tr>
        <td>{transFunc('anftDapp.activityLogsComponent.activityLogsTable.txHash')}</td>
        <td className="text-right">
          <span>
            <CLink
              target="_blank"
              rel="noreferrer noopener"
              href={`${BLOCKCHAIN_NETWORK.blockExplorerUrls}/tx/${record.txHash}`}
            >
              {getEllipsisTxt(record.txHash, 6)}
            </CLink>
          </span>
        </td>
      </tr>
    )}
    {shouldDisplayBlockchainAddress && (
      <tr>
        <td>{transFunc('anftDapp.listingComponent.primaryInfo.blockchainAddress')}</td>
        <td className="text-right">
          <span>
            <CLink
              target="_blank"
              rel="noreferrer noopener"
              href={`${BLOCKCHAIN_NETWORK.blockExplorerUrls}/address/${record.listingAddress}`}
            >
              {getEllipsisTxt(record.listingAddress, 6)}
            </CLink>
          </span>
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

const renderRecordUnRegister = ({
  record,
  transFunc,
  shouldDisplayBlockchainAddress,
}: IRecordTableProps<IRecordUnRegister>) => (
  <>
    <tr>
      <td>{transFunc('anftDapp.activityLogsComponent.activityLogsTable.listing')}</td>
      <td className="text-right text-truncate" style={{ maxWidth: '100px' }}>
        <CLink to={`/${record.listingId}/detail`}>{`BĐS thử nghiệm ${record.listingId}`}</CLink>
      </td>
    </tr>
    {record.txHash && (
      <tr>
        <td>{transFunc('anftDapp.activityLogsComponent.activityLogsTable.txHash')}</td>
        <td className="text-right">
          <span>
            <CLink
              target="_blank"
              rel="noreferrer noopener"
              href={`${BLOCKCHAIN_NETWORK.blockExplorerUrls}/tx/${record.txHash}`}
            >
              {getEllipsisTxt(record.txHash, 6)}
            </CLink>
          </span>
        </td>
      </tr>
    )}
    {shouldDisplayBlockchainAddress && (
      <tr>
        <td>{transFunc('anftDapp.listingComponent.primaryInfo.blockchainAddress')}</td>
        <td className="text-right">
          <span>
            <CLink
              target="_blank"
              rel="noreferrer noopener"
              href={`${BLOCKCHAIN_NETWORK.blockExplorerUrls}/address/${record.listingAddress}`}
            >
              {getEllipsisTxt(record.listingAddress, 6)}
            </CLink>
          </span>
        </td>
      </tr>
    )}
    <tr>
      <td>{transFunc('anftDapp.registerComponent.activity')}</td>
      <td className="text-right">{returnOptionNameById(Number(record.optionId))}</td>
    </tr>
  </>
);

const renderRecordWithdraw = ({
  record,
  transFunc,
  shouldDisplayBlockchainAddress,
}: IRecordTableProps<IRecordWithdraw>) => (
  <>
    <tr>
      <td>{transFunc('anftDapp.activityLogsComponent.activityLogsTable.listing')}</td>
      <td className="text-right text-truncate" style={{ maxWidth: '100px' }}>
        <CLink to={`/${record.listingId}/detail`}>{`BĐS thử nghiệm ${record.listingId}`}</CLink>
      </td>
    </tr>
    {record.txHash && (
      <tr>
        <td>{transFunc('anftDapp.activityLogsComponent.activityLogsTable.txHash')}</td>
        <td className="text-right">
          <span>
            <CLink
              target="_blank"
              rel="noreferrer noopener"
              href={`${BLOCKCHAIN_NETWORK.blockExplorerUrls}/tx/${record.txHash}`}
            >
              {getEllipsisTxt(record.txHash, 6)}
            </CLink>
          </span>
        </td>
      </tr>
    )}
    {shouldDisplayBlockchainAddress && (
      <tr>
        <td>{transFunc('anftDapp.listingComponent.primaryInfo.blockchainAddress')}</td>
        <td className="text-right">
          <span>
            <CLink
              target="_blank"
              rel="noreferrer noopener"
              href={`${BLOCKCHAIN_NETWORK.blockExplorerUrls}/address/${record.listingAddress}`}
            >
              {getEllipsisTxt(record.listingAddress, 6)}
            </CLink>
          </span>
        </td>
      </tr>
    )}
    <tr>
      <td>{transFunc('anftDapp.activityLogsComponent.activityLogsTable.initialOwnership')}</td>
      <td className="text-right">{moment.unix(Number(record.initialOwnership)).format(APP_DATE_FORMAT)}</td>
    </tr>
    <tr>
      <td>{transFunc('anftDapp.activityLogsComponent.activityLogsTable.newOwnership')}</td>
      <td className="text-right">{moment.unix(Number(record.newOwnership)).format(APP_DATE_FORMAT)}</td>
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
  const {
    filterState,
    totalPages,
    loading,
    tableType,
    handlePaginationChange,
    results,
    recordType,
    shouldDisplayBlockchainAddress,
  } = props;

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
                    <th>{moment(result.createdDate).format(APP_DATE_FORMAT)}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>{renderRecordTbody({ record: result, transFunc: t, shouldDisplayBlockchainAddress })}</tbody>
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
