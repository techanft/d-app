import { combineReducers } from "redux";
import { api } from "../../views/dummy/dummy.api";
import dummyReducer from "../../views/dummy/dummy.reducer";
import walletReducer from "../../views/walletInfo/wallet.reducer";
const rootReducer = combineReducers({
  walletReducer,
  dummyReducer,
  [api.reducerPath]: api.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
