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
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import QrReader from 'react-qr-reader';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { checkWorkerStatus, LISTING_INSTANCE } from '../../../shared/blockchain-helpers';
import { ToastError } from '../../../shared/components/Toast';
import { EventType } from '../../../shared/enumeration/eventType';
import { RootState } from '../../../shared/reducers';
import { selectEntityById } from '../../assets/assets.reducer';
import { baseSetterArgs } from '../../transactions/settersMapping';
import { IProceedTxBody, proceedTransaction } from '../../transactions/transactions.api';
import { fetching, softReset } from '../../transactions/transactions.reducer';

interface ICancelWorkerPermission {
  listingId: number;
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

interface IIntialValues {
  address: string;
}

const initialValues: IIntialValues = {
  address: '',
};

const AddWorkerPermission = (props: ICancelWorkerPermission) => {
  const { visible, setVisible, listingId } = props;
  const { t } = useTranslation();

  // FormikRef is type-able https://github.com/jaredpalmer/formik/issues/2290
  const formikRef = useRef<FormikProps<IIntialValues>>(null);
  const dispatch = useDispatch();
  const listing = useSelector(selectEntityById(listingId));
  const { signer } = useSelector((state: RootState) => state.wallet);
  const { submitted, loading } = useSelector((state: RootState) => state.transactions);

  useEffect(() => {
    if (submitted) {
      setVisible(false);
      formikRef.current?.resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted]);

  const validationSchema = Yup.object().shape({
    address: Yup.string()
      .required(t('anftDapp.workersListComponent.addressIsRequired'))
      .test('address-validation', t('anftDapp.workersListComponent.addressValidation'), function (value) {
        return utils.isAddress(value || '');
      })
      .nullable(),
  });

  const handleRawFormValues = (input: IIntialValues): IProceedTxBody => {
    if (!listing?.address) {
      throw Error('Error getting listing address');
    }
    if (!signer) {
      throw Error('No Signer found');
    }
    const instance = LISTING_INSTANCE({ address: listing.address, signer });
    if (!instance) {
      throw Error('Error in generating contract instance');
    }
    const output: IProceedTxBody = {
      listingId,
      contract: instance,
      type: EventType.UPDATE_WORKER,
      args: { ...baseSetterArgs, _worker: input.address },
    };

    return output;
  };

  const closeModal = () => {
    setVisible(false);
    setIsScanQrMode(false);
    formikRef.current?.resetForm();
  };

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
          {t('anftDapp.workersListComponent.addWorkerPermission')}
        </CModalTitle>
      </CModalHeader>

      <Formik<IIntialValues>
        innerRef={formikRef}
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (rawValues) => {
          try {
            const value = handleRawFormValues(rawValues);
            const workerAuthorized = await checkWorkerStatus(value.contract, rawValues.address, true);
            if (workerAuthorized) throw Error(t('anftDapp.workersListComponent.workerAuthorized'));
            dispatch(fetching());
            dispatch(proceedTransaction(value));
          } catch (error) {
            console.log(`Error submitting form ${error}`);
            ToastError(`${t('anftDapp.global.errors.errorSubmittingForm')}: ${error}`);
            dispatch(softReset());
          }
        }}
      >
        {({ values, errors, touched, handleChange, handleSubmit, handleBlur, setFieldValue, isSubmitting }) => (
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
                          onChange={handleChange}
                          autoComplete="off"
                          value={values.address || ''}
                          onBlur={handleBlur}
                          className="btn-radius-50"
                        />
                        <CInputGroupAppend>
                          <CButton color="primary" className="btn-radius-50 py-0 px-3" onClick={onScanFile}>
                            <CIcon name="cil-qr-code" />
                          </CButton>
                        </CInputGroupAppend>
                      </CInputGroup>
                      <CInvalidFeedback className={!!errors.address && touched.address ? 'd-block' : 'd-none'}>
                        {errors.address}
                      </CInvalidFeedback>
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
                  <CButton
                    disabled={loading || isSubmitting}
                    className="px-2 w-100 btn btn-primary btn-font-style btn-radius-50"
                    type="submit"
                  >
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

export default AddWorkerPermission;
