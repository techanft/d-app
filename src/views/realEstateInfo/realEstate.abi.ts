import { createAsyncThunk } from "@reduxjs/toolkit";
import { ethers } from "ethers";

interface IExtendOwnerShip {
    contract: ethers.Contract;
    tokenNumber: number;
  }
  
  export const extendOwnerShip = createAsyncThunk("createListing", async (body: IExtendOwnerShip, thunkAPI) => {
    const { contract, tokenNumber } = body;
    try {
      const result = await contract.extendOwnership(tokenNumber);
      await result.wait();
      console.log(result);
      return result.hash;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  });