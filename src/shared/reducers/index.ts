import { combineReducers } from "redux";
import { splitApi } from "../../shared/splitApi";
import assetsReducer from "../../views/assets/assets.reducer";
import realEstateReducer from "../../views/realEstateInfo/realEstate.reducer";
import walletReducer from "../../views/walletInfo/wallet.reducer";
const rootReducer = combineReducers({
  walletReducer,
  assetsReducer,
  realEstateReducer,
  [splitApi.reducerPath]: splitApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
