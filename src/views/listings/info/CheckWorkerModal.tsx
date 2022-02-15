import CIcon from '@coreui/icons-react';
import {
  CButton,
  CCol,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupAppend,
  CInvalidFeedback,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { utils } from 'ethers';
import { Formik, FormikProps } from 'formik';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import QrReader from 'react-qr-reader';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { RootState } from '../../../shared/reducers';

interface ICancelWorkerPermission {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

interface IIntialValues {
  address: string;
}

const initialValues: IIntialValues = {
  address: '',
};

const CheckWorkerModal = (props: ICancelWorkerPermission) => {
  const { visible, setVisible } = props;
  const { t } = useTranslation();
  const { initialState: recordInitialState } = useSelector((state: RootState) => state.records);
  const { workers } = recordInitialState.workerInitialState;
  // FormikRef is type-able https://github.com/jaredpalmer/formik/issues/2290
  const formikRef = useRef<FormikProps<IIntialValues>>(null);

  const validationSchema = Yup.object().shape({
    address: Yup.string()
      .required(t('anftDapp.workersListComponent.addressIsRequired'))
      .test('address-validation', t('anftDapp.workersListComponent.addressValidation'), function (value) {
        return utils.isAddress(value || '');
      })
      .nullable(),
  });

  const closeModal = () => {
    setVisible(false);
    setIsScanQrMode(false);
    setCheckingResult('');
    setIsWorkerAuthorized(undefined);
    formikRef.current?.resetForm();
  };

  const [checkingResult, setCheckingResult] = useState<string>('');
  const [isWorkerAuthorized, setIsWorkerAuthorized] = useState<boolean | undefined>(undefined);
  const [isScanQrMode, setIsScanQrMode] = useState<boolean>(false);

  const handleErrorFile = (err: any) => {
    console.log(`${t('anftDapp.global.errors.qrScanError')}: ${err}`);
  };

  const handleScanFile = (result: string | null) => {
    if (result) {
      setIsScanQrMode(false);
    }
  };

  const onScanFile = () => {
    setIsScanQrMode(true);
    formikRef.current?.resetForm();
  };

  const handleCheckingResult = () => {
    if (isWorkerAuthorized === undefined) return;
    if (isWorkerAuthorized) {
      return (
        <p className="mb-0 mt-2 text-success">
          <CIcon name="cil-check-alt" /> {checkingResult}
        </p>
      );
    } else {
      return (
        <p className="mb-0 mt-2 text-danger">
          <CIcon name="cil-x" />
          {checkingResult}
        </p>
      );
    }
  };

  return (
    <CModal show={visible} onClose={closeModal} closeOnBackdrop={false} centered className="border-radius-modal">
      <CModalHeader>
        {isScanQrMode ? (
          <CButton className="p-0" onClick={() => setIsScanQrMode(false)}>
            <FontAwesomeIcon icon={faChevronLeft} size="lg" />
          </CButton>
        ) : (
          ''
        )}
        <CModalTitle className="modal-title-style m-auto">
          {t('anftDapp.listingComponent.primaryInfo.checkWorker.checkWorker')}
        </CModalTitle>
      </CModalHeader>
      <Formik<IIntialValues>
        innerRef={formikRef}
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          if (workers?.results.find((e) => e.worker === values.address)) {
            setCheckingResult(t('anftDapp.listingComponent.primaryInfo.checkWorker.workerAuthorized'));
            setIsWorkerAuthorized(true);
          } else {
            setCheckingResult(t('anftDapp.listingComponent.primaryInfo.checkWorker.workerNotAuthorized'));
            setIsWorkerAuthorized(false);
          }
        }}
      >
        {({ values, errors, touched, handleSubmit, handleBlur, setFieldValue }) => (
          <CForm onSubmit={handleSubmit}>
            <>
              <CModalBody>
                {isScanQrMode ? (
                  <CRow>
                    <CCol xs={12}>
                      {/* Due to browser implementations the camera can only be accessed over https or localhost */}
                      <QrReader
                        delay={300}
                        onError={handleErrorFile}
                        onScan={(data: string | null) => {
                          handleScanFile(data);
                          setFieldValue('address', data);
                        }}
                      />
                    </CCol>
                  </CRow>
                ) : (
                  <CRow>
                    <CCol xs={12}>
                      <p>{t('anftDapp.workersListComponent.addressWallet')}</p>
                    </CCol>
                    <CCol xs={12}>
                      <CInputGroup>
                        <CInput
                          type="text"
                          id="address"
                          name="address"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setFieldValue(`address`, e.target.value);
                            setCheckingResult('');
                            setIsWorkerAuthorized(undefined);
                          }}
                          autoComplete="off"
                          value={values.address || ''}
                          onBlur={handleBlur}
                          className="btn-radius-50"
                        />
                        <CInputGroupAppend>
                          <CButton
                            color="primary"
                            className="btn-radius-50 py-0 px-3"
                            onClick={() => {
                              onScanFile();
                              setCheckingResult('');
                              setIsWorkerAuthorized(undefined);
                            }}
                          >
                            <CIcon name="cil-qr-code" />
                          </CButton>
                        </CInputGroupAppend>
                      </CInputGroup>
                      <CInvalidFeedback className={!!errors.address && touched.address ? 'd-block' : 'd-none'}>
                        {errors.address}
                      </CInvalidFeedback>
                    </CCol>
                    <CCol xs={12} className={!!errors.address && touched.address ? 'd-none' : 'd-block text-center'}>
                      {handleCheckingResult()}
                    </CCol>
                  </CRow>
                )}
              </CModalBody>
              <CModalFooter className="justify-content-between">
                <CCol>
                  <CButton
                    className="px-2 w-100 btn-font-style btn btn-outline-primary btn-radius-50"
                    onClick={closeModal}
                  >
                    {t('anftDapp.global.modal.cancel')}
                  </CButton>
                </CCol>
                <CCol>
                  <CButton className="px-2 w-100 btn btn-primary btn-font-style btn-radius-50" type="submit">
                    {t('anftDapp.global.modal.confirm')}
                  </CButton>
                </CCol>
              </CModalFooter>
            </>
          </CForm>
        )}
      </Formik>
    </CModal>
  );
};

export default CheckWorkerModal;
