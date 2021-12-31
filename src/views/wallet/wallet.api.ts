import { createAsyncThunk } from '@reduxjs/toolkit';
import { ethers, providers } from 'ethers';
import { _window } from '../../config/constants';
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

export const getTransactionReceipt = createAsyncThunk(
  'getTransactionReceipt',
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

interface IGetTokenBalance {
  address: string,
  provider: ethers.providers.Web3Provider
}
export const getTokenBalance = createAsyncThunk('getTokenBalance', async ({address, provider}: IGetTokenBalance, thunkAPI) => {
  const tokenContract = TOKEN_INSTANCE({provider, signer: undefined});
  try {
    if (!tokenContract) throw Error('Error generating token contract');
    return await tokenContract.balanceOf(address);
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const getProvider = createAsyncThunk('getProvider', async (_, thunkAPI) => {
  try {
    if (!_window.ethereum) throw Error("Ethereum is not initialized. Please install an Ethereum wallet in your browser.");
    const provider = new ethers.providers.Web3Provider(_window.ethereum);
    // For some reasons {provider._network} is undefined here (but avaiable in UI/tsx files)
    // So we have to perform network checking/switching in UI.
    return provider
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});