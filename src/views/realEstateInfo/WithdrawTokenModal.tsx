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
  import { IWallet } from '../../shared/models/wallet.model';
  import { Formik } from 'formik';
  
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
      <CModal show={visible} onClose={closeModal(false)} closeOnBackdrop={false} centered className="withdraw-modal">
        <CModalHeader className="justify-content-center">
          <CModalTitle className="withdraw-modal-title">Rút ANFT</CModalTitle>
        </CModalHeader>
        <Formik enableReinitialize initialValues={initialValues} onSubmit={(values) => {}}>
          {({
            isSubmitting,
            values,
            errors,
            touched,
            setFieldValue,
            handleChange,
            setFieldTouched,
            handleSubmit,
            handleBlur,
            resetForm,
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
                          className="token-required"
                        />
                      </CCol>
                    </CFormGroup>
                  </CCol>
                </CRow>
              </CModalBody>
              <CModalFooter className="justify-content-between">
                  <CCol>
                    <CButton
                      className="px-2 w-100 btn-cancel-requirement btn btn-outline-primary" onClick={closeModal(false)}
                    >
                      HỦY
                    </CButton>
                  </CCol>
                  <CCol>
                    <CButton
                      className="px-2 w-100 btn btn-primary btn-cancel-requirement"
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
  