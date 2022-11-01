import CIcon from '@coreui/icons-react';
import {
  CButton,
  CCol,
  CForm,
  CInput,
  CInputGroup, CInputGroupPrepend,
  CInvalidFeedback,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow
} from '@coreui/react';
import { Formik } from 'formik';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { ILoginForm, loginKeyCloak } from '../../views/auth/auth.api';
import { fetching, resetEntity } from '../../views/auth/auth.reducer';
import { RootState } from '../reducers';
import { ToastError, ToastSuccess } from './Toast';

interface ILoginModal {
  isVisible: boolean;
  setVisibility: (visible: boolean) => void;
}

const initialValues: ILoginForm = { username: '', password: '', rememberMe: false };

const LoginModal = ({ isVisible, setVisibility }: ILoginModal) => {
  const { loginSuccess, errorMessage } = useSelector((state: RootState) => state.authentication);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const validationSchema = Yup.object().shape({
    username: Yup.string().trim().required(t('anftDapp.loginModal.pleaseEnterUserName')),
    password: Yup.string().trim().required(t('anftDapp.loginModal.pleaseEnterPassword')),
  });

  const onClose = () => setVisibility(false);

  useEffect(() => {
    if (loginSuccess) {
      ToastSuccess(t('anftDapp.loginModal.loginSuccess'));
      setVisibility(false);
      dispatch(resetEntity());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginSuccess]);

  useEffect(() => {
    if (errorMessage) {
      ToastError(t(`anftDapp.global.errors.${errorMessage}`));
      dispatch(resetEntity());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorMessage]);

  return (
    <CModal show={isVisible} centered className="border-radius-modal" closeOnBackdrop={false}>
      <CModalHeader className="justify-content-center">
        <CModalTitle className="modal-title-style">{t('anftDapp.loginModal.title')}</CModalTitle>
      </CModalHeader>
      <Formik
        enableReinitialize
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={(values) => {
          dispatch(fetching());
          dispatch(loginKeyCloak(values));
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
          <CForm onSubmit={handleSubmit}>
            <CModalBody>
              <CRow>
                <CCol xs={12}>
                  <CInputGroup>
                    <CInputGroupPrepend>
                      <CButton color="primary" className="btn-radius-50">
                        <CIcon name="cil-user" className="m-0 mb-1" />
                      </CButton>
                    </CInputGroupPrepend>
                    <CInput
                      onChange={handleChange}
                      id="username"
                      autoComplete="off"
                      name="username"
                      value={values.username}
                      onBlur={handleBlur}
                      placeholder={`${t('anftDapp.loginModal.userName')}...`}
                      className="btn-radius-50 h-auto"
                    />
                  </CInputGroup>
                  <CInvalidFeedback className={!!errors.username && touched.username ? 'd-block' : 'd-none'}>
                    {errors.username}
                  </CInvalidFeedback>
                </CCol>
              </CRow>
              <CRow className={'mt-3'}>
                <CCol xs={12}>
                  <CInputGroup>
                    <CInputGroupPrepend>
                      <CButton color="primary" className="btn-radius-50">
                        <CIcon name="cil-lock-locked" className="m-0 mb-1" />
                      </CButton>
                    </CInputGroupPrepend>
                    <CInput
                      onChange={handleChange}
                      id="password"
                      autoComplete="off"
                      name="password"
                      type="password"
                      value={values.password}
                      onBlur={handleBlur}
                      placeholder={`${t('anftDapp.loginModal.password')}...`}
                      className="btn-radius-50 h-auto"
                    />
                  </CInputGroup>
                  <CInvalidFeedback className={!!errors.password && touched.password ? 'd-block' : 'd-none'}>
                    {errors.password}
                  </CInvalidFeedback>
                </CCol>
              </CRow>
            </CModalBody>
            <CModalFooter className="justify-content-between">
              <CCol>
                <CButton
                  className={`px-2 w-100 btn-font-style btn-radius-50 btn btn-outline-primary`}
                  onClick={onClose}
                >
                  {t('anftDapp.global.modal.cancel')}
                </CButton>
              </CCol>
              <CCol>
                <CButton className={`px-2 w-100 btn btn-primary btn-font-style btn-radius-50`} type="submit">
                  {t('anftDapp.loginModal.login')}
                </CButton>
              </CCol>
            </CModalFooter>
          </CForm>
        )}
      </Formik>
    </CModal>
  );
};

export default LoginModal;
