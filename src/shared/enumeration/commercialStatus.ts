export enum SellStatus {
  YET_SOLD = 'YET_SOLD',
  LOCKED = 'LOCKED',
  TRANSFER_WAITING = 'TRANSFER_WAITING',
  SOLD = 'SOLD',
}

export enum RentStatus {
  YET_RENTED = 'YET_RENTED',
  LOCKED = 'LOCKED',
  RENTED = 'RENTED',
}

export const mapCommercialStatus: { [key in SellStatus | RentStatus]: string } = {
  [SellStatus.YET_SOLD]: 'Chưa bán',
  [SellStatus.LOCKED]: 'Chờ giao dịch',
  [SellStatus.TRANSFER_WAITING]: 'Chờ chuyển nhượng',
  [SellStatus.SOLD]: 'Đã bán',
  [RentStatus.YET_RENTED]: 'Chưa cho thuê',
  [RentStatus.LOCKED]: 'Chờ giao dịch',
  [RentStatus.RENTED]: 'Đang cho thuê',
};

export const mapCommercialStatusBadge: { [key in SellStatus | RentStatus]: string } = {
  [SellStatus.YET_SOLD]: 'secondary',
  [SellStatus.LOCKED]: 'danger',
  [SellStatus.TRANSFER_WAITING]: 'primary',
  [SellStatus.SOLD]: 'success',
  [RentStatus.YET_RENTED]: 'secondary',
  [RentStatus.LOCKED]: 'danger',
  [RentStatus.RENTED]: 'warning',
};
