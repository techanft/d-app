import CIcon from '@coreui/icons-react';
import {
  CButton,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownToggle,
  CForm,
  CHeader,
  CHeaderBrand,
  CHeaderNav,
  CHeaderNavItem,
  CInputCheckbox,
  CLabel,
  CLink,
  CRow,
  CSelect,
} from '@coreui/react';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Formik } from 'formik';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { TOKEN_INSTANCE } from '../shared/blockchain-helpers';
import { getEllipsisTxt } from '../shared/casual-helpers';
import { ToastError, ToastInfo } from '../shared/components/Toast';
import { RootState } from '../shared/reducers';
import { getEntities } from '../views/assets/assets.api';
import { fetchingEntities, softReset as assetsSoftReset } from '../views/assets/assets.reducer';
import { IAssetFilter } from '../views/listings/Listings';
import { softReset as transactionsSoftReset } from '../views/transactions/transactions.reducer';
import {
  getAddress,
  getContractWithSigner,
  getProviderLogin,
  getSigner,
  getTokenBalance,
} from '../views/wallet/wallet.api';
import { resetSigner, softReset as walletSoftReset } from '../views/wallet/wallet.reducer';
import { toggleSidebar } from './reducer';


const dataFilterDemo = [
  {
    value: '1',
    label: 'Action',
  },
  {
    value: '2',
    label: 'Another action',
  },
  {
    value: '3',
    label: 'Something else here',
  },
];

