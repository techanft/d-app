import { BigNumber } from 'ethers';
import { IDurationRisk } from './listingType.model';
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
  fee: number | null;
  price: number | null;
  typeId: string;
  rentCost?: number;
  goodPrice: number;
  durationRisk: IDurationRisk;
}
