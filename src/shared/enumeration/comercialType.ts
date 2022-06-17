export enum CommercialTypes {
  SELL = 'SELL',
  RENT = 'RENT',
  BORROWED_CAPITAL = 'BORROWED_CAPITAL',
}

export const commercialTypesArray: CommercialTypes[] = [
  CommercialTypes.SELL,
  CommercialTypes.RENT,
  CommercialTypes.BORROWED_CAPITAL,
];

export const mapCommercialTypes: { [key in CommercialTypes]: string } = {
  [CommercialTypes.SELL]: 'Bán',
  [CommercialTypes.RENT]: 'Thuê',
  [CommercialTypes.BORROWED_CAPITAL]: 'Vốn vay',
};

export enum Methods {
  SELL = 'SELL',
  FRANCHISE_ONE = 'FRANCHISE_ONE',
  FRANCHISE = 'FRANCHISE',
  AUTONOMY = 'AUTONOMY',
}

export const methodsArray: Methods[] = [Methods.SELL, Methods.FRANCHISE_ONE, Methods.FRANCHISE, Methods.AUTONOMY];

export const mapMethods: { [key in Methods]: string } = {
  [Methods.SELL]: 'BÁN',
  [Methods.FRANCHISE_ONE]: 'ỦY QUYỀN 1 LẦN',
  [Methods.FRANCHISE]: 'ỦY QUYỀN NHIỀU LẦN',
  [Methods.AUTONOMY]: 'TỰ QUYỀN',
};
