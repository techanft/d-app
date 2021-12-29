export enum ModalType {
  OWNERSHIP_EXTENSION = 'OWNERSHIP_EXTENSION',
  OWNERSHIP_WITHDRAW = 'OWNERSHIP_WITHDRAW',
  OWNERSHIP_REGISTER = 'OWNERSHIP_REGISTER',
  REWARD_CLAIM = 'REWARD_CLAIM',
  REWARD_UNREGISTER = 'REWARD_UNREGISTER', 
}

export enum CollapseType {
  INVESTMENT = 'INVESTMENT',
  MANAGEMENT = 'MANAGEMENT',
  WORKER_LIST = 'WORKER_LIST',
}
export type TModalsVisibility = { [key in ModalType]: boolean };
export type TCollapseVisibility = { [key in CollapseType]: boolean };
