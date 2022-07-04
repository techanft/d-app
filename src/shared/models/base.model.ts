export interface IGetAllResp<T> {
  results: T[];
  count: number;
}

export interface IInitialState {
  fetchEntitiesSuccess: boolean;
  fetchEntitySuccess: boolean;
  updateEntitySuccess: boolean;
  deleteEntitySuccess: boolean;

  entitiesLoading: boolean;
  entityLoading: boolean;

  errorMessage: string | null;
  totalItems: number;
}

export interface IResponse<T> {
  count: number;
  results: T;
}

export interface IParams {
  size: number;
  page: number;
  sort?: string;
}
export interface IWindowEth extends Window {
  ethereum: any;
}
