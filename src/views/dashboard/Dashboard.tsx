import { CCol, CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle, CRow, CSubheader } from '@coreui/react';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router-dom';
import Listings from '../listings/Listings';

interface IDashboard extends RouteComponentProps {}

const DashboardFilter = () => {
  const { t } = useTranslation();
  return (
    <CSubheader className="sub-header mt-2 justify-content-center align-items-center">
      <CRow className="w-100 p-1">
        <CCol xs={4} className="px-0 text-center">
          <CDropdown className="mx-2">
            <CDropdownToggle
              color="white"
              className="dt-filter content-title btn-radius-50 w-100 px-0 text-dark"
              caret={false}
            >
              {t('anftDapp.headerComponent.filter.type')} <FontAwesomeIcon icon={faAngleDown} />
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem href="#">Action</CDropdownItem>
              <CDropdownItem href="#">Another action</CDropdownItem>
              <CDropdownItem href="#">Something else here</CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        </CCol>
        <CCol xs={4} className="px-0 text-center">
          <CDropdown className="mx-2">
            <CDropdownToggle
              color="white"
              className="dt-filter content-title btn-radius-50 w-100 px-0 text-dark"
              caret={false}
            >
              {t('anftDapp.headerComponent.filter.state')} <FontAwesomeIcon icon={faAngleDown} />
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem href="#">Action</CDropdownItem>
              <CDropdownItem href="#">Another action</CDropdownItem>
              <CDropdownItem href="#">Something else here</CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        </CCol>
        <CCol xs={4} className="px-0 text-center">
          <CDropdown className="mx-2">
            <CDropdownToggle
              color="white"
              className="dt-filter content-title btn-radius-50 w-100 px-0 text-dark"
              caret={false}
            >
              {t('anftDapp.headerComponent.filter.services')} <FontAwesomeIcon icon={faAngleDown} />
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem href="#">Action</CDropdownItem>
              <CDropdownItem href="#">Another action</CDropdownItem>
              <CDropdownItem href="#">Something else here</CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
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
