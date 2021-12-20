import { createAsyncThunk } from '@reduxjs/toolkit';
import { BigNumber } from 'ethers';
import { pickBy } from 'lodash';
import axios from '../../config/axios-interceptor';
import { LISTING_INSTANCE } from '../../shared/blockchain-helpers';
import { IAsset } from '../../shared/models/assets.model';
import { IParams, IGetAllResp } from '../../shared/models/base.model';
import { Listing } from '../../typechain';
import { ethers } from "ethers";

export interface IAssetFilter extends IParams {};
export interface IExtndOwnrshpIntialValues {
  listingAddress: string | undefined;
  tokenAmount: number;
}
export interface IExtndOwnershipBody extends Omit<IExtndOwnrshpIntialValues, "tokenAmount"> {
  contract: Listing;
  tokenAmount: ethers.BigNumber;
}


const prefix = 'assets';

// APIs calling centralized server
export const getEntities = createAsyncThunk(`get-all-${prefix}`, async (fields: IAssetFilter, thunkAPI) => {
  try {
    const params = pickBy(fields);
    const { data } = await axios.get<IGetAllResp<IAsset>>(`${prefix}`, { params });
    // Attemp to fetch blockchain data
    const listingsPartialInfo = await getListingsPartialInfo(data.results);
    data.results = listingsPartialInfo;
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getEntity = createAsyncThunk(`get-single-${prefix}`, async (id: number, thunkAPI) => {
  try {
    const { data } = await axios.get<IAsset>(`${prefix}/${id}`);
    return await getListingCompleteInfo(data);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// APIs calling blockchain
const getListingCompleteInfo = async (listing: IAsset): Promise<IAsset> => {
  try {
    const instance = LISTING_INSTANCE(listing.address);
    if (!instance) return listing;
    const promises = [
      instance.ownership(),
      instance.value(),
      instance.dailyPayment(),
      instance.owner(),
      instance.validator(),
      instance.totalStake(),
      instance.rewardPool(),
    ];

    const [ownership, value, dailyPayment, owner, validator, totalStake, rewardPool] = await Promise.all(
      Object.values(promises)
    );

    return {
      ...listing,
      ownership: ownership as BigNumber,
      value: value as BigNumber,
      dailyPayment: dailyPayment as BigNumber,
      owner: owner as string,
      validator: validator as string,
      totalStake: totalStake as BigNumber,
      rewardPool: rewardPool as BigNumber,
    };
  } catch (error) {
    console.log(`Error in fetching complete: ${error}`);
    return listing;
  }
};

const getListingsPartialInfo = async (listings: IAsset[]): Promise<IAsset[]> => {
  try {
    // Only value and dailyPayment is neccessary
    const valuePromises: Promise<BigNumber | undefined>[] = [];
    const paymentPromises: Promise<BigNumber | undefined>[] = [];

    for (let index = 0; index < listings.length; index++) {
      const { address } = listings[index];
      const instance = LISTING_INSTANCE(address);
      if ( instance ) {
        valuePromises.push(instance.value());
        paymentPromises.push(instance.dailyPayment());
      }
    }

    // Calling promises
    const listingValues = await Promise.all(valuePromises);
    const listingPayment = await Promise.all(paymentPromises);

    // Mapping new properties based on index
    // https://stackoverflow.com/questions/28066429/promise-all-order-of-resolved-values
    return listings.map((e, i) => ({
      ...e,
      value: listingValues[i],
      dailyPayment: listingPayment[i],
    }));
  } catch (error) {
    console.log(`Error in fetching partialInfo: ${error}`);
    return listings;
  }
};

export const extendOwnership = createAsyncThunk("extendOwnership", async (body: IExtndOwnershipBody, thunkAPI) => {
  const { contract, tokenAmount } = body;
  try {
    const tx = await contract.extendOwnership(tokenAmount);
    // await result.wait();
    return tx.hash;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error);
  }
});
 