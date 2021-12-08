import { createAsyncThunk } from "@reduxjs/toolkit";
import { ethers } from "ethers";

interface IContractSigner {
  contract: ethers.Contract;
  signer: ethers.providers.JsonRpcSigner;
}
interface ITransactionReceipt {
  provider: ethers.providers.Web3Provider;
  transactionHash: string;
}

/**
 * Returns a string of form "abc...xyz"
 * @param {string} str string to string
 * @param {number} n number of chars to keep at front/end
 * @returns {string}
 */
export const getEllipsisTxt = (str: string, n = 6) => {
  if (str) {
    return `${str.slice(0, n)}...${str.slice(str.length - n)}`;
  }
  return "";
};

export const getProviderLogin = createAsyncThunk(
  "getProviderLogin",
  async (provider: ethers.providers.Web3Provider, thunkAPI) => {
    try {
      await provider.send("eth_requestAccounts", []);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getSigner = createAsyncThunk("getSigner", async (provider: ethers.providers.Web3Provider, thunkAPI) => {
  try {
    const result = provider.getSigner();
    return result;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const getContractWithSigner = createAsyncThunk(
  "getContractWithSigner",
  async (body: IContractSigner, thunkAPI) => {
    const { contract, signer } = body;
    try {
      const result = await contract.connect(signer);
      return result;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAddress = createAsyncThunk("getAddress", async (signer: ethers.providers.JsonRpcSigner, thunkAPI) => {
  try {
    const result = await signer.getAddress();
    return result;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const getTransactionReceipt = createAsyncThunk(
  "getTransactionReceipt",
  async (body: ITransactionReceipt, thunkAPI) => {
    const { provider, transactionHash } = body;
    try {
      const receipt = await provider.getTransactionReceipt(transactionHash);
      return receipt;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
