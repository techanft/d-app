export interface IListing {
  owner: string;
  listingId: string;
  ownership: string;
  value: string;
  dailyPayment: string;
  validator: string;
  tokenContract: string;
  worker?: any;
  totalStake: string;
  rewardPool: string;
}
