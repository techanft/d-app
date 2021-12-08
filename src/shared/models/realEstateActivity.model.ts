import { Status } from "../../enumeration/status";

export interface IRealEstateActivity {
    activityName: string,
    bonusRate: string,
    registerLevel: string,
    reward: string,
    createdDate: string,
}

export interface IRegisterRewardHistory extends IRealEstateActivity {
    status: Status,
}

