import { BigNumber, ethers } from 'ethers';
import moment from 'moment';
import { APP_DATE_FORMAT, TOKEN_SYMBOL } from '../config/constants';
import { IAsset } from './models/assets.model';
import { baseOptions } from './models/options.model';

export const estimateOwnership = (amount: BigNumber, dailyPayment: BigNumber, currentOwnership: BigNumber) => {
  const initialOwnership = checkOwnershipExpired(currentOwnership.toNumber())
    ? BigNumber.from(moment().unix())
    : currentOwnership;

  const additionalCredit = amount.mul(86400).div(dailyPayment).toNumber();

  const newOwnership = initialOwnership.toNumber() + additionalCredit;
  return convertUnixToDate(newOwnership);
};

export const noMoreThanOneCommas = (input: number | string) => {
  const str = input.toString();
  let commasCount = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === '.') commasCount++;
    if (commasCount > 1) break;
  }
  return commasCount <= 1;
};

export const insertCommas = (input: number | undefined | string, n: number = 4) => {
  if (typeof input !== 'undefined') {
    if (!noMoreThanOneCommas(input)) return '';
    const parts = input.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    if (parts[1]) parts[1] = parts[1].substring(0, n); // Only take the first n decimals, default 4 decimals
    return parts.join('.');
  } else {
    return '';
  }
};

export const unInsertCommas = (input: string, n: number = 4) => {
  const parts = input.split('.');
  parts[0] = parts[0].replaceAll(',', '');
  if (parts[1]) parts[1] = parts[1].substring(0, n); // Only take the first n decimals, default 4 decimals
  return parts.join('.');
};

export const convertBnToDecimal = (input: BigNumber) => {
  return ethers.utils.formatEther(input.toString());
};
export const convertDecimalToBn = (input: string) => {
  const sanitizedInput = input.replace(/[^\d.-]/g, ''); //https://stackoverflow.com/questions/1862130/strip-all-non-numeric-characters-from-string-in-javascript
  if (!sanitizedInput) return BigNumber.from(0);
  return ethers.utils.parseUnits(sanitizedInput);
};

export const formatBNToken = (input: BigNumber | undefined, displaySymbol: boolean, n: number = 4) => {
  if (!input) return '_';
  const formatedAmount = insertCommas(convertBnToDecimal(input), n);
  return `${formatedAmount} ${displaySymbol ? TOKEN_SYMBOL : ''}`;
};

export const checkOwnershipExpired = (timestamp: number): boolean => {
  const currTimstamp = moment().unix();
  return currTimstamp >= timestamp;
};

export const convertUnixToDate = (timestamp: number): string => {
  return moment.unix(timestamp).format(APP_DATE_FORMAT);
};
export const getEllipsisTxt = (str: string, n = 5) => {
  if (str) {
    return `${str.slice(0, n)}...${str.slice(str.length - n)}`;
  }
  return '';
};

export const estimateWithdrawAmount = (dailyPayment: BigNumber, currentOwnership: BigNumber, currentUnix: number) => {
  if (currentOwnership.toNumber() > currentUnix) {
    const amount = ((currentOwnership.toNumber() - currentUnix) * Number(convertBnToDecimal(dailyPayment))) / 86400;
    return amount;
  }
  return 0;
};

// Returns true if viewer is the listing owner AND ownership is not expired
export const validateOwnership = (viewerAddr: string | undefined, listingInfo: IAsset) => {
  const { ownership, owner } = listingInfo;
  if (!ownership || !owner) {
    return false;
  }
  const viewerIsOwner = viewerAddr === owner;
  const ownershipExpired = checkOwnershipExpired(ownership.toNumber());

  if (!viewerIsOwner) return false;

  return !ownershipExpired;
};

export const formatLocalDatetime = (input: string | Date | undefined): string => {
  return moment(input).format(APP_DATE_FORMAT);
};

export const returnOptionNameById = (optionId: number): string => {
  const optionsPromises = baseOptions.find((item) => item.id === optionId);
  if (optionsPromises) {
    return optionsPromises.name;
  } else {
    return '_';
  }
};

// Duplicative logic:
// startDate/toDate originally are momment.Momment
// They're converted to ISOString as params to put in this function
// Then in this function they're converted to momment.Momment
export const calculateDateDifference = (fromDate: moment.Moment, toDate: moment.Moment): number => {
  if (!fromDate || !toDate) return 0;
  const fromDateObj = moment(fromDate);
  const toDateObj = moment(toDate);
  const diffDays = Math.floor(moment.duration(toDateObj.diff(fromDateObj)).asDays());
  return diffDays;
};

export const calculateSpendingFromSecond = (dailyPayment: BigNumber, diffSecond: number) => {
  const diffSecondBn = BigNumber.from(Math.round(diffSecond));
  const spending = dailyPayment.mul(diffSecondBn).div(86400);
  return spending;
};

export const getSecondDifftoEndDate = (startDate: moment.Moment) => {
  const endOfStartDate = moment(startDate).endOf('day');
  const endOfStartDateMinus29Minutes = endOfStartDate.subtract(29, 'minutes');
  const duration = moment.duration(endOfStartDateMinus29Minutes.diff(startDate));
  return duration.asSeconds();
};

export const returnMaxEndDate = (days: number, maxDays: number): number => {
  if (days > maxDays) return maxDays;
  return days;
};

export const calculatePriceByDays = (days: number, startDate: moment.Moment, listing: IAsset | undefined) => {
  if (!startDate || !listing?.dailyPayment) return '0';
  const spending = listing.dailyPayment.mul(days);
  const differenceInSeconds = getSecondDifftoEndDate(startDate);
  const result =
    differenceInSeconds > 0
      ? calculateSpendingFromSecond(listing.dailyPayment, differenceInSeconds).add(spending)
      : spending;
  return convertBnToDecimal(result);
};

export const checkDateRange = (day: moment.Moment, startDate: moment.Moment, endDate: moment.Moment): boolean => {
  // return true if date in range of startDate and endDate
  if (day < startDate) return false;
  return startDate <= day && day <= endDate;
};

export const isDateBefore = (input: string | undefined, compared: string | undefined) => {
  return moment(moment(input)).isBefore(moment(compared));
};

export const isDateAfter = (input: string | undefined, compared: string | undefined) => {
  return moment(moment(input)).isAfter(moment(compared));
};
