import { configureStore } from "@reduxjs/toolkit";
import reducer from "./shared/reducers";


const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;