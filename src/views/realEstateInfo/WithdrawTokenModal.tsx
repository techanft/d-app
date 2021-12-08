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
  CRow
} from '@coreui/react';
import { Formik } from 'formik';
import React from 'react';
import { IWallet } from '../../shared/models/wallet.model';
  
  interface IWithdrawTokenModal {
    visible: boolean;
    setVisible: (visible: boolean) => void;
  }
  
  const WithdrawTokenModal = (props: IWithdrawTokenModal) => {
    const { visible, setVisible } = props;
    const closeModal = (key: boolean) => (): void => setVisible(key);
  
    const initialValues: IWallet = {
      totalToken: '10.000',
      totalTokenRecharged: '5.000',
      maxTokenWithdraw: '1.000',
      tokenWithdraw: '',
    };
  
    return (
      <CModal show={visible} onClose={closeModal(false)} closeOnBackdrop={false} centered className="border-radius-modal">
        <CModalHeader className="justify-content-center">
          <CModalTitle className="modal-title-style">Rút ANFT</CModalTitle>
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
                      <CCol xs={8}>
                        <CLabel className="withdraw-token-title">Số ANFT bạn đã nạp</CLabel>
                      </CCol>
                      <CCol xs={4}>
                        <p className="text-primary text-right">{values.totalTokenRecharged}</p>
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                      <CCol xs={8}>
                        <CLabel className="withdraw-token-title">Số ANFT Tối đa bạn rút</CLabel>
                      </CCol>
                      <CCol xs={4}>
                        <p className="text-primary text-right">{values.maxTokenWithdraw}</p>
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                      <CCol xs={12}>
                        <CLabel className="withdraw-token-title">Số ANFT muốn rút</CLabel>
                      </CCol>
                      <CCol>
                        <CInput
                          onChange={handleChange}
                          id="tokenWithdraw"
                          autoComplete="off"
                          name="tokenWithdraw"
                          value={values.tokenWithdraw}
                          onBlur={handleBlur}
                          invalid={!!(errors.tokenWithdraw && touched.tokenWithdraw && errors.tokenWithdraw)}
                          className="btn-radius-50"
                        />
                      </CCol>
                    </CFormGroup>
                  </CCol>
                </CRow>
              </CModalBody>
              <CModalFooter className="justify-content-between">
                  <CCol>
                    <CButton
                      className="px-2 w-100 btn-font-style btn btn-outline-primary btn-radius-50" onClick={closeModal(false)}
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
  
  export default WithdrawTokenModal;
  