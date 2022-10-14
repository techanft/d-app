import CIcon from '@coreui/icons-react';
import { CButton, CCard, CCol, CCollapse, CForm, CRow, CSelect } from '@coreui/react';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Formik, FormikProps } from 'formik';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { IAssetFilter } from '../../views/listings/Listings';
import { categorySelectors } from '../../views/productType/category.reducer';
import { RootState } from '../reducers';

const initialValues: IAssetFilter = {
  page: 0,
  size: 12,
  sort: 'createdDate,desc',
  sellStatus: 'YET_SOLD,LOCKED',
};

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

type TListingsFilter = {
  [key in keyof Partial<IAssetFilter>]: IDataFilter[];
};

const FilterComponent = () => {
  const listingTypes = useSelector(categorySelectors.selectAll);
  const { provincesEntities, districtsEntities } = useSelector((state: RootState) => state.provinces);

  const [advandedSearch, setAdvancedSearch] = useState<boolean>(false);
  const setAdvancedSearchListener = (key: boolean) => () => setAdvancedSearch(key);

  const listingsFilter: TListingsFilter = {
    city: provincesEntities.map((item) => ({ value: item.code, label: item.name })),
    dist:
      districtsEntities.length > 0
        ? districtsEntities.map((item) => ({ value: item.code, label: item.name }))
        : undefined,
    classify: listingTypes.map((item) => ({ value: item.id, label: item.name })),
  };

  const listingAdvandedFilter: TListingsFilter = {
    segment: dataFilterDemo,
    area: dataFilterDemo,
    orientation: dataFilterDemo,
    bedroom: dataFilterDemo,
    livingroom: dataFilterDemo,
    dailyPayment: dataFilterDemo,
    quality: dataFilterDemo,
    ownershipStatus: dataFilterDemo,
  };

  const formikRef = useRef<FormikProps<IAssetFilter>>(null);
  const listingsFilterKeys = Object.keys(listingsFilter) as Array<keyof TListingsFilter>;
  const listingsAdvandedFilterKeys = Object.keys(listingAdvandedFilter) as Array<keyof TListingsFilter>;

  const { t } = useTranslation();

  // const { signerAddress } = useSelector((state: RootState) => state.wallet);

  return (
    <CCard className={'shadow-0 border-0 w-100 mt-3 mb-0'}>
      <Formik<IAssetFilter>
        innerRef={formikRef}
        initialValues={initialValues}
        onSubmit={(rawValues) => {
          //   const values = handleRawValues(rawValues);
          //   try {
          //     if (!provider) return;
          //     dispatch(fetchingEntities());
          //     dispatch(getEntities({ fields: values, provider }));
          //     dispatch(setStoredFilterState(values));
          //     setIsDropdownFilterShowing(false);
          //   } catch (error) {
          //     console.log(`Error submitting form ${error}`);
          //     ToastError(`${t('anftDapp.global.errors.errorSubmittingForm')}: ${error}`);
          //   }
        }}
      >
        {({ values, handleChange, handleSubmit, resetForm }) => (
          <CForm onSubmit={handleSubmit}>
            {/* <div className="modal-title-style d-flex justify-content-end px-3 py-2">
              <CLabel className="m-auto pl-3"> {t('anftDapp.headerComponent.filter.filter')}</CLabel>
              <CButton className="p-0 text-primary" onClick={resetForm}>
                <FontAwesomeIcon icon={faSyncAlt} size="lg" />
              </CButton>
            </div> */}

            <CCollapse show={advandedSearch}>
              <CRow className="mx-2 align-items-center">
                {listingsAdvandedFilterKeys.map((e) => (
                  <CCol xs={12} sm={6} md={4} lg={3} className="px-2 text-center py-2" key={`listings-key-${e}`}>
                    <CSelect
                      className="btn-radius-50 text-dark px-2 content-title filter-search-select"
                      onChange={handleChange}
                      value={values[e] || ''}
                      id={e}
                      name={e}
                      disabled
                    >
                      <option value="">{t(`anftDapp.headerComponent.filter.${e}`)}</option>
                      {listingAdvandedFilter[e]?.map((o, i) => (
                        <option value={o.value} key={`${e}-key-${i}`}>
                          {o.label}
                        </option>
                      ))}
                    </CSelect>
                  </CCol>
                ))}
              </CRow>
            </CCollapse>

            <CRow className="mx-2 align-items-center">
              {listingsFilterKeys.map((e) => (
                <CCol xs={12} sm={6} md={4} lg={3} className="px-2 py-2 text-center" key={`listings-key-${e}`}>
                  <CSelect
                    className="btn-radius-50 text-dark px-2 content-title filter-search-select"
                    onChange={handleChange}
                    value={values[e] || ''}
                    id={e}
                    name={e}
                    disabled
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
              <CCol xs={12} sm={6} md={4} lg={3} className="px-2 d-flex align-items-center justify-content-end">
                <CButton size="lg" className="p-0 text-primary " onClick={resetForm}>
                  <FontAwesomeIcon icon={faSyncAlt} size="lg" />
                </CButton>
                <CButton
                  size="lg"
                  className="text-primary toggle-collapse-btn "
                  onClick={setAdvancedSearchListener(!advandedSearch)}
                >
                  <CIcon name={advandedSearch ? 'cil-fullscreen-exit' : 'cil-fullscreen'} size="lg" />
                </CButton>
                <CButton
                  className="btn btn-primary text-anft-gradiant border-0 btn-radius-50 px-4"
                  type="submit"
                  size="lg"
                >
                  {t('anftDapp.headerComponent.filter.filter')}
                </CButton>
              </CCol>
            </CRow>
          </CForm>
        )}
      </Formik>
    </CCard>
  );
};

export default FilterComponent;
