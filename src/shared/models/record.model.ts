export interface IRecord {
  id: number;
  createdDate: Date;
  listingAddress: string;
}

export interface IRecordWorker extends IRecord {
  worker: string;
}

export interface IRecordOwnership extends IRecord {
  previousOwner: string;
  newOwner: string;
  from: string;
  to: string;
  amount: string;
}

export interface IRecordClaim extends IRecord {
  stakeholder: string;
  from: string;
  to: string;
  amount: string;
}

export interface IRecordRegister extends IRecord {
  stakeholder: string;
  optionId: string;
  amount: string;
}

export interface IRecordUnRegister extends IRecord {
  stakeholder: string;
  optionId: string;
}

export interface IRecordWithdraw extends IRecord {
  owner: string;
  amount: string;
  initialOwnership: string;
  newOwnership: string;
}
