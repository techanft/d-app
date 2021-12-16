import { combineReducers } from "redux";
import { splitApi } from "../../shared/splitApi";
import assetsReducer from "../../views/assets/assets.reducer";
import blockEventsReducer from "../../views/blockEvents/blockEvents.reducer";
import listingsReducer from "../../views/listingInfo/listings.reducer";
import walletReducer from "../../views/walletInfo/wallet.reducer";

const rootReducer = combineReducers({
  walletReducer,
  assetsReducer,
  listingsReducer,
  blockEventsReducer,
  [splitApi.reducerPath]: splitApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
