import { CCol, CContainer, CLabel, CRow } from '@coreui/react';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router-dom';
import ActivityLogsContainer from '../../shared/components/ActivityLogsContainer';
import { ComponentExchange, ISearchContent } from '../../shared/components/searchContainer/SearchContainer';

interface IActivityLogs extends RouteComponentProps {}

export interface IOverviewFilter {
  listingAddress?: string;
  createdDate?: string;
}

const LogsOverview = (props: IActivityLogs) => {
  const { t } = useTranslation();

  const [filterState, setFilterState] = useState<IOverviewFilter>({});

  const textType: Array<ISearchContent> = [
    {
      searchContent: [
        {
          title: t('anftDapp.listingComponent.primaryInfo.blockchainAddress'),
          id: 'listingAddress',
          placeHolder: `${t('anftDapp.listingComponent.primaryInfo.blockchainAddress')}...`,
          type: 'text',
          singleInput: true,
          name: 'listingAddress',
        },
      ],
    },
    {
      searchContent: [
        {
          title: t('anftDapp.activityLogsComponent.createdDate'),
          id: 'createDate',
          type: 'date',
          name: 'createDate',
          singleInput: true,
        },
      ],
    },
  ];

  return (
    <CContainer fluid className="mx-0 my-2">
      <CRow>
        <CCol xs={12}>
          <CLabel className="text-primary content-title">{t('anftDapp.listingComponent.activityLogs')}</CLabel>
        </CCol>
        <CCol xs={12}>
          <Formik
            initialValues={filterState}
            onSubmit={(values) => {
              setFilterState(values);
            }}
          >
            {({ values, handleChange, handleSubmit, resetForm }) => (
              <ComponentExchange
                textType={textType}
                values={values}
                resetForm={resetForm}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
              />
            )}
          </Formik>
        </CCol>
        <ActivityLogsContainer overview={true} filterState={filterState} />
      </CRow>
    </CContainer>
  );
};

export default LogsOverview;
