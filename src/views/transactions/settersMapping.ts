import { ethers, BigNumber } from 'ethers';
import { EventType } from '../../shared/enumeration/eventType';
import { Listing } from '../../typechain';

export type TBaseSetterArguments = {
  _amount: undefined | BigNumber;
  _optionId: undefined | number;
  _worker: undefined | string;
};
export const baseSetterArgs: TBaseSetterArguments = {
  _amount: undefined,
  _optionId: undefined,
  _worker: undefined,
};

export type TSettterMapping = { [key in EventType]: (() => Promise<ethers.ContractTransaction>) | null };

export const settersMapping = (contract: Listing, type: EventType, args: TBaseSetterArguments) => {
  const { _amount, _optionId, _worker } = args;

  const mapping: TSettterMapping = {
    [EventType.OWNERSHIP_EXTENSION]: _amount === undefined ? null : () => contract.extendOwnership(_amount),
    [EventType.UNREGISTER]: _optionId === undefined ? null : () => contract.unregister(_optionId),
    [EventType.UPDATE_WORKER]: _worker === undefined ? null : () => contract.updateWorker(_worker),
    [EventType.REGISTER]:
      _optionId === undefined || _amount === undefined ? null : () => contract.register(_amount, _optionId),
    [EventType.CLAIM]: _optionId === undefined ? null : () => contract.claimReward(_optionId!),
    [EventType.WITHDRAW]: _amount === undefined ? null : () => contract.withdraw(_amount),
  };

  return mapping[type];
};
