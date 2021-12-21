import { ethers, BigNumber } from "ethers";
import { EventType } from "../../shared/enumeration/eventType";
import { Listing } from "../../typechain";


export type TBaseSetterArguments = {
  _amount: undefined | BigNumber;
  _optionId: undefined | number;
  _increase: undefined | boolean;
  _worker: undefined | string;
};
export const baseSetterArgs: TBaseSetterArguments = {
  _amount: undefined,
  _optionId: undefined,
  _increase: undefined,
  _worker: undefined,
};

export type TSettterMapping = { [key in EventType]: (() => Promise<ethers.ContractTransaction>) | null };

export const settersMapping = (contract: Listing, type: EventType, args: TBaseSetterArguments)  => {
  const { _amount, _optionId, _increase, _worker } = args;

  const mapping: TSettterMapping = {
    [EventType.OWNERSHIP_EXTENSION]: !_amount ? null : () => contract.extendOwnership(_amount),
    [EventType.UNREGISTER]: !_optionId ? null : () => contract.unregister(_optionId),
    [EventType.UPDATE_WORKER]: !_worker ? null : () => contract.updateWorker(_worker),
    [EventType.REGISTER]:
      !_optionId || !_amount || !_increase ? null : () => contract.register(_amount, _optionId, _increase),
    [EventType.CLAIM]: !_optionId ? null : () => contract.claimReward(_optionId),
    [EventType.WITHDRAW]: () => contract.withdraw(),
  };

  return mapping[type];
};
