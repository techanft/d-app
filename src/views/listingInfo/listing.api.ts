import { createAsyncThunk } from "@reduxjs/toolkit";
import { ethers } from "ethers";
interface IExtendOwnership {
  contract: ethers.Contract;
  tokenAmount: ethers.BigNumber;
}

export const extendOwnership = createAsyncThunk("extendOwnership", async (body: IExtendOwnership, thunkAPI) => {
  const { contract, tokenAmount } = body;
  try {
    const result = await contract.extendOwnership(tokenAmount);
    await result.wait();
    return result.hash;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error);
  }
});
