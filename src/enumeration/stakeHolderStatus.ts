export enum StakeHolderStatus {
    Active = 'Active',
    Inactive = 'Inactive'
  }
  
  export const stakeHolderStatusArray: StakeHolderStatus[] = [StakeHolderStatus.Active, StakeHolderStatus.Inactive];
  
  export const mapstakeHolderStatusBadge :  { [key in StakeHolderStatus]:  string } = {
    [StakeHolderStatus.Active]: 'success',
    [StakeHolderStatus.Inactive]: 'danger',
  }