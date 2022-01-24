import { CCol, CContainer, CLabel, CRow } from '@coreui/react';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router-dom';
import { isDateBefore } from '../../shared/casual-helpers';
import ActivityLogsContainer from '../../shared/components/ActivityLogsContainer';
import { FilterComponent, ISearchContent } from '../../shared/components/SearchContainer';
import { ToastError } from '../../shared/components/Toast';
import * as Yup from 'yup';
;


interface IActivityLogs extends RouteComponentProps {}

export interface IOverviewFilter {
  listingAddress?: string;
  fromDate?: string;
  toDate?: string;
}

const LogsOverview = (props: IActivityLogs) => {
  const { t } = useTranslation();

  const [filterState, setFilterState] = useState<IOverviewFilter>({});

  const textType: Array<ISearchContent> = [
    {
      searchContent: [
        {
          title: t('anftDapp.searchContainer.listingBlockChainAddress'),
          id: 'listingAddress',
          placeHolder: `${t('anftDapp.searchContainer.listingBlockChainAddress')}...`,
          type: 'text',
          singleInput: true,
          name: 'listingAddress',
        },
      ],
    },
    {
      searchContent: [
        {
          title: t('anftDapp.activityLogsComponent.activityLogsTable.fromDate'),
          title2nd: t('anftDapp.activityLogsComponent.activityLogsTable.toDate'),
          id: 'createDate',
          type: 'date',
          name1: 'fromDate',
          name2: 'toDate',
          singleInput: false,
        },
      ],
    },
  ];
  const validationSchema = Yup.object().shape({
    fromDate: Yup.string().test(
      'is-before-end',
      t('anftDapp.activityLogsComponent.errors.startingDateDoesNotOccurAfterTheEndingDate'),
      function (value) {
        if (!value || !this.parent.toDate) return true;
        !isDateBefore(value, this.parent?.toDate) &&
          ToastError(t('anftDapp.activityLogsComponent.errors.startingDateDoesNotOccurAfterTheEndingDate'));
        return isDateBefore(value, this.parent?.toDate);
      }
    )
  });

  return (
    <CContainer fluid className="mx-0 my-2">
      <CRow>
        <CCol xs={12}>
          <CLabel className="text-primary content-title">{t('anftDapp.listingComponent.activityLogs')}</CLabel>
        </CCol>
        <CCol xs={12}>
          <Formik
            initialValues={filterState}
            validationSchema={validationSchema}
            validateOnChange={false}
            onSubmit={(values) => {
              setFilterState(values);
            }}
          >
            {({ values, handleChange, handleSubmit, resetForm }) => (
              <>
                <FilterComponent
                  textType={textType}
                  values={values}
                  resetForm={resetForm}
                  handleChange={handleChange}
                  handleSubmit={handleSubmit}
                />
              </>
            )}
          </Formik>
        </CCol>
        <ActivityLogsContainer shouldDisplayBlockchainAddress={true} filterState={filterState} />
      </CRow>
    </CContainer>
  );
};

export default LogsOverview;
