import { CButton, CCol, CForm, CInput, CInvalidFeedback, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow } from '@coreui/react';
import { utils } from 'ethers';
import { Formik } from 'formik';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { LISTING_INSTANCE } from '../../../shared/blockchain-helpers';
import { ToastError } from '../../../shared/components/Toast';
import { EventType } from '../../../shared/enumeration/eventType';
import { RootState } from '../../../shared/reducers';
import { Listing } from '../../../typechain';
import { selectEntityById } from '../../assets/assets.reducer';
import { IUpdateWorkerBody, IUpdateWorkerIntialValues, updateWorkerOwnership } from '../../transactions/transactions.api';
import { fetching, softReset } from '../../transactions/transactions.reducer';

interface ICancelWorkerPermission {
  listingId: number;
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const AddWorkerPermission = (props: ICancelWorkerPermission) => {
  const { visible, setVisible, listingId } = props;

  const dispatch = useDispatch();
  const listing = useSelector(selectEntityById(listingId));
  const { signer } = useSelector((state: RootState) => state.wallet);
  const { submitted, loading } = useSelector((state: RootState) => state.transactions);

  useEffect(() => {
    if (submitted) {
      setVisible(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted]);

  const initialValues = {
    listingAddress: listing?.address,
    listingId,
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

  const handleRawFormValues = async (input: IUpdateWorkerIntialValues): Promise<IUpdateWorkerBody> => {
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
    
    if(await workerExisted(instance, input.address)){
      throw Error('Worker Exsisted');
    }
    
    return {
      ...input,
      type: EventType.UPDATE_WORKER,
      address: input.address,
      contract: instance,
    };
  };

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (rawValues,{resetForm}) => {
        try {
          const value = handleRawFormValues(rawValues);
          dispatch(fetching());
          dispatch(updateWorkerOwnership(await value));
          // setVisibility(false);
          resetForm()
        } catch (error) {
          console.log(`Error submitting form ${error}`);
          ToastError(`Error submitting form ${error}`);
          dispatch(softReset())
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
