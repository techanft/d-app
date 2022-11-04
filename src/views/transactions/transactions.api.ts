import { createAsyncThunk } from '@reduxjs/toolkit';
import { pickBy } from 'lodash';
import { EventType } from '../../shared/enumeration/eventType';
import { MessageType } from '../../shared/enumeration/messageType';
import { Listing,  Validation} from '../../typechain';
import { settersMapping, TBaseSetterArguments } from './settersMapping';
import { ICTransaction } from './transactions.reducer';

// Remove this since recording is obsolete
export const awaitTransaction = createAsyncThunk('awaitTransaction', async (transaction: ICTransaction, thunkAPI) => {
  try {
    const { contractTransaction } = transaction;
    const txReceipt = await contractTransaction.wait();
    return txReceipt;
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

    // eslint-disable-next-line no-throw-literal
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

export interface IUpdatePriceTransaction {
  instance: Validation;
  type: MessageType;
  sellPrice?: number;
  rentPrice?: number;
  otp?: string;
  userId?: string;
  listingId?: string;
}

export const updatePriceTransaction = createAsyncThunk('update-price-transaction', async (body: IUpdatePriceTransaction, thunkAPI) => {
  const { instance, ...rest } = body;
  try {
    const tx = await instance.sendMessage(JSON.stringify(pickBy(rest)));
    return await tx.wait(1);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error);
  }
});
