import { CCol, CContainer, CLabel, CRow } from '@coreui/react';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router-dom';
import * as Yup from 'yup';
import { isDateAfter, isDateBefore } from '../../shared/casual-helpers';
import ActivityLogsContainer from '../../shared/components/ActivityLogsContainer';
import { ComponentExchange, ISearchContent } from '../../shared/components/SearchContainer';
import { ToastError } from '../../shared/components/Toast';

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
          title: t('anftDapp.activityLogsComponent.activityLogsTable.from'),
          title2nd: t('anftDapp.activityLogsComponent.activityLogsTable.to'),
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
        !isDateBefore(value, this.parent?.toDate) &&
          ToastError(t('anftDapp.activityLogsComponent.errors.startingDateDoesNotOccurAfterTheEndingDate'));
        return isDateBefore(value, this.parent?.toDate);
      }
    ),
    toDate: Yup.string().test(
      'is-after-start',
      t('anftDapp.activityLogsComponent.errors.endingDateDoesNotOccurBeforeTheStartingDate'),
      function (value) {
        !isDateAfter(value, this.parent?.fromDate) &&
          ToastError(t('anftDapp.activityLogsComponent.errors.endingDateDoesNotOccurBeforeTheStartingDate'));
        return isDateAfter(value, this.parent?.fromDate);
      }
    ),
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
            onSubmit={(values) => {
              setFilterState(values);
            }}
          >
            {({ values, handleChange, handleSubmit, resetForm }) => (
              <>
                <ComponentExchange
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
