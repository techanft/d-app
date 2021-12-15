import { createEntityAdapter, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAsset } from "../../shared/models/assets.model";
import { assetsApi, IGetAssets } from "./assets.api";

interface IInitialState {
  assets: IAsset[];
  asset: IAsset | null;
  errorMessage: string;
  loading: boolean;
  totalItems: number;
}

const initialState: IInitialState = {
  assets: [],
  asset: null,
  errorMessage: "",
  loading: false,
  totalItems: 0,
};

export const exchangeRateAdapter = createEntityAdapter<any>({
    selectId: ({ id }) => id,
  });

// Config slice
const { actions, reducer } = createSlice({
  name: "assetsApi",
  initialState,
  reducers: {
    fetching(state) {
      state.loading = true;
    },
    reset: (state) => {
      state.assets = [];
      state.asset = null;
      state.loading = false;
      state.errorMessage = "";
      state.totalItems = 0;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(assetsApi.endpoints.getAssets.matchFulfilled, (state, { payload }: PayloadAction<IGetAssets>) => {
      state.assets = payload.results;
      state.loading = false;
      state.totalItems = payload.count;
    });
    builder.addMatcher(assetsApi.endpoints.getAssets.matchRejected, (state, { payload }: PayloadAction<any>) => {
      state.errorMessage = payload?.message;
      state.loading = false;
    });
    builder.addMatcher(assetsApi.endpoints.getAsset.matchFulfilled, (state, { payload }: PayloadAction<IAsset>) => {
      state.asset = payload;
      state.loading = false;
    });
    builder.addMatcher(assetsApi.endpoints.getAsset.matchRejected, (state, { payload }: PayloadAction<any>) => {
      state.errorMessage = payload?.message;
      state.loading = false;
    });
  
  },
});

// Export actions
export const { reset } = actions;

// Select state currentdummy from slice

// Export reducer
export default reducer;

