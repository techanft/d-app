import { combineReducers } from 'redux';
import assets from '../../views/assets/assets.reducer';
import records from '../../views/records/records.reducer';
import transactions from '../../views/transactions/transactions.reducer';
import wallet from '../../views/wallet/wallet.reducer';
import container from '../../containers/reducer'

const rootReducer = combineReducers({ records, wallet, assets, transactions, container });

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
