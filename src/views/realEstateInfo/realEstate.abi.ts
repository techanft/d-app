import { createAsyncThunk } from "@reduxjs/toolkit";
import { ethers } from "ethers";

// Tên file abi => api
interface IExtendOwnerShip {
  contract: ethers.Contract;
  tokenAmount: ethers.BigNumber;
}

export const extendOwnerShip = createAsyncThunk("createListing", async (body: IExtendOwnerShip, thunkAPI) => {
  const { contract, tokenAmount } = body;
  try {
    const result = await contract.extendOwnership(tokenAmount);
    await result.wait();
    return result.hash;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error);
  }
});
