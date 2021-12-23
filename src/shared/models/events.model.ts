import { EventType } from '@testing-library/react';
import { BigNumber, ethers } from 'ethers';
import { TBaseEventFilterVariable } from '../../views/events/events-helper';
import { IAsset } from './assets.model';

export interface IEventArg extends ethers.utils.Result{
  _prevOwner?: string;
  _newOwner?: string;
  _start?: BigNumber;
  _end?: BigNumber;
  owner?: string;
  _valueToReturn?: BigNumber;
  _stakeholder?: string;
  _reward?: BigNumber;
  _from?: BigNumber;
  _to?: BigNumber;
  _amount?: BigNumber;
  _optionId?: BigNumber;
  _at?: Number;
  _worker?: string;
  _isAuthorized?: boolean;
}

export interface IEvent {
  id: number;
  createdDate: Date;
  assetId: string;
  block: number;
  eventType: EventType;
  asset: IAsset;
  listingId: string;
  eventArg: TBaseEventFilterVariable;
}
