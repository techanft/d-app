import { combineReducers } from "redux";
import assets from "../../views/assets/assets.reducer";
import blockEventsReducer from "../../views/blockEvents/blockEvents.reducer";
import walletReducer from "../../views/walletInfo/wallet.reducer";
import transactions from "../../views/transactions/transactions.reducer";
import { baseApi } from "../baseApi";

const rootReducer = combineReducers({
  walletReducer,
  assets,
  blockEventsReducer,
  transactions,
  [baseApi.reducerPath]: baseApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
