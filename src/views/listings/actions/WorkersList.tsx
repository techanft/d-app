import CIcon from '@coreui/icons-react';
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardTitle,
  CCol,
  CContainer,
  CDataTable,
  CLabel,
  CRow,
} from '@coreui/react';
import React, { useState } from 'react';
import bgImg from '../../../assets/img/registerBonus.svg';
import { mapWorkerStatusBadge, WorkerStatus } from '../../../shared/enumeration/workerStatus';
import ConfirmModal from '../../../shared/components/ConfirmModal';
import { IWorkerPermission } from '../../../shared/models/workerPermission.model';
import AddWorkerPermission from './AddWorkerModal';

const WorkerManagement = () => {
  const titleTableStyle = {
    textAlign: 'left',
    color: '#828282',
    fontSize: '0.875rem',
    lineHeight: '16px',
    fontWeight: '400',
  };
  const fields = [
    { key: 'address', _style: titleTableStyle, label: 'Address' },
    { key: 'status', _style: titleTableStyle, label: 'Status' },
    { key: 'action', _style: titleTableStyle, label: 'Action' },
  ];

  const demoWorkerPermission: IWorkerPermission[] = [
    {
      createdDate: '17:10- 29/11/2021',
      status: WorkerStatus.true,
      address: '0xda3ac...9999',
    },
    {
      createdDate: '17:10- 29/11/2021',
      status: WorkerStatus.false,
      address: '0xda3ac...9999',
    },
    {
      createdDate: '17:10- 29/11/2021',
      status: WorkerStatus.true,
      address: '0xda3ac...9999',
    },
  ];

  const [addWorkerPermission, setAddWorkerPermission] = useState<boolean>(false);
  const [cancelWorkerPermission, setCancelWorkerPermission] = useState<boolean>(false);

  const setRequestListener = (key: boolean, setRequestState: any) => (): void => setRequestState(key);

  const onCloseModal = () => {
    setCancelWorkerPermission(false);
  };

  return (
    <CContainer fluid className="mx-0 my-2">
      <CRow>
        <CCol xs={12}>
          <CLabel className="text-primary content-title">Danh sách quyền khai thác</CLabel>
        </CCol>
        <CCol xs={12}>
          <CCard className="m-0 listing-img-card">
            <img src={bgImg} alt="listingImg" className="w-100 h-100" />
            <CCardBody className="p-0 listing-card-body">
              <CCardTitle className="listing-card-title mb-0 px-3 py-2 w-100">
                <p className="mb-2 text-white content-title">125 - Hoàn Kiếm - Hà Nội</p>
                <p className="mb-0 text-white detail-title-font">
                  Hoạt động <b>03</b>
                </p>
              </CCardTitle>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12}>
          <CDataTable
            striped
            items={demoWorkerPermission.filter((e) => e.status === WorkerStatus.true)}
            fields={fields}
            responsive
            hover
            header
            scopedSlots={{
              status: (item: IWorkerPermission) => {
                return (
                  <td>
                    {<CBadge color={mapWorkerStatusBadge[item.status]}>{item.status ? item.status : '_'}</CBadge>}
                  </td>
                );
              },
              action: (item: IWorkerPermission) => {
                return (
                  <td>
                    <CButton className="text-danger p-0" onClick={setRequestListener(true, setCancelWorkerPermission)}>
                      <CIcon name="cil-trash" />
                    </CButton>
                    <ConfirmModal
                      isVisible={cancelWorkerPermission}
                      color="danger"
                      title="Hủy quyền khai thác"
                      CustomJSX={() => (
                        <p>
                          Bạn chắc chắn muốn hủy quyền khai thác của{' '}
                          <span className="text-primary">{item.address}</span>
                        </p>
                      )}
                      onConfirm={() => {}}
                      onAbort={onCloseModal}
                    />
                  </td>
                );
              },
            }}
          />
        </CCol>
        <CCol xs={12} className="d-flex justify-content-center">
          <CButton
            className="my-2 px-3 w-100 btn-radius-50 btn-font-style btn-primary"
            onClick={setRequestListener(true, setAddWorkerPermission)}
          >
            Thêm quyền sở hữu
          </CButton>
        </CCol>
        <AddWorkerPermission visible={addWorkerPermission} setVisible={setAddWorkerPermission} />
      </CRow>
    </CContainer>
  );
};

export default WorkerManagement;
