import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ethers } from 'ethers';
import { EventType } from '../../shared/enumeration/eventType';
import { IEventRecord } from '../../shared/models/eventRecord.model';
import { proceedTransaction, recordTransaction } from './transactions.api';

export interface ICTransaction {
  contractTransaction: ethers.ContractTransaction;
  type: EventType;
  listingId: number;
}


interface ITxInitialState {
  eventRecord: IEventRecord | undefined
  transaction: ICTransaction | undefined;
  loading: boolean;
  submitted: boolean;
  success: boolean;  
  errorMessage: string | undefined;
}

const initialState: ITxInitialState = {
  eventRecord:undefined,
  transaction: undefined,
  submitted: false,
  loading: false,
  success: false,
  errorMessage: undefined,
};

// export type IAuthentication = Readonly<typeof initialState>;

const { actions, reducer } = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    fetching(state) {
      state.loading = true;
    },
    hardReset(state) {
      state.eventRecord = undefined;
      state.transaction = undefined;
      state.submitted = false;
      state.loading = false;
      state.success = false;
      state.errorMessage = undefined;
    },
    softReset(state) {
      state.submitted = false;
      state.loading = false;
      state.errorMessage = undefined;
    },
  },
  extraReducers: {
    [proceedTransaction.fulfilled.type]: (state, { payload }: PayloadAction<ICTransaction>) => {
      state.transaction = payload;
      state.loading = false;
      state.submitted = true;
    },
    [proceedTransaction.rejected.type]: (state, { payload }) => {
      state.errorMessage = payload;
      state.loading = false;
    },

    [recordTransaction.fulfilled.type]: (state, {payload}: PayloadAction<IEventRecord>) => {
      state.eventRecord = payload
      state.success = true;
      state.loading = false;
    },
    [recordTransaction.rejected.type]: (state, { payload }) => {
      state.errorMessage = payload;
      state.loading = false;
    },

   
  },
});

export default reducer;
export const { fetching, hardReset, softReset } = actions;
