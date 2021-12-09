import {
    CButton,
    CCol,
    CForm,
    CFormGroup,
    CInput,
    CInvalidFeedback,
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
import * as Yup from 'yup';
import { calculateOwnerTime } from '../../shared/helper';
  
  interface IRegisterOwnershipModal {
    visible: boolean;
    setVisible: (visible: boolean) => void;
  }
  
  const RegisterOwnershipModal = (props: IRegisterOwnershipModal) => {
    const { visible, setVisible } = props;
    const closeModal = (key: boolean) => (): void => setVisible(key);
  
    const initialValues = {
      exploitedFee : 5000,
      registrationToken: 0,
      ownerTime: ''
    };
  
    const validationSchema = Yup.object().shape({
      tokenRecharge: Yup.string().required("Vui lòng nhập số token muốn nạp"),
    });
  
    return (
      <CModal show={visible} onClose={closeModal(false)} closeOnBackdrop={false} centered className="border-radius-modal">
        <CModalHeader className="justify-content-center">
          <CModalTitle className="modal-title-style">Đăng ký sở hữu</CModalTitle>
        </CModalHeader>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => {}}
        >
          {({ values, errors, touched, handleChange, handleSubmit, handleBlur }) => (
            <CForm onSubmit={handleSubmit}>
              <CModalBody>
                <CRow>
                  <CCol xs={12}>
                    <CFormGroup row>
                      <CCol xs={8}>
                        <CLabel className="recharge-token-title">Chi phí khai thác/ngày</CLabel>
                      </CCol>
                      <CCol xs={4}>
                        <p className="text-primary text-right">{values.exploitedFee}</p>
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                      <CCol xs={12}>
                        <CLabel className="recharge-token-title">Số ANFT muốn nạp</CLabel>
                      </CCol>
                      <CCol>
                        <CInput
                          onChange={handleChange}
                          id="registrationToken"
                          autoComplete="off"
                          name="registrationToken"
                          value={values.registrationToken}
                          onBlur={handleBlur}
                          className="btn-radius-50"
                          type="number"
                        />
                        <CInvalidFeedback
                          className={!!errors.registrationToken && touched.registrationToken ? 'd-block' : 'd-none'}
                        >
                          {errors.registrationToken}
                        </CInvalidFeedback>
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                      <CCol xs={8}>
                        <CLabel className="recharge-token-title">Ownership Period</CLabel>
                      </CCol>
                      <CCol xs={4}>
                        <p className="text-primary text-right">{calculateOwnerTime(values.registrationToken,values.exploitedFee)} days</p>
                      </CCol>
                    </CFormGroup>
                  </CCol>
                </CRow>
              </CModalBody>
              <CModalFooter className="justify-content-between">
                <CCol>
                  <CButton
                    className="px-2 w-100 btn-font-style btn-radius-50 btn btn-outline-primary"
                    onClick={closeModal(false)}
                  >
                    HỦY
                  </CButton>
                </CCol>
                <CCol>
                  <CButton className="px-2 w-100 btn btn-primary btn-font-style btn-radius-50" type="submit">
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
  
  export default RegisterOwnershipModal;
  