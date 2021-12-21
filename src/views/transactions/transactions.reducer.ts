import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ethers } from 'ethers';
import { EventType } from '../../shared/enumeration/eventType';
import { IEventRecord } from '../../shared/models/eventRecord.model';
import { deleteExistedTransaction, disableWorkerOwnership, proceedTransaction, recordTransaction } from './transactions.api';

export interface ICTransaction {
  contractTransaction: ethers.ContractTransaction;
  type: EventType;
  listingId: number;
}

export interface IDeleteTransaction {
  contractTransaction: ethers.ContractTransaction;
  type: EventType;
  eventId: number;
}

interface ITxInitialState {
  transactionDel: IDeleteTransaction | undefined;
  transaction: ICTransaction | undefined;
  loading: boolean;
  deleteSubmitted:boolean;
  submitted: boolean;
  success: boolean;
  deleteSuccess:boolean;
  errorMessage: string | undefined;
}

const initialState: ITxInitialState = {
  transactionDel:undefined,
  transaction: undefined,
  submitted: false,
  deleteSubmitted:false,
  loading: false,
  success: false,
  deleteSuccess:false,
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
      state.transaction = undefined;
      state.transactionDel = undefined;
      state.submitted = false;
      state.deleteSubmitted = false;
      state.loading = false;
      state.success = false;
      state.deleteSuccess =false;
      state.errorMessage = undefined;
    },
    softReset(state) {
      state.submitted = false;
      state.deleteSubmitted = false;
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
    [disableWorkerOwnership.fulfilled.type]: (state, { payload }: PayloadAction<IDeleteTransaction>) => {
      state.transactionDel = payload;
      state.loading = false;
      state.deleteSubmitted = true;
    },
    [disableWorkerOwnership.rejected.type]: (state, { payload }) => {
      state.errorMessage = payload;
      state.loading = false;
    },


    [recordTransaction.fulfilled.type]: (state, _: PayloadAction<IEventRecord>) => {
      state.success = true;
      state.loading = false;
    },
    [recordTransaction.rejected.type]: (state, { payload }) => {
      state.errorMessage = payload;
      state.loading = false;
    },
    [deleteExistedTransaction.fulfilled.type]: (state, _: PayloadAction<IEventRecord>) => {
      state.deleteSuccess = true;
      state.loading = false;
    },
    [deleteExistedTransaction.rejected.type]: (state, { payload }) => {
      state.errorMessage = payload;
      state.loading = false;
    },
  },
});

export default reducer;
export const { fetching, hardReset, softReset } = actions;
