import { createAsyncThunk } from '@reduxjs/toolkit';
import { ethers } from 'ethers';
import { TOKEN_INSTANCE } from '../../shared/blockchain-helpers';

interface IContractSigner {
  contract: ethers.Contract;
  signer: ethers.providers.JsonRpcSigner;
}
interface ITransactionReceipt {
  provider: ethers.providers.Web3Provider;
  transactionHash: string;
}

export const getProviderLogin = createAsyncThunk(
  'getProviderLogin',
  async (provider: ethers.providers.Web3Provider, thunkAPI) => {
    try {
      await provider.send('eth_requestAccounts', []);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getSigner = createAsyncThunk('getSigner', async (provider: ethers.providers.Web3Provider, thunkAPI) => {
  try {
    const result = provider.getSigner();
    return result;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const getContractWithSigner = createAsyncThunk(
  'getContractWithSigner',
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

export const getAddress = createAsyncThunk('getAddress', async (signer: ethers.providers.JsonRpcSigner, thunkAPI) => {
  try {
    const result = await signer.getAddress();
    return result;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const getTokenBalance = createAsyncThunk('getTokenBalance', async (address: string, thunkAPI) => {
  const tokenContract = TOKEN_INSTANCE();
  if (!tokenContract) throw String('Error generating token contract');
  try {
    return await tokenContract.balanceOf(address);
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});
