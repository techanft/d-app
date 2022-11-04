

// export type TAuthorities = Permission | InternalActivities | ExternalActivities;

import { Roles } from "../enumeration/roles";

export interface INewUser {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  login: string;
  password: string;
  idCard: string;
}

export interface IUser extends INewUser {
  id: string;
  role: Roles;
  createdDate?: string;
  tokenLocked?: number;
  reward?: number;
  walletAddress?: string;
  tokens: number; // user in affiliate
  bonusTokens: number; // user in affiliate
  fullName: string; // user in affiliate
  agencyName: string; // user in affiliate
  parent: IUser; // user in affiliate
}
