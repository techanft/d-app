import { createAsyncThunk } from '@reduxjs/toolkit';
import { ethers } from 'ethers';
import { BLOCKCHAIN_NETWORK, _window } from '../../config/constants';
import { promptUserToSwitchChain, TOKEN_INSTANCE } from '../../shared/blockchain-helpers';

interface IContractSigner {
  contract: ethers.Contract;
  signer: ethers.providers.JsonRpcSigner;
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

const INVALID_NETWORK_ERR = 'Invalid network detected. Please go to Metamask and switch to BSC network to use the application';

export const getProvider = createAsyncThunk('getProvider', async (_, thunkAPI) => {
  try {
    if (!_window.ethereum) throw Error("Ethereum is not initialized. Please install an Ethereum wallet in your browser.");
    const provider = new ethers.providers.Web3Provider(_window.ethereum);
    const {chainId} = await provider.getNetwork();
    
    if (ethers.utils.hexlify(chainId) !== BLOCKCHAIN_NETWORK.chainId) {
      promptUserToSwitchChain();
      throw Error(INVALID_NETWORK_ERR)
    }

    return provider
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});