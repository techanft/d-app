import CIcon from '@coreui/icons-react';
import { CLink, CSidebar, CSidebarBrand } from '@coreui/react';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Dropdown } from '../shared/enumeration/dropdown';
import { Language } from '../shared/enumeration/language';
import { RootState } from '../shared/reducers';
import { toggleSidebar } from './reducer';

interface DropdownState {
  [Dropdown.LANGUAGE]: boolean;
}

const intialDDState: DropdownState = {
  [Dropdown.LANGUAGE]: false,
};

const TheSidebar = () => {
  const location = useLocation().pathname;
  const dispatch = useDispatch();
  const containerState = useSelector((state: RootState) => state.container);
  const { sidebarShow } = containerState;

  const { i18n, t } = useTranslation();

  const changeLanguageI18n = (lang: Language) => () => {
    i18n.changeLanguage(lang);
  };

  const [ddState, setDDStates] = useState<DropdownState>(intialDDState);
  const setDDCurrying =
    (key: Dropdown, value: boolean): React.MouseEventHandler<HTMLAnchorElement> =>
    (): void =>
      setDDStates({ ...ddState, [key]: value });

  const { LANGUAGE } = ddState;

  useEffect(() => {
    if (sidebarShow === 'responsive') {
      setDDStates({ ...intialDDState, LANGUAGE: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sidebarShow]);

  const highlightNavItem = (path: string): 'c-active text-primary' | '' => {
    if (path === '/') return '';
    return location.includes(path) ? 'c-active text-primary' : '';
  };

  return (
    <CSidebar
      className="c-sidebar-light text-sm "
      show={sidebarShow}
      unfoldable
      onShowChange={(val: boolean) => dispatch(toggleSidebar(val))}
    >
      <CSidebarBrand className="header-container">ANFT D-APP</CSidebarBrand>
      <ul className="c-sidebar-nav h-100 ps">
        <li className={`c-sidebar-nav-dropdown ${LANGUAGE ? 'c-show' : ''}`}>
          <CLink className="c-sidebar-nav-dropdown-toggle" onClick={setDDCurrying(Dropdown.LANGUAGE, !LANGUAGE)}>
            <FontAwesomeIcon icon={faGlobe} className="c-sidebar-nav-icon text-primary" />
            {t('anftDapp.sidebarComponent.language.language')}
          </CLink>
          <ul className="c-sidebar-nav-dropdown-items">
            <li className={`c-sidebar-nav-item `}>
              <CLink
                className={`c-sidebar-nav-link ${i18n.language.includes(Language.vi) ? 'text-primary' : ''}`}
                onClick={changeLanguageI18n(Language.vi)}
              >
                {t('anftDapp.sidebarComponent.language.vietnamese')}
                <CIcon name="cif-vn" className={`ml-1`} />
              </CLink>
            </li>
            <li className={`c-sidebar-nav-item`}>
              <CLink
                className={`c-sidebar-nav-link ${i18n.language.includes(Language.en) ? 'text-primary' : ''}`}
                onClick={changeLanguageI18n(Language.en)}
              >
                {t('anftDapp.sidebarComponent.language.english')}
                <CIcon name="cif-us" className={`ml-1`} />
              </CLink>
            </li>
          </ul>
        </li>
        <li className={`c-sidebar-nav-item `}>
          {/* 
            overview => logs-overview;
            change route and component names
          */}
          {/* 
            Add icon for this nav item
          */}
          <CLink className={`c-sidebar-nav-link ${highlightNavItem('/logs-overview')}`} to={'/logs-overview'}>
            <CIcon name="cil-history" className={`c-sidebar-nav-icon text-primary`} />  {t('anftDapp.listingComponent.activityLogs')}
          </CLink>
        </li>
      </ul>
    </CSidebar>
  );
};

export default React.memo(TheSidebar);
