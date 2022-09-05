export enum ExchangeType {
  PRIMARY = 'PRIMARY',
  SECONDARY = 'SECONDARY',
}

export const mapExchangeTypeBadge: { [key in ExchangeType]: string } = {
  [ExchangeType.PRIMARY]: 'primary',
  [ExchangeType.SECONDARY]: 'success',
};
