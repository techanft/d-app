export enum Status {
    REGISTER = 'REGISTER',
    UNREGISTER = 'UNREGISTER',
    CLAIMREWARD = 'CLAIMREWARD',
  }
  
  export const statusArray: Status[] = [Status.REGISTER, Status.UNREGISTER, Status.CLAIMREWARD];

  export const mapStatus: { [key in Status]: string } = {
    [Status.REGISTER]: 'Registered',
    [Status.UNREGISTER]: 'Unregistered',
    [Status.CLAIMREWARD]: 'Claim reward',
  };
  
  export const mapStatusBadge :  { [key in Status]:  string } = {
    [Status.REGISTER]: 'info',
    [Status.UNREGISTER]: 'danger',
    [Status.CLAIMREWARD]: 'success',
  }