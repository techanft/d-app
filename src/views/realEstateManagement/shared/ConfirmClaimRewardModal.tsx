import { CButton, CCol, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import React from 'react';

interface IClaimRewardModal {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  reward: string;
  activityName: string;
}

const ClaimRewardModal = (props: IClaimRewardModal) => {
  const { visible, setVisible, reward, activityName } = props;
  const closeModal = (key: boolean) => (): void => setVisible(key);

  return (
    <CModal show={visible} onClose={closeModal(false)} closeOnBackdrop={false} centered className="border-radius-modal">
      <CModalHeader className="justify-content-center">
        <CModalTitle className="modal-title-style">Nhận thưởng hoạt động</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <p>
          Bạn chắc chắn muốn nhận thưởng <span className="text-primary">{reward} ANFT</span> của hoạt động <span className="text-primary">“{activityName}”</span>
        </p>
      </CModalBody>
      <CModalFooter className="justify-content-between">
        <CCol>
          <CButton
            className="px-2 w-100 btn-font-style btn btn-outline-success btn-radius-50"
            onClick={closeModal(false)}
          >
            HỦY
          </CButton>
        </CCol>
        <CCol>
          <CButton className="px-2 w-100 btn btn-success btn-font-style btn-radius-50" onClick={closeModal(false)}> 
            ĐỒNG Ý
          </CButton>
        </CCol>
      </CModalFooter>
    </CModal>
  );
};

export default ClaimRewardModal;
