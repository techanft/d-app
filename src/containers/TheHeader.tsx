import CIcon from '@coreui/icons-react';
import {
  CButton,
  CCol,
  CDropdown,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderBrand,
  CHeaderNav,
  CHeaderNavItem,
  CInputCheckbox,
  CLabel,
  CLink,
  CRow
} from '@coreui/react';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { default as React, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToastError } from '../shared/components/Toast';
import { getEllipsisTxt, getProvider, getTokenContractRead } from '../shared/blockchain-helpers';
import { RootState } from '../shared/reducers';
import { getAddress, getContractWithSigner, getProviderLogin, getSigner } from '../views/walletInfo/wallet.api';
import { softReset } from '../views/walletInfo/wallet.reducer';

declare let window: any;
const TheHeader = () => {
  const dispatch = useDispatch();
  const provider = getProvider();
  const { getProviderLoginSuccess, getSignerSuccess, signer, signerAddress } = useSelector(
    (state: RootState) => state.walletReducer
  );
  const onConnectWallet = () => () => {
    if (window.ethereum) {
      dispatch(getProviderLogin(provider));
    } else {
      ToastError('No provider found');
    }
  };

  useEffect(() => {
    if (getProviderLoginSuccess) {
      dispatch(getSigner(provider));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getProviderLoginSuccess]);

  useEffect(() => {
    if (getSignerSuccess && signer !== null) {
      const TokenContract = getTokenContractRead(provider);
      const body = { contract: TokenContract, signer };
      dispatch(getAddress(signer));
      dispatch(getContractWithSigner(body));
      dispatch(softReset());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getSignerSuccess]);

  return (
    <CHeader className="header-container d-block" withSubheader>
      <CHeaderNav>
        <CHeaderBrand className="header-brand mx-auto">
          <p className="m-0 content-title text-white">WEBVIEW</p>
        </CHeaderBrand>
      </CHeaderNav>
      <CHeaderNav className="justify-content-between bg-white">
        <CHeaderNavItem>
          <CButton className="text-primary pr-0 border-0 pl-2">
            <CIcon name="cil-menu" size="xl" />
          </CButton>
        </CHeaderNavItem>
        <CHeaderNavItem>
          <CLink to="/dashboard">
            <p className="header-title content-title mb-0">Dashboard</p>
          </CLink>
        </CHeaderNavItem>
        <CHeaderNavItem>
          <CButton className="btn-link-wallet content-title btn-radius-50 px-1" onClick={onConnectWallet()}>
            {signerAddress ? getEllipsisTxt(signerAddress) : 'Liên kết ví'}
          </CButton>
        </CHeaderNavItem>
        <CHeaderNavItem>
          <CDropdown>
            <CDropdownToggle caret={false} className="text-primary pl-0 border-0 pr-2">
              <CIcon name="cil-filter" size="xl" />
            </CDropdownToggle>
            <CDropdownMenu className="dr-menu-filter m-0">
              <CDropdownHeader className="text-center modal-title-style">Filter</CDropdownHeader>
              <CRow className="mx-0">
                <CCol xs={6} className="px-0 text-center py-2">
                  <CDropdown className="mx-1">
                    <CDropdownToggle
                      color="white"
                      className="dt-filter content-title btn-radius-50 text-dark"
                      caret={false}
                    >
                      City <FontAwesomeIcon icon={faAngleDown} />
                    </CDropdownToggle>
                    <CDropdownMenu className="m-0">
                      <CDropdownItem href="#">Action</CDropdownItem>
                      <CDropdownItem href="#">Another action</CDropdownItem>
                      <CDropdownItem href="#">Something else here</CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown>
                </CCol>
                <CCol xs={6} className="px-0 text-center py-2">
                  <CDropdown className="mx-1">
                    <CDropdownToggle
                      color="white"
                      className="dt-filter content-title btn-radius-50 text-dark"
                      caret={false}
                    >
                      Dist <FontAwesomeIcon icon={faAngleDown} />
                    </CDropdownToggle>
                    <CDropdownMenu className="m-0">
                      <CDropdownItem href="#">Action</CDropdownItem>
                      <CDropdownItem href="#">Another action</CDropdownItem>
                      <CDropdownItem href="#">Something else here</CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown>
                </CCol>
                <CCol xs={6} className="px-0 text-center py-2">
                  <CDropdown className="mx-1">
                    <CDropdownToggle
                      color="white"
                      className="dt-filter content-title btn-radius-50 text-dark"
                      caret={false}
                    >
                      Loại sản phẩm <FontAwesomeIcon icon={faAngleDown} />
                    </CDropdownToggle>
                    <CDropdownMenu className="m-0">
                      <CDropdownItem href="#">Action</CDropdownItem>
                      <CDropdownItem href="#">Another action</CDropdownItem>
                      <CDropdownItem href="#">Something else here</CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown>
                </CCol>
                <CCol xs={6} className="px-0 text-center py-2">
                  <CDropdown className="mx-1">
                    <CDropdownToggle
                      color="white"
                      className="dt-filter content-title btn-radius-50 text-dark"
                      caret={false}
                    >
                      Phân khúc <FontAwesomeIcon icon={faAngleDown} />
                    </CDropdownToggle>
                    <CDropdownMenu className="m-0">
                      <CDropdownItem href="#">Action</CDropdownItem>
                      <CDropdownItem href="#">Another action</CDropdownItem>
                      <CDropdownItem href="#">Something else here</CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown>
                </CCol>
                <CCol xs={6} className="px-0 text-center py-2">
                  <CDropdown className="mx-1">
                    <CDropdownToggle
                      color="white"
                      className="dt-filter content-title btn-radius-50 text-dark"
                      caret={false}
                    >
                      Diện tích <FontAwesomeIcon icon={faAngleDown} />
                    </CDropdownToggle>
                    <CDropdownMenu className="m-0">
                      <CDropdownItem href="#">Action</CDropdownItem>
                      <CDropdownItem href="#">Another action</CDropdownItem>
                      <CDropdownItem href="#">Something else here</CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown>
                </CCol>
                <CCol xs={6} className="px-0 text-center py-2">
                  <CDropdown className="mx-1">
                    <CDropdownToggle
                      color="white"
                      className="dt-filter content-title btn-radius-50 text-dark"
                      caret={false}
                    >
                      Hướng <FontAwesomeIcon icon={faAngleDown} />
                    </CDropdownToggle>
                    <CDropdownMenu className="m-0">
                      <CDropdownItem href="#">Action</CDropdownItem>
                      <CDropdownItem href="#">Another action</CDropdownItem>
                      <CDropdownItem href="#">Something else here</CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown>
                </CCol>
                <CCol xs={6} className="px-0 text-center py-2">
                  <CDropdown className="mx-1">
                    <CDropdownToggle
                      color="white"
                      className="dt-filter content-title btn-radius-50 text-dark"
                      caret={false}
                    >
                      Phí khai thác <FontAwesomeIcon icon={faAngleDown} />
                    </CDropdownToggle>
                    <CDropdownMenu className="m-0">
                      <CDropdownItem href="#">Action</CDropdownItem>
                      <CDropdownItem href="#">Another action</CDropdownItem>
                      <CDropdownItem href="#">Something else here</CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown>
                </CCol>
                <CCol xs={6} className="px-0 text-center py-2">
                  <CDropdown className="mx-1">
                    <CDropdownToggle
                      color="white"
                      className="dt-filter content-title btn-radius-50 text-dark"
                      caret={false}
                    >
                      Chất lượng <FontAwesomeIcon icon={faAngleDown} />
                    </CDropdownToggle>
                    <CDropdownMenu className="m-0">
                      <CDropdownItem href="#">Action</CDropdownItem>
                      <CDropdownItem href="#">Another action</CDropdownItem>
                      <CDropdownItem href="#">Something else here</CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown>
                </CCol>
                <CCol xs={12} className="px-3 text-left py-2 d-flex align-items-center">
                  <CInputCheckbox id="owned" name="owned" className="form-check-input m-0" />
                  <CLabel className="content-title pl-2 m-0">Sở hữu bởi tôi</CLabel>
                </CCol>
                <CCol xs={12} className="d-flex justify-content-center my-2">
                  <CButton className="btn btn-primary btn-radius-50">ÁP DỤNG</CButton>
                </CCol>
              </CRow>
            </CDropdownMenu>
          </CDropdown>
        </CHeaderNavItem>
      </CHeaderNav>
    </CHeader>
  );
};

export default TheHeader;
