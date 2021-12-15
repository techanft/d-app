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
  CRow,
} from '@coreui/react';
import { Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import { estimateOwnership } from '../../shared/helper';

interface IRechargeTokenModal {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const RechargeTokenModal = (props: IRechargeTokenModal) => {
  const { visible, setVisible } = props;
  const closeModal = (key: boolean) => (): void => setVisible(key);

  const initialValues = {
    totalToken: 10000,
    totalTokenRecharged: 5000,
    maxTokenWithdraw: 1000,
    tokenRecharge: 0,
    workFee: 5000,
  };

  const validationSchema = Yup.object().shape({
    tokenRecharge: Yup.number().required('Vui lòng nhập số token muốn nạp'),
  });

  return (
    <CModal show={visible} onClose={closeModal(false)} closeOnBackdrop={false} centered className="border-radius-modal">
      <CModalHeader className="justify-content-center">
        <CModalTitle className="modal-title-style">Nạp ANFT</CModalTitle>
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
                      <CLabel className="recharge-token-title">Số ANFT bạn đã nạp</CLabel>
                    </CCol>
                    <CCol xs={4}>
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
                        value={values.tokenRecharge || ''}
                        onBlur={handleBlur}
                        className="btn-radius-50"
                        type="number"
                      />
                      <CInvalidFeedback
                        className={!!errors.tokenRecharge && touched.tokenRecharge ? 'd-block' : 'd-none'}
                      >
                        {errors.tokenRecharge}
                      </CInvalidFeedback>
                    </CCol>
                  </CFormGroup>
                  <CFormGroup row>
                    <CCol xs={8}>
                      <CLabel className="recharge-token-title">Ownership Period</CLabel>
                    </CCol>
                    <CCol xs={4}>
                      <p className="text-primary text-right">
                        {estimateOwnership(values.tokenRecharge, values.workFee)} days
                      </p>
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

export default RechargeTokenModal;
