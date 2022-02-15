export interface IRecord {
  id: number;
  createdDate: Date;
  listingAddress: string;
}

export interface IRecordWorker extends IRecord {
  worker: string;
}

export interface IRecordOwnership extends IRecord {
  listingId: number;
  previousOwner: string;
  newOwner: string;
  from: string;
  to: string;
  amount: string;
}

export interface IRecordClaim extends IRecord {
  listingId: number;
  stakeholder: string;
  from: string;
  to: string;
  amount: string;
}

export interface IRecordRegister extends IRecord {
  listingId: number;
  stakeholder: string;
  optionId: string;
  amount: string;
}

export interface IRecordUnRegister extends IRecord {
  listingId: number;
  stakeholder: string;
  optionId: string;
}

export interface IRecordWithdraw extends IRecord {
  listingId: number;
  owner: string;
  amount: string;
  initialOwnership: string;
  newOwnership: string;
}
