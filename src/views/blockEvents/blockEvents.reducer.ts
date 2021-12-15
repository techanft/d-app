import { createEntityAdapter, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IBlockEvent } from "../../shared/models/blockEvents.model";
import { blockEventsApi, IGetBlockEvent } from "./blockEvents.api";

interface IInitialState {
  blockEvents: IBlockEvent[];
  blockEvent: IBlockEvent | null;
  createBlockEventSuccess: boolean;
  errorMessage: string;
  loading: boolean;
  totalItems: number;
}

const initialState: IInitialState = {
  blockEvents: [],
  blockEvent: null,
  createBlockEventSuccess: false,
  errorMessage: "",
  loading: false,
  totalItems: 0,
};

export const exchangeRateAdapter = createEntityAdapter<any>({
  selectId: ({ id }) => id,
});

// Config slice
const { actions, reducer } = createSlice({
  name: "blockEventsApi",
  initialState,
  reducers: {
    fetching(state) {
      state.loading = true;
    },
    reset: (state) => {
      state.createBlockEventSuccess = false;
      state.blockEvents = [];
      state.blockEvent = null;
      state.loading = false;
      state.errorMessage = "";
      state.totalItems = 0;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(blockEventsApi.endpoints.getBlockEvents.matchFulfilled, (state, { payload }: PayloadAction<IGetBlockEvent>) => {
      state.blockEvents = payload.results;
      state.loading = false;
      state.totalItems = payload.count;
    });
    builder.addMatcher(blockEventsApi.endpoints.getBlockEvents.matchRejected, (state, { payload }: PayloadAction<any>) => {
      state.errorMessage = payload?.message;
      state.loading = false;
    });
    builder.addMatcher(blockEventsApi.endpoints.getBlockEvent.matchFulfilled, (state, { payload }: PayloadAction<IBlockEvent>) => {
      state.blockEvent = payload;
      state.loading = false;
    });
    builder.addMatcher(blockEventsApi.endpoints.getBlockEvent.matchRejected, (state, { payload }: PayloadAction<any>) => {
      state.errorMessage = payload?.message;
      state.loading = false;
    });
    builder.addMatcher(blockEventsApi.endpoints.createBlockEvent.matchFulfilled, (state, { payload }: PayloadAction<IBlockEvent>) => {
      state.createBlockEventSuccess = true;
      state.loading = false;
    });
    builder.addMatcher(blockEventsApi.endpoints.createBlockEvent.matchRejected, (state, { payload }: PayloadAction<any>) => {
      state.errorMessage = payload?.message;
      state.createBlockEventSuccess = false;
      state.loading = false;
    });
  },
});

// Export actions
export const { reset } = actions;

// Select state currentdummy from slice

// Export reducer
export default reducer;
