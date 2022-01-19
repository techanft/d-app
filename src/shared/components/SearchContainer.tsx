import CIcon from '@coreui/icons-react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CCollapse,
  CForm,
  CInput,
  CLabel,
  CRow,
  CSelect
} from '@coreui/react';
import { FormikState } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ISelectValue {
  value: string;
  label: string;
}

interface ISearchItem {
  id: string;
  type: string;
  title: string;
  name?: string;
  name1?: string;
  name2?: string;
  placeHolder?: string;
  placeHolder1?: string;
  placeHolder2?: string;
  singleInput: boolean;
  selectValue?: ISelectValue[];
  onInputChange?: (value: string) => void;
  formText?: string;
  isHidden?: boolean;
  options?: { label: string; value: string }[];
}

export interface ISearchContent {
  searchContent: ISearchItem[];
}

interface ISearchContainer {
  listComponent?: Array<any>;
  handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
  resetForm: (nextState?: Partial<FormikState<any>>) => void;
}
interface IComponentExchange {
  textType: Array<ISearchContent>;
  values: any;
  resetForm: (nextState?: Partial<FormikState<any>>) => void;
  handleChange(e: React.ChangeEvent<any>): void;
  handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
}

export const SearchContainer = (props: ISearchContainer) => {
  const { listComponent, handleSubmit, resetForm } = props;
  const { t } = useTranslation();
  const [cardVisible, setCardVisible] = useState<boolean>(false);
  const setCardVisibleListener = (key: boolean) => (): void => setCardVisible(key);

  const handleResetForm = (): void => {
    resetForm({});
    handleSubmit();
  };
  return (
    <>
      {listComponent && (
        <CForm onSubmit={handleSubmit}>
          <CRow className="searchContainer">
            <CCol xs={12}>
              <CCard className={'btn-radius-25i'}>
                <CCardHeader className={'btn-radius-50i border-bottom-0'}>
                  <div className="d-flex justify-content-between">
                    <p className="content-title mb-0" style={{ fontSize: '1rem', fontWeight: 500 }}>
                      {t('anftDapp.headerComponent.filter.filter')}
                    </p>
                    <div>
                      <CButton className="collapseIcon btn-tool " onClick={handleResetForm}>
                        <CIcon name="cil-filter-x" size="lg" />
                      </CButton>
                      <CButton className="collapseIcon btn-tool " onClick={setCardVisibleListener(!cardVisible)}>
                        <CIcon name={cardVisible ? 'cil-minus' : 'cil-plus'} size="lg" />
                      </CButton>
                    </div>
                  </div>
                </CCardHeader>
                <CCollapse show={cardVisible}>
                  <CCardBody>
                    <CRow className="mb-1">
                      {listComponent.map((item, index) => (
                        <React.Fragment key={index}>{item}</React.Fragment>
                      ))}
                    </CRow>
                    <CRow className="text-center justify-content-center">
                      <CButton type="submit" color="info" className="btn btn-primary btn-radius-50">
                        {t('anftDapp.headerComponent.filter.apply')}
                      </CButton>
                    </CRow>
                  </CCardBody>
                </CCollapse>
              </CCard>
            </CCol>
          </CRow>
        </CForm>
      )}
    </>
  );
};

