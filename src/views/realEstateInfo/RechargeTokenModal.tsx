import {
  CButton,
  CCol,
  CForm,
  CFormGroup,
  CInput,
  CLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react';
import React from 'react';
import { Formik } from 'formik';
import { IWallet } from '../../shared/models/wallet.model';

interface IRechargeTokenModal {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const RechargeTokenModal = (props: IRechargeTokenModal) => {
  const { visible, setVisible } = props;
  const closeModal = (key: boolean) => (): void => setVisible(key);

  const initialValues: IWallet = {
    totalToken: '10.000',
    totalTokenRecharged: '5.000',
    maxTokenWithdraw: '1.000',
    tokenRecharge: '',
  };

  return (
    <CModal show={visible} onClose={closeModal(false)} closeOnBackdrop={false} centered className='border-radius-modal'>
      <CModalHeader className="justify-content-center">
        <CModalTitle className="modal-title-style">Nạp ANFT</CModalTitle>
      </CModalHeader>
      <Formik enableReinitialize initialValues={initialValues} onSubmit={(values) => {}}>
        {({
          values,
          errors,
          touched,
          handleChange,
          handleSubmit,
          handleBlur,
        }) => (
          <CForm onSubmit={handleSubmit}>
            <CModalBody>
              <CRow>
                <CCol xs={12}>
                  <CFormGroup row>
                    <CCol xs={9}>
                      <CLabel className="recharge-token-title">Số ANFT bạn đã nạp</CLabel>
                    </CCol>
                    <CCol xs={3}>
                      <p className="text-primary text-right">{values.totalTokenRecharged}</p>
                    </CCol>
                  </CFormGroup>
                  <CFormGroup row>
                    <CCol xs={12}>
                      <CLabel className="recharge-token-title">Số ANFT muốn nạp</CLabel>
                    </CCol>
                    <CCol>
                      <CInput
                        onChange={handleChange}
                        id="tokenRecharge"
                        autoComplete="off"
                        name="tokenRecharge"
                        value={values.tokenRecharge}
                        onBlur={handleBlur}
                        invalid={!!(errors.tokenRecharge && touched.tokenRecharge && errors.tokenRecharge)}
                        className="btn-radius-50"
                      />
                    </CCol>
                  </CFormGroup>
                  <CFormGroup row>
                    <CCol xs={9}>
                      <CLabel className="recharge-token-title">Thời gian quy đổi với số ANFT nạp</CLabel>
                    </CCol>
                    <CCol xs={3}>
                      <p className="text-primary text-right">05 days</p>
                    </CCol>
                  </CFormGroup>
                </CCol>
              </CRow>
            </CModalBody>
            <CModalFooter className="justify-content-between">
                <CCol>
                  <CButton
                    className="px-2 w-100 btn-font-style btn-radius-50 btn btn-outline-primary" onClick={closeModal(false)}
                  >
                    HỦY
                  </CButton>
                </CCol>
                <CCol>
                  <CButton
                    className="px-2 w-100 btn btn-primary btn-font-style btn-radius-50"
                    type="submit"
                  >
                    ĐỒNG Ý
                  </CButton>
                </CCol>
            </CModalFooter>
          </CForm>
        )}
      </Formik>
    </CModal>
  );
};

export default RechargeTokenModal;
