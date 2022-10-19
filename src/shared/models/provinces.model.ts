export interface IOfficeAddress {
  code: string;
  name: string;
  id: string;
}

export interface IProvincesAddress extends IOfficeAddress {
  countryCode: string;
}

export interface IDistrictsAddress extends IOfficeAddress {
  provinceCode: string;
}
export interface IWardsAddress extends IOfficeAddress {
  districtCode: string;
}
