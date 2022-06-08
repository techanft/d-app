import { RiskLevel } from '../enumeration/riskLevel';
import { Status } from '../enumeration/status';

export enum CategoryType {
  PRODUCT = 'PRODUCT',
  PROJECT = 'PROJECT',
}

export interface IRiskLevel {
  type: RiskLevel;
  value: string;
}

export interface INewDurationRisk {
  listingTypeId: string;
  value: string;
  districtCode: string;
  provinceCode: string;
}

export interface IDurationRisk extends INewDurationRisk {
  id: string;
}
export interface IPotential {
  id?: string;
  name: string;
  note: string;
  icon: string;
}

export interface INewListingType {
  name: string;
  parent: CategoryType;
  status: Status;
  createdDate?: string;
  risks: IRiskLevel[];
  profits: IRiskLevel[];
  potentials: IPotential[];
}

export interface IListingType extends INewListingType {
  id: string;
  durationRisk?: IDurationRisk[];
}