const TheHeader = () => {
  const dispatch = useDispatch();

  const {
    getProviderLoginSuccess,
    getSignerSuccess,
    signer,
    signerAddress,
    provider,
    errorMessage: walletErrorMessage,
  } = useSelector((state: RootState) => state.wallet);
  const { initialState: assetsInitialState } = useSelector((state: RootState) => state.assets);
  const { errorMessage: assetErrorMessage } = assetsInitialState;

  const { errorMessage: transactionErrorMessage } = useSelector((state: RootState) => state.transactions);

  const containerState = useSelector((state: RootState) => state.container);
  const { sidebarShow } = containerState;

  const { t } = useTranslation();

  const onConnectWallet = () => () => {
    if (signerAddress) return dispatch(resetSigner());
    if (!provider) return ToastInfo('No provider found');
    dispatch(getProviderLogin(provider));
  };

  const toggleSidebarMobile = () => {
    const val = [false, 'responsive'].includes(sidebarShow) ? true : 'responsive';
    dispatch(toggleSidebar(val));
  };

  const toggleSidebarDesktop = () => {
    const val = [true, 'responsive'].includes(sidebarShow) ? false : 'responsive';
    dispatch(toggleSidebar(val));
  };

  useEffect(() => {
    if (transactionErrorMessage) {
      ToastError(transactionErrorMessage);
      dispatch(transactionsSoftReset());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionErrorMessage]);

  useEffect(() => {
    if (assetErrorMessage) {
      ToastError(assetErrorMessage);
      dispatch(assetsSoftReset());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetErrorMessage]);

  useEffect(() => {
    if (walletErrorMessage) {
      ToastError(walletErrorMessage);
      dispatch(walletSoftReset());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletErrorMessage]);

  useEffect(() => {
    if (getProviderLoginSuccess && provider) {
      dispatch(getSigner(provider));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getProviderLoginSuccess]);

  useEffect(() => {
    if (getSignerSuccess && signer !== null) {
      const TokenContract = TOKEN_INSTANCE({ signer });
      if (!TokenContract) return;
      const body = { contract: TokenContract, signer };
      dispatch(getAddress(signer));
      dispatch(getContractWithSigner(body));
      dispatch(walletSoftReset());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getSignerSuccess]);

  useEffect(() => {
    if (signerAddress && provider) {
      dispatch(getTokenBalance({ address: signerAddress, provider }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signerAddress]);

  const initialValues: IAssetFilter = {
    page: 0,
    size: 5,
    sort: 'createdDate,desc',
  };

  const handleRawValues = (values: IAssetFilter) => {
    if (Number(values.owner) === 1) return { ...values, owner: signerAddress };
    return { ...values, owner: undefined };
  };

  return (
    <CHeader className="header-container d-block shadow-sm border-0" withSubheader>
      <CHeaderNav>
        <CHeaderBrand className="mx-auto">
          <p className="m-0 content-title text-white">ANFT D-APP V1.0</p>
        </CHeaderBrand>
      </CHeaderNav>
      <CHeaderNav className="justify-content-between bg-white">
        <CHeaderNavItem>
          <CButton className="text-primary pr-0 border-0 pl-2 d-lg-none" onClick={toggleSidebarMobile}>
            <CIcon name="cil-menu" size="xl" />
          </CButton>
          <CButton className="text-primary pr-0 border-0 pl-2 d-md-down-none" onClick={toggleSidebarDesktop}>
            <CIcon name="cil-menu" size="xl" />
          </CButton>
        </CHeaderNavItem>
        <CHeaderNavItem>
          <CLink to="/listings">
            <p className="header-title content-title mb-0">{t('anftDapp.headerComponent.dashboard')}</p>
          </CLink>
        </CHeaderNavItem>
        <CHeaderNavItem>
          <CButton className="btn-link-wallet btn-radius-50 px-2 btn-font-style" onClick={onConnectWallet()}>
            {signerAddress ? (
              <b>
                {getEllipsisTxt(signerAddress, 4)}{' '}
                <CIcon name="cil-account-logout" size="lg" className="text-danger mx-0 my-0 pb-1" />
              </b>
            ) : (
              `${t('anftDapp.headerComponent.connectWallet')}`
            )}
          </CButton>
        </CHeaderNavItem>
        <CHeaderNavItem>
          <CDropdown>
            <CDropdownToggle caret={false} className="text-primary pl-0 border-0 pr-2">
              <CIcon name="cil-filter" size="xl" />
            </CDropdownToggle>
            <CDropdownMenu className="dr-menu-filter m-0">
              <Formik
                initialValues={initialValues}
                onSubmit={(rawValues) => {
                  const values = handleRawValues(rawValues);
                  try {
                    if (!provider || !signerAddress) return ToastError(t('anftDapp.global.errors.pleaseConnectWallet'));
                    dispatch(fetchingEntities());
                    dispatch(getEntities({ fields: values, provider }));
                  } catch (error) {
                    console.log(`Error submitting form ${error}`);
                    ToastError(`Error submitting form ${error}`);
                  }
                }}
              >
                {({ values, handleChange, handleSubmit, resetForm }) => (
                  <CForm onSubmit={handleSubmit}>
                    <div className="modal-title-style d-flex justify-content-end px-3 py-2">
                      <CLabel className="m-auto pl-3"> {t('anftDapp.headerComponent.filter.filter')}</CLabel>
                      <CButton className="p-0 text-primary" onClick={resetForm}>
                        <FontAwesomeIcon icon={faSyncAlt} />
                      </CButton>
                    </div>
                    <CRow className="mx-2">
                      <CCol xs={6} className="px-2 text-center py-2">
                        <CSelect
                          className="btn-radius-50 text-dark px-2 content-title"
                          onChange={handleChange}
                          value={values.city || ''}
                          id="city"
                          name="city"
                        >
                          <option value="">{t('anftDapp.headerComponent.filter.city')}</option>
                          {dataFilterDemo.map((e, i) => (
                            <option value={e.value} key={`city-key-${i}`}>
                              {e.label}
                            </option>
                          ))}
                        </CSelect>
                      </CCol>
                      <CCol xs={6} className="px-2 text-center py-2">
                        <CSelect
                          className="btn-radius-50 text-dark px-2 content-title"
                          onChange={handleChange}
                          value={values.dist || ''}
                          id="dist"
                          name="dist"
                        >
                          <option value="">{t('anftDapp.headerComponent.filter.dist')}</option>
                          {dataFilterDemo.map((e, i) => (
                            <option value={e.value} key={`dist-key-${i}`}>
                              {e.label}
                            </option>
                          ))}
                        </CSelect>
                      </CCol>
                      <CCol xs={6} className="px-2 text-center py-2">
                        <CSelect
                          className="btn-radius-50 text-dark px-2 content-title"
                          onChange={handleChange}
                          value={values.classify || ''}
                          id="classify"
                          name="classify"
                        >
                          <option value="">{t('anftDapp.headerComponent.filter.classify')}</option>
                          {dataFilterDemo.map((e, i) => (
                            <option value={e.value} key={`classify-key-${i}`}>
                              {e.label}
                            </option>
                          ))}
                        </CSelect>
                      </CCol>
                      <CCol xs={6} className="px-2 text-center py-2">
                        <CSelect
                          className="btn-radius-50 text-dark px-2 content-title"
                          onChange={handleChange}
                          value={values.segment || ''}
                          id="segment"
                          name="segment"
                        >
                          <option value="">{t('anftDapp.headerComponent.filter.segment')}</option>
                          {dataFilterDemo.map((e, i) => (
                            <option value={e.value} key={`segment-key-${i}`}>
                              {e.label}
                            </option>
                          ))}
                        </CSelect>
                      </CCol>
                      <CCol xs={6} className="px-2 text-center py-2">
                        <CSelect
                          className="btn-radius-50 text-dark px-2 content-title"
                          onChange={handleChange}
                          value={values.area || ''}
                          id="area"
                          name="area"
                        >
                          <option value="">{t('anftDapp.headerComponent.filter.area')}</option>
                          {dataFilterDemo.map((e, i) => (
                            <option value={e.value} key={`area-key-${i}`}>
                              {e.label}
                            </option>
                          ))}
                        </CSelect>
                      </CCol>
                      <CCol xs={6} className="px-2 text-center py-2">
                        <CSelect
                          className="btn-radius-50 text-dark px-2 content-title"
                          onChange={handleChange}
                          value={values.orientation || ''}
                          id="orientation"
                          name="orientation"
                        >
                          <option value="">{t('anftDapp.headerComponent.filter.orientation')}</option>
                          {dataFilterDemo.map((e, i) => (
                            <option value={e.value} key={`orientation-key-${i}`}>
                              {e.label}
                            </option>
                          ))}
                        </CSelect>
                      </CCol>
                      <CCol xs={6} className="px-2 text-center py-2">
                        <CSelect
                          className="btn-radius-50 text-dark px-2 content-title"
                          onChange={handleChange}
                          value={values.dailyPayment || ''}
                          id="dailyPayment"
                          name="dailyPayment"
                        >
                          <option value="">{t('anftDapp.headerComponent.filter.dailyPayment')}</option>
                          {dataFilterDemo.map((e, i) => (
                            <option value={e.value} key={`dailyPayment-key-${i}`}>
                              {e.label}
                            </option>
                          ))}
                        </CSelect>
                      </CCol>
                      <CCol xs={6} className="px-2 text-center py-2">
                        <CSelect
                          className="btn-radius-50 text-dark px-2 content-title"
                          onChange={handleChange}
                          value={values.quality || ''}
                          id="quality"
                          name="quality"
                        >
                          <option value="">{t('anftDapp.headerComponent.filter.quality')}</option>
                          {dataFilterDemo.map((e, i) => (
                            <option value={e.value} key={`quality-key-${i}`}>
                              {e.label}
                            </option>
                          ))}
                        </CSelect>
                      </CCol>
                      <CCol xs={6} className="px-2 py-2 d-flex justify-content-center">
                        <CInputCheckbox
                          id="owner"
                          name="owner"
                          className="form-check-input m-0"
                          value={values.owner}
                          onChange={handleChange}
                          checked={values.owner ? true : false}
                          color='red'
                        />
                        <CLabel className="content-title pl-2 m-0">{t('anftDapp.headerComponent.filter.owned')}</CLabel>
                      </CCol>
                      <CCol xs={12} className="d-flex justify-content-center my-2">
                        <CButton className="btn btn-primary btn-radius-50" type="submit">
                          {t('anftDapp.headerComponent.filter.apply')}
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                )}
              </Formik>
            </CDropdownMenu>
          </CDropdown>
        </CHeaderNavItem>
      </CHeaderNav>
    </CHeader>
  );
};

export default TheHeader;
