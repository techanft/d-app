import { CButton, CCol, CForm, CFormGroup, CInput, CInvalidFeedback, CLabel, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow } from "@coreui/react";
import { ethers } from "ethers";
import { Formik } from "formik";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { estimateOwnership, insertCommas, unInsertCommas } from "../../shared/helper";
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


  const { signer } = useSelector((state: RootState) => state.walletReducer);

  // generate initialValues sao cho không cần phải tạo một object body khi submit formik
  const initialValues = {
    contract: getListingContractWrite(address, signer!),
    tokenAmount: 0,
    // registrationToken: 0,


  };

  const validationSchema = Yup.object().shape({
    tokenAmount: Yup.number().min(1, "Số token không hợp lệ").typeError("Số lượng token không hợp lệ").required("Vui lòng nhập số token muốn nạp"),
    // registrationToken: Yup.number().min(1, "Số token không hợp lệ").typeError("Số lượng token không hợp lệ").required("Vui lòng nhập số token muốn nạp"),
  });


  // Cần catch các error khi user reject transaction với metamask
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
          // const ListingContract = getListingContractWrite(address, signer!);

          // Object này không cần thiết nếu setup formik properly
          // const body = {
          //   contract: ListingContract,
          //   tokenAmount: ethers.utils.parseUnits(values.registrationToken.toString()),
          // };
          dispatch(fetching());
          dispatch(extendOwnerShip({...values, tokenAmount: ethers.utils.parseUnits(values.tokenAmount.toString())}));
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
                          setFieldValue(`tokenAmount`, unInsertCommas(e.target.value));
                        }}
                        id="tokenAmount"
                        autoComplete="off"
                        name="tokenAmount"
                        value={values.tokenAmount ? insertCommas(values.tokenAmount) : ""}
                        // value={values.tokenAmount || ""}
                        onBlur={handleBlur}
                        className="btn-radius-50"
                      />
                      <CInvalidFeedback className={!!errors.tokenAmount && touched.tokenAmount ? "d-block" : "d-none"}>{errors.tokenAmount}</CInvalidFeedback>
                    </CCol>
                  </CFormGroup>
                  <CFormGroup row>
                    <CCol xs={8}>
                      <CLabel className="recharge-token-title">Ownership Period</CLabel>
                    </CCol>
                    <CCol xs={4}>
                      <p className="text-primary text-right">{estimateOwnership(values.tokenAmount, Number(unInsertCommas(dailyPayment)))} days</p>
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
