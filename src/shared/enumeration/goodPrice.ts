export enum PriceStatus {
  LOW = 'LOW',
  GOOD = 'GOOD',
  HIGH = 'HIGH',
}

export const priceStatusArray: PriceStatus[] = [PriceStatus.LOW, PriceStatus.HIGH, PriceStatus.GOOD];

export const mapPriceStatus: { [key in PriceStatus]: string } = {
  [PriceStatus.LOW]: 'Thấp',
  [PriceStatus.GOOD]: 'Tốt',
  [PriceStatus.HIGH]: 'Cao',
};

export const mapPriceStatusBadge: { [key in PriceStatus]: string } = {
  [PriceStatus.LOW]: 'danger',
  [PriceStatus.GOOD]: 'info',
  [PriceStatus.HIGH]: 'success',
};
