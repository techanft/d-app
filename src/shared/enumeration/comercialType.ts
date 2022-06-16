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
  