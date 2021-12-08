import { combineReducers } from "redux";
import walletReducer from "../../views/walletInfo/wallet.reducer";
const rootReducer = combineReducers({
    walletReducer
})

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;