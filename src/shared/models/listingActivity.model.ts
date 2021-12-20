import { Status } from "../enumeration/status";

export interface IListingActivity {
    activityName: string,
    bonusRate: string,
    registerLevel: string,
    reward: string,
    createdDate: string,
}

export interface IRegisterRewardHistory extends IListingActivity {
    status: Status,
}

