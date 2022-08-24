import { CButton, CCard, CCol, CForm, CInputCheckbox, CLabel, CRow, CSelect } from '@coreui/react';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Formik, FormikProps } from 'formik';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { IAssetFilter } from '../../views/listings/Listings';
import { RootState } from '../reducers';

const initialValues: IAssetFilter = {
  page: 0,
  size: 10,
  sort: 'createdDate,desc',
  // level: ExchangeType.PRIMARY,
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

  const formikRef = useRef<FormikProps<IAssetFilter>>(null);
  const listingsFilterKeys = Object.keys(listingsFilter) as Array<keyof TListingsFilter>;

  const { t } = useTranslation();

  const { signerAddress } = useSelector((state: RootState) => state.wallet);

  return (
    <CCard className={'card-filter shadow'}>
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
            <div className="modal-title-style d-flex justify-content-end px-3 py-2">
              <CLabel className="m-auto pl-3"> {t('anftDapp.headerComponent.filter.filter')}</CLabel>
              <CButton className="p-0 text-primary" onClick={resetForm}>
                <FontAwesomeIcon icon={faSyncAlt} size="lg" />
              </CButton>
            </div>
            <CRow className="mx-2">
              {listingsFilterKeys.map((e) => (
                <CCol xs={12} className="px-2 text-center py-2" key={`listings-key-${e}`}>
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
              <CCol xs={12} className="py-3 d-flex align-items-end">
                <CInputCheckbox
                  id="owner"
                  name="owner"
                  className="form-check-input m-0"
                  value={values.owner}
                  onChange={handleChange}
                  checked={Boolean(values.owner)}
                  disabled={!Boolean(signerAddress)}
                />
                <CLabel className="content-title pl-2 m-0 text-gradient">
                  {t('anftDapp.headerComponent.filter.owned')}
                </CLabel>
              </CCol>
              <CCol xs={12} className="d-flex justify-content-center my-2">
                <CButton className="btn btn-primary text-anft-gradiant border-0 btn-radius-50" type="submit">
                  {t('anftDapp.headerComponent.filter.apply')}
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
