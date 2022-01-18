import { CCol, CRow, CSelect, CSubheader } from '@coreui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router-dom';
import Listings from '../listings/Listings';

interface IDashboard extends RouteComponentProps {}

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

const DashboardFilter = () => {
  const { t } = useTranslation();
  return (
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
  );
};

const Dashboard = (props: IDashboard) => {
  return (
    <>
      <DashboardFilter />
      <Listings routingProps={props} />
    </>
  );
};

export default Dashboard;
