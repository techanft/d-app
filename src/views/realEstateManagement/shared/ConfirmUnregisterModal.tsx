import { CButton, CCol, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import React from 'react';

interface IUnregisterModal {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  registerLevel: string;
  activityName: string;
}

const UnregisterModal = (props: IUnregisterModal) => {
  const { visible, setVisible, registerLevel, activityName } = props;
  const closeModal = (key: boolean) => (): void => setVisible(key);

  return (
    <CModal show={visible} onClose={closeModal(false)} closeOnBackdrop={false} centered className="border-radius-modal">
      <CModalHeader className="justify-content-center">
        <CModalTitle className="modal-title-style">Xác nhận hủy đăng ký</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <p>
          Bạn chắc chắn muốn hủy <span className="text-primary">“{activityName}”</span> với đăng ký{' '}
          <span className="text-primary">{registerLevel} ANFT</span>
        </p>
      </CModalBody>
      <CModalFooter className="justify-content-between">
        <CCol>
          <CButton
            className="px-2 w-100 btn-font-style btn btn-outline-danger btn-radius-50"
            onClick={closeModal(false)}
          >
            HỦY
          </CButton>
        </CCol>
        <CCol>
          <CButton className="px-2 w-100 btn btn-danger btn-font-style btn-radius-50" onClick={closeModal(false)}>
            ĐỒNG Ý
          </CButton>
        </CCol>
      </CModalFooter>
    </CModal>
  );
};

export default UnregisterModal;
