import { createAsyncThunk } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { Listing } from "../../typechain";

export interface IExtndOwnrshpIntialValues {
  listingAddress: string | undefined;
  tokenAmount: number;
}
export interface IExtndOwnershipBody extends Omit<IExtndOwnrshpIntialValues, "tokenAmount"> {
  contract: Listing;
  tokenAmount: ethers.BigNumber;
}

export const extendOwnership = createAsyncThunk("extendOwnership", async (body: IExtndOwnershipBody, thunkAPI) => {
  const { contract, tokenAmount } = body;
  try {
    const result = await contract.extendOwnership(tokenAmount);
    await result.wait();
    return result.hash;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error);
  }
});
