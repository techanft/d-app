import { EventType } from "../../enumeration/eventType";

export interface INewEventRecord {
  assetId: number;
  hash: string;
  eventType: EventType;
}

export interface IEventRecord extends INewEventRecord {
  id: number;
  createdDate: Date;
}
