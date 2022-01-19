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
  CSubheader
} from '@coreui/react';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Formik } from 'formik';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { TOKEN_INSTANCE } from '../shared/blockchain-helpers';
import { getEllipsisTxt } from '../shared/casual-helpers';
import { ToastError, ToastInfo } from '../shared/components/Toast';
import { RootState } from '../shared/reducers';
import { getEntities } from '../views/assets/assets.api';
import {
  fetchingEntities,
  setFilterState as setStoredFilterState,
  softReset as assetsSoftReset
} from '../views/assets/assets.reducer';
import { IAssetFilter } from '../views/listings/Listings';
import { softReset as transactionsSoftReset } from '../views/transactions/transactions.reducer';
import {
  getAddress,
  getContractWithSigner,
  getProviderLogin,
  getSigner,
  getTokenBalance
} from '../views/wallet/wallet.api';
import { resetSigner, softReset as walletSoftReset } from '../views/wallet/wallet.reducer';
import { toggleSidebar } from './reducer';

interface IDataFilter {
  value: string;
  label: string;
}

const dataFilterDemo: IDataFilter[] = [
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

const initialValues: IAssetFilter = {
  page: 0,
  size: 5,
  sort: 'createdDate,desc',
};

type TListingsFilter = {
  [key in keyof Partial<IAssetFilter>]: IDataFilter[];
};

const listingsFilter: TListingsFilter = {
  city: dataFilterDemo,
  dist: dataFilterDemo,
  classify: dataFilterDemo,
  segment: dataFilterDemo,
  area: dataFilterDemo,
  orientation: dataFilterDemo,
  dailyPayment: dataFilterDemo,
  quality: dataFilterDemo,
};

const listingsFilterKeys = Object.keys(listingsFilter) as Array<keyof TListingsFilter>;

const TheHeader = () => {
  const dispatch = useDispatch();
  const location = useLocation().pathname;

  const isDashboardView = location.includes('/listings');

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

  const onConnectWallet = () => {
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
    if (getSignerSuccess && signer) {
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

  const handleRawValues = (values: IAssetFilter): IAssetFilter => {
    return { ...values, owner: Boolean(values.owner) ? signerAddress : undefined };
  };

  return (
    <>
      <CHeader className="header-container d-block shadow-sm border-0" withSubheader>
        <CHeaderNav>
          <CHeaderBrand className="mx-auto">
            <p className="m-0 content-title text-white">ANFT D-APP V1.0</p>
          </CHeaderBrand>
        </CHeaderNav>
        <CHeaderNav className={`${isDashboardView ? 'justify-content-between' : ''} bg-white px-2`}>
          <CHeaderNavItem>
            <CButton className="text-primary p-0 border-0 d-lg-none" onClick={toggleSidebarMobile}>
              <CIcon name="cil-menu" size="xl" />
            </CButton>
            <CButton className="text-primary p-0 border-0 d-md-down-none" onClick={toggleSidebarDesktop}>
              <CIcon name="cil-menu" size="xl" />
            </CButton>
          </CHeaderNavItem>
          <CHeaderNavItem className={`${isDashboardView ? '' : 'ml-2'}`}>
            <CLink to="/listings">
              <p className="header-title content-title mb-0">{t('anftDapp.headerComponent.dashboard')}</p>
            </CLink>
          </CHeaderNavItem>
          <CHeaderNavItem className={`${isDashboardView ? '' : 'ml-auto'}`}>
            <CButton className="btn-link-wallet btn-radius-50 px-2 btn-font-style" onClick={onConnectWallet}>
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
          {isDashboardView ? (
            <CHeaderNavItem className="nav-item-filter">
              <CDropdown className="dr-item-filter">
                <CDropdownToggle caret={false} className="text-primary p-0 border-0">
                  <CIcon name="cil-filter" size="xl" />
                </CDropdownToggle>
                <CDropdownMenu className="dr-menu-filter m-0">
                  <Formik
                    initialValues={initialValues}
                    onSubmit={(rawValues) => {
                      const values = handleRawValues(rawValues);
                      try {
                        if (!provider || !signerAddress) {
                          return ToastError(t('anftDapp.global.errors.pleaseConnectWallet'));
                        }
                        dispatch(fetchingEntities());
                        dispatch(getEntities({ fields: values, provider }));
                        dispatch(setStoredFilterState(values));
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
                          {listingsFilterKeys.map((e) => (
                            <CCol xs={6} md={4} className="px-2 text-center py-2" key={`listings-key-${e}`}>
                              <CSelect
                                className="btn-radius-50 text-dark px-2 content-title"
                                onChange={handleChange}
                                value={values[e] || ''}
                                id={e}
                                name={e}
                              >
                                <option value="">{t(`anftDapp.headerComponent.filter.${e}`)}</option>
                                {listingsFilter[e]?.map((o, i) => (
                                  <option value={o.value} key={`${e}-key-${i}`}>
                                    {o.label}
                                  </option>
                                ))}
                              </CSelect>
                            </CCol>
                          ))}
                          <CCol xs={12} md={4} className="py-3 px-4 d-flex align-items-end">
                            <CInputCheckbox
                              id="owner"
                              name="owner"
                              className="form-check-input m-0"
                              value={values.owner}
                              onChange={handleChange}
                              checked={values.owner ? true : false}
                            />
                            <CLabel className="content-title pl-2 m-0">
                              {t('anftDapp.headerComponent.filter.owned')}
                            </CLabel>
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
          ) : (
            ''
          )}
        </CHeaderNav>
      </CHeader>
      {isDashboardView ? (
        <CSubheader className="sub-header mt-2 justify-content-center align-items-center">
          <CRow className="w-100 p-1">
            <CCol xs={4} className="px-2">
              <CSelect className="btn-radius-50 text-dark px-2 content-title">
                <option value="">{t('anftDapp.headerComponent.filter.type')}</option>
                {dataFilterDemo.map((e, i) => (
                  <option value={e.value} key={`type-key-${i}`}>
                    {e.label}
                  </option>
                ))}
              </CSelect>
            </CCol>
            <CCol xs={4} className="px-2">
              <CSelect className="btn-radius-50 text-dark px-2 content-title">
                <option value="">{t('anftDapp.headerComponent.filter.state')}</option>
                {dataFilterDemo.map((e, i) => (
                  <option value={e.value} key={`state-key-${i}`}>
                    {e.label}
                  </option>
                ))}
              </CSelect>
            </CCol>
            <CCol xs={4} className="px-2">
              <CSelect className="btn-radius-50 text-dark px-2 content-title">
                <option value="">{t('anftDapp.headerComponent.filter.services')}</option>
                {dataFilterDemo.map((e, i) => (
                  <option value={e.value} key={`services-key-${i}`}>
                    {e.label}
                  </option>
                ))}
              </CSelect>
            </CCol>
          </CRow>
        </CSubheader>
      ) : (
        ''
      )}
    </>
  );
};

export default TheHeader;
