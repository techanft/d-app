import { createAsyncThunk } from '@reduxjs/toolkit';
import { BigNumber, ContractTransaction, ethers, Bytes } from 'ethers';

import { EventType } from '../../enumeration/eventType';
import { Listing } from '../../typechain';
import { ICTransaction } from './transactions.reducer';
import axios from '../../config/axios-interceptor';
import { IEventRecord } from '../../shared/models/eventRecord.model';

interface ITxData {
  type: EventType;
  blockNumber: number;
  assetId: number;
}
const prefix = 'event-trackings';

export const recordTransaction = createAsyncThunk('recordTransaction', async (transaction: ICTransaction, thunkAPI) => {
  try {
    const { type, contractTransaction, listingId } = transaction;
    const txReceipt = await contractTransaction.wait();

    const txData: ITxData = {
      type,
      blockNumber: txReceipt.blockNumber,
      assetId: listingId
    }

    const {data} = await axios.post<IEventRecord>(`${prefix}`, txData);

    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error);
  }
});

interface ISharedBody {
  listingAddress: string | undefined;
  listingId: number;
}

export interface IExtndOwnrshpIntialValues extends ISharedBody {
  tokenAmount: number;
}


export interface IExtndOwnershipBody extends Omit<IExtndOwnrshpIntialValues, 'tokenAmount'> {
  contract: Listing;
  tokenAmount: ethers.BigNumber;
  type: EventType
}


const TX_ACTION = 'proceedTransaction'; // Intentionally use a common async thunk, so we can handle multiple apis response in one case reducer logic
export const extendOwnership = createAsyncThunk(TX_ACTION, async (body: IExtndOwnershipBody, thunkAPI) => {
  const { contract, tokenAmount, listingId } = body;
  try {
    const result = await contract.extendOwnership(tokenAmount);

    const payload: ICTransaction = {
      contractTransaction: result,
      type: EventType.OWNERSHIP_EXTENSION,
      listingId
    };
    return payload;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error);
  }
});


interface IRegisterIntialValues extends ISharedBody {
  tokenAmount: number,
  optionId: number,
  increase: true,
}
export interface IRegisterBody extends Omit<IRegisterIntialValues, 'tokenAmount'> {
  contract: Listing;
  tokenAmount: ethers.BigNumber;
  type: EventType
}
export const register = createAsyncThunk(TX_ACTION, async (body: IRegisterBody, thunkAPI) => {
  const { contract, tokenAmount, listingId, optionId, increase } = body;

  try {
    const result = await contract.register(tokenAmount, optionId, increase );
    const payload: ICTransaction = {
      contractTransaction: result,
      type: EventType.REGISTER,
      listingId
    };
    return payload;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error);
  }
});

