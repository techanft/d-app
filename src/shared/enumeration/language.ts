export enum Language {
    en = "en", //English
    vi = "vi", //Vietnamese
  }
  
  export const languageArray: Language[] = [
    Language.en, 
    Language.vi, 
  ];
  
  export const mapLanguage: { [key in Language]: string } = {
    [Language.en]: 'Tiếng Anh',
    [Language.vi]: 'Tiếng Việt',
  };