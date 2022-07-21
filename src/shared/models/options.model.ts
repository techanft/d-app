import { BigNumber } from "ethers";

export interface IStake {
    start: BigNumber
    amount: BigNumber
    active: boolean;
}

export interface IOption {
    name: string;
    id: number; // index of potential
    reward: BigNumber | undefined;
    totalStake: BigNumber | undefined;
    isSet: boolean;
    stake: IStake | undefined
}