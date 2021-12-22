import { EventType } from '../../shared/enumeration/eventType';
import { Listing } from '../../typechain';

export const gettersMapping = (contract: Listing, type: EventType) => {
  const mapping = {
    [EventType.CLAIM]: contract.filters.Claim(),
    [EventType.OWNERSHIP_EXTENSION]: contract.filters.OwnershipExtension(),
    [EventType.REGISTER]: contract.filters.Register(),
    [EventType.UNREGISTER]: contract.filters.Unregister(),
    [EventType.WITHDRAW]: contract.filters.Withdraw(),
    [EventType.UPDATE_WORKER]: contract.filters.UpdateWorker(),
  };

  return mapping[type];
};
