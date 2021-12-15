import { CButton, CCol, CForm, CFormGroup, CInput, CInvalidFeedback, CLabel, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow } from "@coreui/react";
import { ethers } from "ethers";
import { Formik } from "formik";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { calculateOwnerTime, insertCommas, unInsertCommas } from "../../shared/helper";
import { getListingContractWrite } from "../../shared/helpers";
import { RootState } from "../../shared/reducers";
import { extendOwnerShip } from "./realEstate.abi";
import { fetching } from "./realEstate.reducer";

interface IRegisterOwnershipModal {
  address: string;
  dailyPayment: string;
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const RegisterOwnershipModal = (props: IRegisterOwnershipModal) => {
  const { dailyPayment, address, visible, setVisible } = props;
  const dispatch = useDispatch();
  const closeModal = (key: boolean) => (): void => setVisible(key);
  const { signer,signerAddress } = useSelector((state: RootState) => state.walletReducer);

  const initialValues = {
    registrationToken: 0,
  };

  const validationSchema = Yup.object().shape({
    registrationToken: Yup.number().min(1, "Số token không hợp lệ").typeError("Số lượng token không hợp lệ").required("Vui lòng nhập số token muốn nạp"),
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
        onSubmit={(values) => {
          console.log(signer);
          
          const ListingContract = getListingContractWrite(address, signer!);
          console.log(ListingContract);
          
          const body = {
            contract: ListingContract,
            tokenNumber: ethers.utils.parseUnits(values.registrationToken.toString()),
          };
          dispatch(fetching());
          dispatch(extendOwnerShip(body));
          setVisible(false);
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
                      <p className="text-primary text-right">{dailyPayment}</p>
                    </CCol>
                  </CFormGroup>
                  <CFormGroup row>
                    <CCol xs={12}>
                      <CLabel className="recharge-token-title">Số ANFT muốn nạp</CLabel>
                    </CCol>
                    <CCol>
                      <CInput
                        // onChange={handleChange}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setFieldValue(`registrationToken`, unInsertCommas(e.target.value));
                        }}
                        id="registrationToken"
                        autoComplete="off"
                        name="registrationToken"
                        value={values.registrationToken ? insertCommas(values.registrationToken) : ""}
                        // value={values.registrationToken || ""}
                        onBlur={handleBlur}
                        className="btn-radius-50"
                      />
                      <CInvalidFeedback className={!!errors.registrationToken && touched.registrationToken ? "d-block" : "d-none"}>{errors.registrationToken}</CInvalidFeedback>
                    </CCol>
                  </CFormGroup>
                  <CFormGroup row>
                    <CCol xs={8}>
                      <CLabel className="recharge-token-title">Ownership Period</CLabel>
                    </CCol>
                    <CCol xs={4}>
                      <p className="text-primary text-right">{calculateOwnerTime(values.registrationToken, Number(unInsertCommas(dailyPayment)))} days</p>
                    </CCol>
                  </CFormGroup>
                </CCol>
              </CRow>
            </CModalBody>
            <CModalFooter className="justify-content-between">
              <CCol>
                <CButton className="px-2 w-100 btn-font-style btn-radius-50 btn btn-outline-primary" onClick={closeModal(false)}>
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
