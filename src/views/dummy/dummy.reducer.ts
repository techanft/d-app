import { createSlice } from "@reduxjs/toolkit";
import { api } from "./dummy.api";

interface IInitialState {
  assets: Array<any>;
  errorMessage: string;
}

const initialState: IInitialState = {
  assets: [],
  errorMessage: "",
};

// Config slice
export const dummySlice = createSlice({
  name: "dummy",
  initialState,
  reducers: {
    reset: (state) => {
      state.assets = [];
      state.errorMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(api.endpoints.getAssets.matchFulfilled, (state, action) => {
      state.assets = action.payload;
    });
  },
});

// Export actions
export const { reset } = dummySlice.actions;

// Select state currentdummy from slice

// Export reducer
export default dummySlice.reducer;
