
export interface IStage {
  id: string;
  dueDate: string;
  soldOutDate?: string;
  toDate: string;
  name: string;
  amount: number;
  expectedPrice?: number;
  salePrice: number;
  restAnft: number;
  saleTokens: number;
  bonusTokens: number;
  parentId?: string;
  parent?: IStage;
}
export interface INewStage extends Omit<IStage, "id" | "amount" | "restAnft" | "saleTokens" | "bonusTokens"> {
  id?: string;
  amount: undefined | number;
}

export interface IMiniStage extends IStage {
  parent: IStage,
  totalRevenue: number;
}