import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./shared/baseApi";
import reducer from "./shared/reducers";

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(baseApi.middleware),
});

export default store;
