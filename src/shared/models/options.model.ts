import { BigNumber } from "ethers";

export interface IStake {
    start: BigNumber
    amount: BigNumber
    active: boolean;
}

export interface IOption {
    name: string;
    id: number;
    reward: BigNumber | undefined;
    totalStake: BigNumber | undefined;
    isSet: boolean;
    stake: IStake | null
}

export const baseOptions : IOption[] = [
    {
        id: 0,
        name: "HỆ SINH THÁI BĐS SỐ 4.0",
        reward: undefined,
        totalStake: undefined,
        isSet: false,
        stake: null
    },
    {
        id: 1,
        name: "QUẢN LÝ TÀI SẢN BĐS NFT",
        reward: undefined,
        totalStake: undefined,
        isSet: false,
        stake: null
    },
    {
        id: 2,
        name: "QUỸ ĐẦU TƯ BĐS \"ETF\"",
        reward: undefined,
        totalStake: undefined,
        isSet: false,
        stake: null
    },
    {
        id: 3,
        name: "SÀN GIAO DỊCH BĐS 4.0",
        reward: undefined,
        totalStake: undefined,
        isSet: false,
        stake: null
    },
    {
        id: 4,
        name: "ĐỐI TÁC VÀ CHUYÊN GIA",
        reward: undefined,
        totalStake: undefined,
        isSet: false,
        stake: null
    },
    {
        id: 5,
        name: "ĐÀO TẠO ĐẦU TƯ BĐS",
        reward: undefined,
        totalStake: undefined,
        isSet: false,
        stake: null
    },
] 
 
export interface ICompleteOption extends IOption {
    start: BigNumber
    amount: BigNumber
    active: boolean;
}
