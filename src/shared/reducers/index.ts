import { combineReducers } from 'redux';
import container from '../../containers/reducer';
import assets from '../../views/assets/assets.reducer';
import category from '../../views/productType/category.reducer';
import records from '../../views/records/records.reducer';
import transactions from '../../views/transactions/transactions.reducer';
import wallet from '../../views/wallet/wallet.reducer';
import provinces from '../../views/provinces/provinces.reducer';
import authentication from '../../views/auth/auth.reducer'

const rootReducer = combineReducers({ records, wallet, assets, transactions, container, category, provinces, authentication });

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
