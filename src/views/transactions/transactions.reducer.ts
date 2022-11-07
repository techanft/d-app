import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContractReceipt, ethers } from 'ethers';
import { EventType } from '../../shared/enumeration/eventType';
import { awaitTransaction, proceedTransaction, updatePriceTransaction } from './transactions.api';

export interface ICTransaction {
  contractTransaction: ethers.ContractTransaction;
  type: EventType;
  listingId: number;
}

export interface IUpdateBusinessPrice {
  sellPrice: number | undefined;
  rentPrice: number | undefined;
  listingId: string;
}

interface ITxInitialState {
  transaction: ICTransaction | undefined;
  loading: boolean;
  submitted: boolean;
  success: boolean;  
  errorMessage: string | undefined;
  updateBusinessPriceSuccess: boolean
  businessPrice: IUpdateBusinessPrice | null;
}

const initialState: ITxInitialState = {
  transaction: undefined,
  submitted: false,
  loading: false,
  success: false,
  errorMessage: undefined,
  updateBusinessPriceSuccess: false,
  businessPrice: null
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
      state.submitted = false;
      state.loading = false;
      state.success = false;
      state.errorMessage = undefined;
    },
    softReset(state) {
      state.submitted = false;
      state.loading = false;
      state.errorMessage = undefined;
      state.updateBusinessPriceSuccess = false;
      state.businessPrice = null;
    },
    storeBusinessPrice(state, { payload }: PayloadAction<IUpdateBusinessPrice>) {
      state.businessPrice = payload;
    },
  },
  extraReducers: {
    [proceedTransaction.fulfilled.type]: (state, { payload }: PayloadAction<ICTransaction>) => {
      state.transaction = payload;
      state.loading = false;
      state.submitted = true;
    },
    [proceedTransaction.rejected.type]: (state, { payload }) => {
      state.errorMessage = payload?.message;
      state.loading = false;
    },

    [awaitTransaction.fulfilled.type]: (state, _: PayloadAction<ContractReceipt>) => {
      state.success = true;
      state.loading = false;
    },
    [awaitTransaction.rejected.type]: (state, { payload }) => {
      state.errorMessage = payload?.message;
      state.loading = false;
    },

    [updatePriceTransaction.fulfilled.type]: (state, { payload }: PayloadAction<ICTransaction>) => {
      state.loading = false;
      state.updateBusinessPriceSuccess = true;
    },
    [updatePriceTransaction.rejected.type]: (state, { payload }) => {
      state.errorMessage = payload?.message;
      state.loading = false;
    },
  },
});

export default reducer;
export const { fetching, hardReset, softReset, storeBusinessPrice } = actions;
