import { BigNumber, ethers } from "ethers";
import { APP_DATE_FORMAT, TOKEN_SYMBOL } from "../config/constants";
import dayjs from 'dayjs';

export const estimateOwnership = (x: number, y: number) => {
  if (y === 0) return "0.00";
  return (x / y).toFixed(2);
};

export const noMoreThanOneCommas = (input: number | string) => {
  const str = input.toString();
  let commasCount = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === ".") commasCount++;
    if (commasCount > 1) break;
  }
  return commasCount <= 1;
};

export const insertCommas = (input: number | undefined | string) => {
  if (typeof input !== "undefined") {
    if (!noMoreThanOneCommas(input)) return "";
    const parts = input.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    if (parts[1]) parts[1] = parts[1].substring(0, 6); // Only take the first 4 decimals
    return parts.join(".");
  } else {
    return "";
  }
};

export const unInsertCommas = (input: string) => {
  const parts = input.split(".");
  parts[0] = parts[0].replaceAll(",", "");
  if (parts[1]) parts[1] = parts[1].substring(0, 6); // Only take the first 4 decimals
  return parts.join(".");
};

export const formatBNToken = (input: BigNumber | undefined, displaySymbol: boolean) => {
  if (!input) return "_";
  const formatedAmount = insertCommas(ethers.utils.formatEther(input.toString()));
  return `${formatedAmount} ${displaySymbol ? TOKEN_SYMBOL : ''}`
  // return `${insertCommas(ethers.utils.formatEther(input.toString()))} ${TOKEN_SYMBOL}`
}

export const checkOwnershipExpired = (timestamp: number): boolean => {
  const currTimstamp = dayjs().unix();
  return currTimstamp >= timestamp;
};

export const convertUnixToDate = (timestamp: number) : string => {
  return   dayjs.unix(timestamp).format(APP_DATE_FORMAT) 
}
