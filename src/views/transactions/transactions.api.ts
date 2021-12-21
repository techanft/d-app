import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axios-interceptor';
import { EventType } from '../../shared/enumeration/eventType';
import { IEventRecord } from '../../shared/models/eventRecord.model';
import { Listing } from '../../typechain';
import { settersMapping, TBaseSetterArguments } from './settersMapping';
import { ICTransaction, IDeleteTransaction } from './transactions.reducer';

interface ITxData {
  eventType: EventType;
  block: number;
  assetId: number;
}
const prefix = 'event-trackings';

export const recordTransaction = createAsyncThunk('recordTransaction', async (transaction: ICTransaction, thunkAPI) => {
  try {
    const { type, contractTransaction, listingId } = transaction;
    const txReceipt = await contractTransaction.wait();

    const txData: ITxData = {
      eventType: type,
      block: txReceipt.blockNumber,
      assetId: listingId,
    };

    const { data } = await axios.post<IEventRecord>(`${prefix}`, txData);

    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const deleteExistedTransaction = createAsyncThunk('deleteExistedTransaction', async (transaction: IDeleteTransaction, thunkAPI) => {
  try {
    const { eventId,contractTransaction } = transaction;
    await contractTransaction.wait();
    const { data } = await axios.delete<IEventRecord>(`${prefix}/${eventId}`);
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error);
  }
});

export interface IProceedTxBody {
  listingId: number;
  contract: Listing;
  type: EventType;
  args: TBaseSetterArguments
}

export const proceedTransaction = createAsyncThunk('proceedTransaction', async (body: IProceedTxBody, thunkAPI) => {
  const { contract, listingId, args, type } = body;
  try {
    const setter = settersMapping(contract, type, args);

    if (setter === null) throw ("Insufficient arguments causing contract setter can not be generated");
  
    const result = await setter();

    const payload: ICTransaction = {
      contractTransaction: result,
      type,
      listingId
    };
    return payload;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error);
  }
});

export interface IDisableWorkerIntialValues  {
  address: string;
  eventId:number
}

export interface IDisableWorkerBody extends Omit<IDisableWorkerIntialValues, 'tokenAmount'> {
  contract: Listing;
  address: string;
  type: EventType;
  eventId:number
}

export const disableWorkerOwnership = createAsyncThunk("disableWorker", async (body: IDisableWorkerBody, thunkAPI) => {
  const { contract, address, eventId } = body;
  try {
    const result = await contract.updateWorker(address);

    const payload: IDeleteTransaction = {
      contractTransaction: result,
      type: EventType.UPDATE_WORKER,
      eventId,
    };
    return payload;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error);
  }
});
