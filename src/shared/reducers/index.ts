import { combineReducers } from "redux";
import assets from "../../views/assets/assets.reducer";
import wallet from "../../views/wallet/wallet.reducer";
import transactions from "../../views/transactions/transactions.reducer";

const rootReducer = combineReducers({
  wallet,
  assets,
  transactions
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
