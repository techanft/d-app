import CIcon from '@coreui/icons-react';
import {
  CButton,
  CCol,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInvalidFeedback,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react';
import { Formik } from 'formik';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { account, ILoginForm, loginKeyCloak } from '../../views/auth/auth.api';
import { fetching, resetEntity, setLoginModalVisible } from '../../views/auth/auth.reducer';
import { IUpdatePriceTransaction, updatePriceTransaction } from '../../views/transactions/transactions.api';
import {
  IUpdateBusinessPrice,
  fetching as fetchingTransaction,
  softReset,
} from '../../views/transactions/transactions.reducer';
import { BROADCAST_INSTANCE } from '../blockchain-helpers';
import { MessageType } from '../enumeration/messageType';
import { Roles } from '../enumeration/roles';
import { RootState } from '../reducers';
import { ToastError, ToastSuccess } from './Toast';

const initialValues: ILoginForm = { username: '', password: '', rememberMe: false };

const LoginModal = () => {
  const { loginSuccess, errorMessage, user, loginModalVisible } = useSelector(
    (state: RootState) => state.authentication
  );
  const { businessPrice, updateBusinessPriceSuccess } = useSelector((state: RootState) => state.transactions);
  const { signer, signerAddress } = useSelector((state: RootState) => state.wallet);
  const { token } = useSelector((state: RootState) => state.authentication);

  const setLoginModalVisibility = (key: boolean) => dispatch(setLoginModalVisible(key));

  const isRoleUser = user?.role === Roles.USER;

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const validationSchema = Yup.object().shape({
    username: Yup.string().trim().required(t('anftDapp.loginModal.pleaseEnterUserName')),
    password: Yup.string().trim().required(t('anftDapp.loginModal.pleaseEnterPassword')),
  });

  const onClose = () => setLoginModalVisibility(false);

  useEffect(() => {
    if (loginSuccess) {
      ToastSuccess(t('anftDapp.loginModal.loginSuccess'));
      setLoginModalVisibility(false);
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

  useEffect(() => {
    let tempToken = token;
    if (!tempToken) {
      tempToken = localStorage.getItem('authentication_token');
    }
    
    if (tempToken) {
      dispatch(fetching());
      dispatch(account());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  

  const handleValuesUpdatePrice = (values: IUpdateBusinessPrice): IUpdatePriceTransaction => {
    if (!signer) {
      throw Error('No Signer found');
    }
    const BroadcastInstance = BROADCAST_INSTANCE({ signer });
    if (!BroadcastInstance) {
      throw Error('Error in gerenating Broadcast Instance');
    }

    const output: IUpdatePriceTransaction = {
      type: MessageType.UPDATE_PRICE,
      rentPrice: Number(values.rentPrice || 0),
      sellPrice: Number(values.sellPrice || 0),
      listingId: values.listingId,
      instance: BroadcastInstance,
    };
    return output;
  };

  useEffect(() => {
    if (user && businessPrice) {
      const bodyUpdateBusinessPrice = handleValuesUpdatePrice(businessPrice);
      if (!isRoleUser) return ToastError(t(`anftDapp.listingComponent.extendOwnership.remAccountInvalid`));
      if (user.walletAddress !== signerAddress)
        return ToastError(t(`anftDapp.listingComponent.extendOwnership.walletAddressNotMatchRemAccountWalletAddress`));

      dispatch(fetchingTransaction());
      dispatch(updatePriceTransaction(bodyUpdateBusinessPrice));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(user), JSON.stringify(businessPrice)]);

  useEffect(() => {
    if (updateBusinessPriceSuccess) {
      ToastSuccess(t('anftDapp.listingComponent.extendOwnership.updateBusinessPriceSuccess'));
      dispatch(softReset());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateBusinessPriceSuccess]);

  return (
    <CModal show={loginModalVisible} centered className="border-radius-modal" closeOnBackdrop={false}>
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
