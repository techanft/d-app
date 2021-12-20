export enum WorkerStatus {
    true = 'Active',
    false = 'Inactive'
  }
    
  export const mapWorkerStatusBadge :  { [key in WorkerStatus]:  string } = {
    [WorkerStatus.true]: 'success',
    [WorkerStatus.false]: 'danger',
  }