export const ComponentExchange = (props: IComponentExchange) => {
  const { textType, values, handleChange, handleSubmit, resetForm } = props;
  const exchangeComponent = textType.map((element, index) => {
    return (
      <React.Fragment key={index}>
        {element.searchContent.map((item, i) => {
          switch (item.type) {
            case 'text':
              return (
                <React.Fragment key={i}>
                  {item.singleInput ? (
                    <CCol xs={12} md={6} xxl={3} className={`paddingCol textCol ${item.isHidden ? 'd-none' : ''}`}>
                      <CLabel htmlFor={item.id}>{item.title}</CLabel>
                      <CInput
                        className=" btn-radius-50"
                        id={item.id}
                        type={item.type}
                        onChange={handleChange}
                        placeholder={item.placeHolder}
                        autoComplete="off"
                        name={item.name}
                        value={values[item.name!] || ''}
                      />
                    </CCol>
                  ) : (
                    <CCol xs={12} md={6} xxl={3} className={`paddingCol textCol ${item.isHidden ? 'd-none' : ''}`}>
                      <CLabel htmlFor={item.id}>{item.title}</CLabel>
                      <CRow>
                        <CCol sm={6} className="padright5">
                          <CInput
                            className=" btn-radius-50"
                            onChange={handleChange}
                            id={item.id}
                            type={item.type}
                            value={values[item.name1!] || ''}
                            placeholder={item.placeHolder1}
                            autoComplete="off"
                            name={item.name1}
                          />
                        </CCol>
                        <CCol sm={6} className="padleft5">
                          <CInput
                            className=" btn-radius-50"
                            onChange={handleChange}
                            type={item.type}
                            placeholder={item.placeHolder2}
                            autoComplete="off"
                            name={item.name2}
                            value={values[item.name2!] || ''}
                          />
                        </CCol>
                      </CRow>
                    </CCol>
                  )}
                </React.Fragment>
              );
            case 'date':
              return (
                <CCol key={i} xs={12} md={6} xxl={3} className={`paddingCol textCol ${item.isHidden ? 'd-none' : ''}`}>
                  <CLabel htmlFor={item.id}>{item.title}</CLabel>
                  <CInput
                    className=" dateInput btn-radius-50"
                    onChange={handleChange}
                    id={item.id}
                    type={item.type}
                    value={values[item.name!] || ''}
                    autoComplete="off"
                    name={item.name}
                  />
                </CCol>
              );
            case 'dateRange':
              return (
                <CCol key={i} xs={12} md={6} xxl={3} className={`paddingCol textCol ${item.isHidden ? 'd-none' : ''}`}>
                  <CLabel htmlFor={item.id}>{item.title}</CLabel>
                  <CRow>
                    <CCol sm={6} className="padright5">
                      <CInput
                        className=" dateInput btn-radius-50"
                        onChange={handleChange}
                        id={item.id}
                        type={item.type}
                        value={values[item.name1!] || ''}
                        autoComplete="off"
                        name={item.name1}
                      />
                    </CCol>
                    <CCol sm={6} className="padleft5">
                      <CInput
                        className="  dateInput btn-radius-50"
                        onChange={handleChange}
                        type={item.type}
                        autoComplete="off"
                        name={item.name2}
                        value={values[item.name2!] || ''}
                      />
                    </CCol>
                  </CRow>
                </CCol>
              );
            case 'select':
              return (
                <CCol key={i} xs={12} md={6} xxl={3} className={`paddingCol textCol ${item.isHidden ? 'd-none' : ''}`}>
                  <CLabel htmlFor={item.id}>{item.title}</CLabel>
                  <CSelect name={item.name} id={item.id} onChange={handleChange} value={values[item.name!]}>
                    <option defaultValue="">{item.placeHolder}</option>
                    {item.selectValue!.map((e, indexE) => {
                      return (
                        <option value={e.value} key={indexE}>
                          {e.label}
                        </option>
                      );
                    })}
                  </CSelect>
                </CCol>
              );
            default:
              return (
                <CCol key={i} xs={12} md={6} xxl={3} className={`paddingCol textCol ${item.isHidden ? 'd-none' : ''}`}>
                  <CLabel htmlFor={item.id}>{item.title}</CLabel>
                  <CInput
                    className=" btn-radius-50"
                    id={item.id}
                    value={values[item.name!]}
                    type={item.type}
                    autoComplete="off"
                    name={item.name}
                    onChange={handleChange}
                  />
                </CCol>
              );
          }
        })}
      </React.Fragment>
    );
  });
  return <SearchContainer listComponent={exchangeComponent} resetForm={resetForm} handleSubmit={handleSubmit} />;
};
