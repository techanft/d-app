import { configureStore } from "@reduxjs/toolkit";
import reducer from "./shared/reducers";
import { api } from "./views/dummy/dummy.api";

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(api.middleware),
});

export default store;
