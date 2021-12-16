import { combineReducers } from "redux";
import assetsReducer from "../../views/assets/assets.reducer";
import blockEventsReducer from "../../views/blockEvents/blockEvents.reducer";
import listingsReducer from "../../views/listingInfo/listings.reducer";
import walletReducer from "../../views/walletInfo/wallet.reducer";
import { baseApi } from "../baseApi";

const rootReducer = combineReducers({
  walletReducer,
  assetsReducer,
  listingsReducer,
  blockEventsReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
