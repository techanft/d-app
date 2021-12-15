import { BlockType } from "../../enumeration/blockType";

export interface INewBlockEvent {
  assetId: string;
  hash: string;
  eventType: BlockType;
}

export interface IBlockEvent extends INewBlockEvent {
  id: number;
  createdDate: Date;
}
