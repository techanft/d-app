import { EventType } from "../../enumeration/eventType";

export interface INewEventRecord {
  assetId: string;
  hash: string;
  eventType: EventType;
}

export interface IEventRecord extends INewEventRecord {
  id: number;
  createdDate: Date;
}
