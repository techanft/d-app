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
import { BigNumber, ethers } from 'ethers';
import { Formik } from 'formik';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import {
  convertBnToDecimal,
  convertDecimalToBn,
  convertUnixToDate,
  estimateOwnership,
  formatBNToken,
  insertCommas,
  unInsertCommas,
} from '../../shared/casual-helpers';
import { getListingContractWrite, LISTING_INSTANCE } from '../../shared/blockchain-helpers';
import { RootState } from '../../shared/reducers';
import { extendOwnership, IExtndOwnershipBody, IExtndOwnrshpIntialValues } from './listing.api';
import { fetching } from './listings.reducer';
import { selectEntityById } from '../assets/assets.reducer';
import { ToastError } from '../../shared/components/Toast';

interface IRegisterOwnershipModal {
  listingId: number;
  isVisible: boolean;
  setVisibility: (isVisible: boolean) => void;
}

const RegisterOwnershipModal = (props: IRegisterOwnershipModal) => {
  const { isVisible, setVisibility, listingId } = props;
  const listing = useSelector(selectEntityById(listingId));

  const dispatch = useDispatch();
  const closeModal = () => (): void => setVisibility(false);

  const { signer } = useSelector((state: RootState) => state.walletReducer);


  const initialValues: IExtndOwnrshpIntialValues = {
    listingAddress: listing?.address,
    tokenAmount: 0,
  };

  const validationSchema = Yup.object().shape({
    tokenAmount: Yup.number()
    .test(
      "dailyPayment-minimum",
      `Minimum ownership for the listing is 1.0 day`,
      function (value) {
        if (!value) return true;
        if (!listing?.dailyPayment) return false;
        return value >= Number(convertBnToDecimal(listing.dailyPayment))
        
      }
    )
      .typeError('Số lượng token không hợp lệ')
      .required('Vui lòng nhập số token muốn nạp'),
  });
  
  const handleRawFormValues = (input: IExtndOwnrshpIntialValues) : IExtndOwnershipBody  => {
      if (!listing?.address) {
        throw "Error getting listing address"
      }
      if (!signer) {
        throw "No Signer found";
      };
      const instance = LISTING_INSTANCE(listing.address, signer)
      if (!instance) {
        throw "Error in generating contract instace"
      }
      return {
        ...input,
        tokenAmount: convertDecimalToBn(input.tokenAmount.toString()),
        contract: instance
      }
  }

  return (
    <CModal show={isVisible} onClose={closeModal()} centered className="border-radius-modal">
      <CModalHeader className="justify-content-center">
        <CModalTitle className="modal-title-style">Đăng ký sở hữu</CModalTitle>
      </CModalHeader>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(rawValues) => {
          try {
            const value = handleRawFormValues(rawValues)
            dispatch(fetching());
            dispatch(extendOwnership(value));
            setVisibility(false);
          } catch (error) {
            console.log(`Error submitting form ${error}`)
            ToastError(`Error submitting form ${error}`)
          }
        }}
      >
        {({ values, errors, touched, setFieldValue, handleSubmit, handleBlur }) => (
          <CForm onSubmit={handleSubmit}>
            <CModalBody>
              <CRow>
                <CCol xs={12}>
                  <CFormGroup row>
                    <CCol xs={8}>
                      <CLabel className="recharge-token-title">Chi phí khai thác/ngày</CLabel>
                    </CCol>
                    <CCol xs={4}>
                      <p className="text-primary text-right">{formatBNToken(listing?.dailyPayment, true)}</p>
                    </CCol>
                  </CFormGroup>
                  <CFormGroup row>
                    <CCol xs={12}>
                      <CLabel className="recharge-token-title">Số ANFT muốn nạp</CLabel>
                    </CCol>

                    <CCol>
                      <CInput
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setFieldValue(`tokenAmount`, unInsertCommas(e.target.value));
                        }}
                        id="tokenAmount"
                        autoComplete="off"
                        name="tokenAmount"
                        value={values.tokenAmount ? insertCommas(values.tokenAmount) : ''}
                        onBlur={handleBlur}
                        className="btn-radius-50"
                      />
                      <CInvalidFeedback className={!!errors.tokenAmount && touched.tokenAmount ? 'd-block' : 'd-none'}>
                        {errors.tokenAmount}
                      </CInvalidFeedback>
                    </CCol>
                  </CFormGroup>
                  <CFormGroup row>
                    <CCol xs={6}>
                      <CLabel className="recharge-token-title">Current ownership</CLabel>
                    </CCol>
                    {listing?.dailyPayment && listing?.ownership ? (
                      <CCol xs={6}>
                        <p className="text-primary text-right">{convertUnixToDate(listing.ownership.toNumber())}</p>
                      </CCol>
                    ) : (
                      ''
                    )}
                  </CFormGroup>
                  <CFormGroup row>
                    <CCol xs={6}>
                      <CLabel className="recharge-token-title">Ownership Estimation</CLabel>
                    </CCol>
                    {listing?.dailyPayment && listing?.ownership && values.tokenAmount ? (
                      <CCol xs={6}>
                        <p className="text-primary text-right">
                          {estimateOwnership(
                            convertDecimalToBn(String(values.tokenAmount)),
                            listing.dailyPayment,
                            listing.ownership
                          )}
                        </p>
                      </CCol>
                    ) : (
                      ''
                    )}
                  </CFormGroup>
                </CCol>
              </CRow>
            </CModalBody>
            <CModalFooter className="justify-content-between">
              <CCol>
                <CButton
                  className="px-2 w-100 btn-font-style btn-radius-50 btn btn-outline-primary"
                  onClick={closeModal()}
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
