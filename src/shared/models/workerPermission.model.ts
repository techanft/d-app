import { WorkerStatus } from "../../enumeration/workerStatus";

export interface IWorkerPermission {
    address: string,
    createdDate: string,
    status: WorkerStatus
}