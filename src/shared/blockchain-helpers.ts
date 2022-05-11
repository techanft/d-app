import { BigNumber, ethers } from 'ethers';
import listingArtifact from '../assets/artifacts/Listing.json';
import testTokenImplementation from '../assets/deployments/bsc-testnet/Token_Implementation.json';
import testTokenProxy from '../assets/deployments/bsc-testnet/Token_Proxy.json';
import mainTokenImplementation from '../assets/deployments/bsc-mainnet/Token_Implementation.json';
import mainTokenProxy from '../assets/deployments/bsc-mainnet/Token_Proxy.json';
import { BLOCKCHAIN_NETWORK, USING_TESTNET, _window } from '../config/constants';
import { Listing, Token } from '../typechain';
import { convertDecimalToBn } from './casual-helpers';
import { IAsset } from './models/assets.model';
import { IOption } from './models/options.model';

interface ITokenInstance {
  signer?: ethers.providers.JsonRpcSigner;
  provider?: ethers.providers.Web3Provider;
}

export const TOKEN_INSTANCE = ({ signer, provider }: ITokenInstance): Token | null => {
  try {
    if (!signer && !provider) throw String('requires either signer or provider to generate a instance');
    const contractAddress = USING_TESTNET ? testTokenProxy.address : mainTokenProxy.address;
    const contractABI = USING_TESTNET ?  testTokenImplementation.abi : mainTokenImplementation.abi;
    return new ethers.Contract(contractAddress, contractABI, signer || provider) as Token;
  } catch (error) {
    console.log(`Error getting token instance: ${error}`);
    return null;
  }
};

interface IListingInstance extends ITokenInstance {
  address: string;
}

export const LISTING_INSTANCE = ({ address, signer, provider }: IListingInstance): Listing | null => {
  try {
    const contractABI = listingArtifact.abi;
    if (!signer && !provider) throw String('requires either signer or provider to generate a instance');
    return new ethers.Contract(address, contractABI, signer || provider) as Listing;
  } catch (error) {
    console.log(`Error getting listing instance: ${error}`);
    return null;
  }
};

export const promptUserToSwitchChain = () => {
  _window.ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [BLOCKCHAIN_NETWORK],
  });
};

export const checkWorkerStatus = async (listing: Listing, address: string, status: boolean) => {
  const workerStatus = await listing.workers(address);
  return workerStatus === status;
};
export interface ICalSHReward {
  instance: Listing;
  optionInfo: IOption;
  stakeholder: string;
  storedListing: IAsset;
  currentUnix: BigNumber;
}

export const calculateStakeHolderReward = async ({
  instance,
  optionInfo,
  stakeholder,
  currentUnix,
  storedListing,
}: ICalSHReward) => {
  const { ownership, totalStake, dailyPayment, value } = storedListing;
  if (!ownership || !totalStake || !dailyPayment || !value) return BigNumber.from(0);
  if (totalStake.eq(0)) return BigNumber.from(0);

  const userStake = await instance.stakings(optionInfo.id, stakeholder);

  const safeMul = convertDecimalToBn('1');

  let T = totalStake.mul(safeMul).div(value);

  const T_Threshold = BigNumber.from(86);
  const expiredOwnershipThreshold = BigNumber.from(50);

  if (T.gt(safeMul.mul(T_Threshold).div(100))) {
    T = safeMul.mul(T_Threshold).div(100);
  }

  if (ownership < currentUnix && T.gt(safeMul.mul(expiredOwnershipThreshold).div(100))) {
    T = expiredOwnershipThreshold.mul(safeMul.div(100));
  }

  const RTd = dailyPayment.mul(T).div(safeMul);

  const above = RTd.mul(optionInfo.reward!.toNumber()).div(100);
  const At = optionInfo.totalStake!.eq(0) ? 1 : optionInfo.totalStake!;
  const Ax = userStake._amount;
  const Ar = above.mul(Ax).div(At);

  const Sd = currentUnix.sub(userStake._start);

  const amountToReturn = Ar.mul(Sd).div(86400);

  return amountToReturn;
};
