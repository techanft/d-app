import CIcon from '@coreui/icons-react';
import {
  CButton,
  CCol,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupAppend,
  CInvalidFeedback,
  CLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react';
import { utils } from 'ethers';
import { Formik, FormikProps } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
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

const AddWorkerPermission = (props: ICancelWorkerPermission) => {
  const { visible, setVisible, listingId } = props;

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

  const initialValues: IIntialValues = {
    address: '',
  };

  const validationSchema = Yup.object().shape({
    address: Yup.string()
      .required('Địa chỉ ví không hợp lệ')
      .test('address-validation', 'Địa chỉ ví không hợp lệ', function (value) {
        return utils.isAddress(value || '');
      }),
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

  const closeModal = () => () => {
    setVisible(false);
    setIsScanQrMode(false);
    formikRef.current?.resetForm();
  };

  const [isScanQrMode, setIsScanQrMode] = useState<boolean>(false);

  const handleErrorFile = (error: any) => {
    console.log(error, 'err');
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
    <CModal show={visible} onClose={closeModal()} closeOnBackdrop={false} centered className="border-radius-modal">
      <CModalHeader className="justify-content-center">
        <CModalTitle className="modal-title-style">Thêm quyền khai thác</CModalTitle>
      </CModalHeader>
      <Formik<IIntialValues>
        innerRef={formikRef}
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (rawValues) => {
          try {
            const value = handleRawFormValues(rawValues);
            const workerExisted = await checkWorkerStatus(value.contract, rawValues.address, true);
            if (workerExisted) {
              throw Error('Worker Exsisted');
            }
            dispatch(fetching());
            dispatch(proceedTransaction(value));
          } catch (error) {
            console.log(`Error submitting form ${error}`);
            ToastError(`Error submitting form ${error}`);
            dispatch(softReset());
          }
        }}
      >
        {({ values, errors, touched, handleChange, handleSubmit, handleBlur, setFieldValue }) => (
          <CForm onSubmit={handleSubmit}>
            <>
              <CModalBody>
                {isScanQrMode ? (
                  <>
                    <CRow>
                      <CCol xs={12} className="mb-3 d-flex text-center">
                        <CButton
                          onClick={() => setIsScanQrMode(false)}
                          className="text-primary btn-font-style btn-outline-primary btn-radius-50 px-2 py-1 justify-content-start"
                        >
                          <CIcon name="cil-arrow-thick-from-right" className="mr-1 p-0" size="lg" />
                          Back
                        </CButton>
                      </CCol>
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
                  </>
                ) : (
                  <CRow>
                    <CCol xs={12}>
                      <p>Address Wallet</p>
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
                          <CButton color="primary" className="btn-radius-50 py-0 px-2" onClick={onScanFile}>
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
                    onClick={closeModal()}
                  >
                    HỦY
                  </CButton>
                </CCol>
                <CCol>
                  <CButton
                    disabled={loading}
                    className="px-2 w-100 btn btn-primary btn-font-style btn-radius-50"
                    type="submit"
                  >
                    ĐỒNG Ý
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
