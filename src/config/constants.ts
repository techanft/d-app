import { IWindowEth } from '../shared/models/base.model';
import { BSC_MAINNET_CONFIG, RINKEBY_TESTNET_CONFIG } from './chains';

export const APP_DATE_FORMAT = 'HH:mm - DD/MM/YY';
export const APP_TIMESTAMP_FORMAT = 'DD/MM/YY HH:mm:ss';
export const APP_LOCAL_DATE_FORMAT = 'DD/MM/YYYY';
export const APP_LOCAL_DATETIME_FORMAT = 'YYYY-MM-DDTHH:mm';
export const APP_LOCAL_DATETIME_FORMAT_Z = 'YYYY-MM-DDTHH:mm Z';
export const APP_WHOLE_NUMBER_FORMAT = '0,0';
export const APP_TWO_DIGITS_AFTER_POINT_NUMBER_FORMAT = '0,0.[00]';
export const HTML_DATE_INPUT_FORMAT = 'YYYY-MM-DD';
export const HTML_DATE_TIME_INPUT_FORMAT = 'YYYY-MM-DDTHH:mm';
export const DATE_SUBMIT_FORMAT = 'YYYY-MM-DD';
export const MAX_SUPPLY = 1232000000;
export const TOKEN_SYMBOL = 'ANFT';
export const _window = window as unknown as IWindowEth;

export const USING_TESTNET = true; // Network toggler 
export const SERVER_API_URL = USING_TESTNET ?  'https://dapp-dev.anft.vn/api/' : 'https://app.anft.vn/api/' ;
export const BLOCKCHAIN_NETWORK = USING_TESTNET ? RINKEBY_TESTNET_CONFIG : BSC_MAINNET_CONFIG
