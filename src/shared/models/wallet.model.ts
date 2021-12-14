export interface IWallet {
    totalToken: number;
    totalTokenRecharged: number;
    maxTokenWithdraw?: number;
    tokenWithdraw?: number;
    tokenRecharge?: number
}