import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axios-interceptor';
import { EventType } from '../../shared/enumeration/eventType';
import { IEventRecord } from '../../shared/models/eventRecord.model';
import { Listing } from '../../typechain';
import { prefix as eventEndpoint } from '../events/events.api';
import { settersMapping, TBaseSetterArguments } from './settersMapping';
import { ICTransaction } from './transactions.reducer';

interface ITxData {
  eventType: EventType;
  block: number;
  assetId: number;
}

export const recordTransaction = createAsyncThunk('recordTransaction', async (transaction: ICTransaction, thunkAPI) => {
  try {
    const { type, contractTransaction, listingId } = transaction;
    const txReceipt = await contractTransaction.wait();

    const txData: ITxData = {
      eventType: type,
      block: txReceipt.blockNumber,
      assetId: listingId,
    };

    // Consider moving this to events module logic later.
    const { data } = await axios.post<IEventRecord>(`${eventEndpoint}`, txData);

    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export interface IProceedTxBody {
  listingId: number;
  contract: Listing;
  type: EventType;
  args: TBaseSetterArguments;
}

export const proceedTransaction = createAsyncThunk('proceedTransaction', async (body: IProceedTxBody, thunkAPI) => {
  const { contract, listingId, args, type } = body;
  try {
    const setter = settersMapping(contract, type, args);

    if (setter === null) throw 'Insufficient arguments causing contract setter can not be generated';

    const result = await setter();

    const payload: ICTransaction = {
      contractTransaction: result,
      type,
      listingId,
    };
    return payload;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error);
  }
});
