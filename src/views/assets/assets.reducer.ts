import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { assetsApi } from "./assets.api";

interface IInitialState {
  assets: Array<any>;
  errorMessage: string;
}

const initialState: IInitialState = {
  assets: [],
  errorMessage: "",
};

// Config slice
export const assetsSlice = createSlice({
  name: "assetsApi",
  initialState,
  reducers: {
    reset: (state) => {
      state.assets = [];
      state.errorMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(assetsApi.endpoints.getAssets.matchFulfilled, (state, { payload }: PayloadAction<any>) => {
      state.assets = payload;
    });
    builder.addMatcher(assetsApi.endpoints.getAssets.matchRejected, (state, { payload }: PayloadAction<any>) => {
      state.errorMessage = payload?.message;
    });
  },
});

// Export actions
export const { reset } = assetsSlice.actions;

// Select state currentdummy from slice

// Export reducer
export default assetsSlice.reducer;
