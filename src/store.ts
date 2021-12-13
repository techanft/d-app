import { configureStore } from "@reduxjs/toolkit";
import reducer from "./shared/reducers";
import { splitApi } from "./shared/splitApi";

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(splitApi.middleware),
});

export default store;
