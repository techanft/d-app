import { BigNumber } from 'ethers';
import { EventType } from '../../shared/enumeration/eventType';
import { IEventArg } from '../../shared/models/events.model';
import { Listing } from '../../typechain';
import { TypedEventFilter } from '../../typechain/common';

export type TBaseEventFilterVariable = {
  _prevOwner: string | undefined;
  _newOwner: string | undefined;
  _start: BigNumber | undefined;
  _end: BigNumber | undefined;
  owner: string | undefined;
  _valueToReturn: BigNumber | undefined;
  _stakeholder: string | undefined;
  _reward: BigNumber | undefined;
  _from: BigNumber | undefined;
  _to: BigNumber | undefined;
  _amount: BigNumber | undefined;
  _optionId: BigNumber | undefined;
  _at: Number | undefined;
  _worker: string | undefined;
  _isAuthorized: boolean | undefined;
};

export const eventFilterVariable: TBaseEventFilterVariable = {
  _prevOwner: undefined,
  _newOwner: undefined,
  _start: undefined,
  _end: undefined,
  owner: undefined,
  _valueToReturn: undefined,
  _stakeholder: undefined,
  _reward: undefined,
  _from: undefined,
  _to: undefined,
  _amount: undefined,
  _optionId: undefined,
  _at: undefined,
  _worker: undefined,
  _isAuthorized: undefined,
};

export type TEventFilterVariable = { [key in EventType]: TBaseEventFilterVariable };

export const handPickEventFilterVariable = (eventArg: IEventArg, eventType: EventType) => {
  const {
    _prevOwner,
    _newOwner,
    _start,
    _end,
    owner,
    _valueToReturn,
    _stakeholder,
    _reward,
    _from,
    _to,
    _amount,
    _optionId,
    _at,
    _worker,
    _isAuthorized,
  } = eventArg;
  const objectMap: TEventFilterVariable = {
    [EventType.CLAIM]: {
      ...eventFilterVariable,
      _stakeholder,
      _reward,
      _from,
      _to,
    },
    [EventType.OWNERSHIP_EXTENSION]: {
      ...eventFilterVariable,
      _prevOwner,
      _newOwner,
      _start,
      _end,
      _amount,
    },
    [EventType.REGISTER]: {
      ...eventFilterVariable,
      _stakeholder,
      _amount,
      _optionId,
      _start,
    },
    [EventType.UNREGISTER]: {
      ...eventFilterVariable,
      _stakeholder,
      _at,
    },
    [EventType.WITHDRAW]: {
      ...eventFilterVariable,
      owner,
      _valueToReturn,
    },
    [EventType.UPDATE_WORKER]: {
      ...eventFilterVariable,
      _isAuthorized,
      _worker,
    },
  };
  return objectMap[eventType];
};

export type EventFilter = TypedEventFilter<any[], IEventArg>;
export type TSettterMapping = { [key in EventType]: EventFilter };

// These filter will be obsolete soon, so "any" here is ok
export const eventFilterMapping = (contract: any, type: EventType) => {
// export const eventFilterMapping = (contract: Listing, type: EventType) => {
  const mapping: TSettterMapping = {
    [EventType.CLAIM]: contract.filters.Claim(),
    [EventType.OWNERSHIP_EXTENSION]: contract.filters.OwnershipExtension(),
    [EventType.REGISTER]: contract.filters.Register(),
    [EventType.UNREGISTER]: contract.filters.Unregister(),
    [EventType.WITHDRAW]: contract.filters.Withdraw(),
    [EventType.UPDATE_WORKER]: contract.filters.UpdateWorker(),
  };

  return mapping[type];
};
