import { BigNumber } from 'ethers';
import { IOption } from './options.model';

export interface IAsset {
  id: number;
  createdDate: Date;
  address: string;
  images: string;
  tHash: string;
  value: BigNumber | undefined;
  dailyPayment: BigNumber | undefined;
  ownership: BigNumber | undefined;
  owner: string | undefined;
  validator: string | undefined;
  totalStake: BigNumber | undefined;
  options: IOption[];
}
