import { CButton, CCol, CForm, CInput, CInvalidFeedback, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow } from '@coreui/react';
import { utils } from 'ethers';
import { Formik } from 'formik';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { LISTING_INSTANCE } from '../../../shared/blockchain-helpers';
import { ToastError } from '../../../shared/components/Toast';
import { EventType } from '../../../shared/enumeration/eventType';
import { RootState } from '../../../shared/reducers';
import { Listing } from '../../../typechain';
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
  const formikRef = useRef<any>();
  const dispatch = useDispatch();
  const listing = useSelector(selectEntityById(listingId));
  const { signer } = useSelector((state: RootState) => state.wallet);
  const { submitted, loading } = useSelector((state: RootState) => state.transactions);

  useEffect(() => {
    if (submitted) {
      setVisible(false);
      formikRef?.current?.resetForm();
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

  const workerExisted = async (listing: Listing, address: string) => {
    return await listing.workers(address);
  };

  const handleRawFormValues = async (input: IIntialValues): Promise<IProceedTxBody> => {
    if (!listing?.address) {
      throw Error('Error getting listing address');
    }
    if (!signer) {
      throw Error('No Signer found');
    }
    const instance = LISTING_INSTANCE(listing.address, signer);
    if (!instance) {
      throw Error('Error in generating contract instace');
    }

    if (await workerExisted(instance, input.address)) {
      throw Error('Worker Exsisted');
    }

    const output: IProceedTxBody = {
      listingId,
      contract: instance,
      type: EventType.UPDATE_WORKER,
      args: { ...baseSetterArgs, _worker: input.address },
    };

    return output;
  };

  return (
    <Formik
      innerRef={formikRef}
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (rawValues) => {
        try {
          const value = handleRawFormValues(rawValues);
          dispatch(fetching());
          dispatch(proceedTransaction(await value));
        } catch (error) {
          console.log(`Error submitting form ${error}`);
          ToastError(`Error submitting form ${error}`);
          dispatch(softReset());
        }
      }}
    >
      {({ values, errors, touched, handleChange, handleSubmit, handleBlur, resetForm }) => (
        <CForm onSubmit={handleSubmit}>
          <CModal
            show={visible}
            onClose={() => {
              setVisible(false);
              resetForm();
            }}
            closeOnBackdrop={false}
            centered
            className="border-radius-modal"
          >
            <CModalHeader className="justify-content-center">
              <CModalTitle className="modal-title-style">Thêm quyền khai thác</CModalTitle>
            </CModalHeader>

            <CModalBody>
              <CRow>
                <CCol xs={12}>
                  <p>Address Wallet</p>
                </CCol>
                <CCol xs={12}>
                  <CInput type="text" id="address" name="address" onChange={handleChange} autoComplete="off" value={values.address || ''} onBlur={handleBlur} className="btn-radius-50" />
                  <CInvalidFeedback className={!!errors.address && touched.address ? 'd-block' : 'd-none'}>{errors.address}</CInvalidFeedback>
                </CCol>
              </CRow>
            </CModalBody>
            <CModalFooter className="justify-content-between">
              <CCol>
                <CButton
                  className="px-2 w-100 btn-font-style btn btn-outline-primary btn-radius-50"
                  onClick={() => {
                    setVisible(false);
                    resetForm();
                  }}
                >
                  HỦY
                </CButton>
              </CCol>
              <CCol>
                <CButton disabled={loading} className="px-2 w-100 btn btn-primary btn-font-style btn-radius-50" type="submit">
                  ĐỒNG Ý
                </CButton>
              </CCol>
            </CModalFooter>
          </CModal>{' '}
        </CForm>
      )}
    </Formik>
  );
};

export default AddWorkerPermission;
