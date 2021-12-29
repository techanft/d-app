import { createEntityAdapter, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IGetAllResp as BaseResponse } from '../../shared/models/base.model';
import {
  IRecord,
  IRecordClaim,
  IRecordOwnership,
  IRecordRegister,
  IRecordUnRegister,
  IRecordWithdraw,
  IRecordWorker
} from '../../shared/models/record.model';
import { RootState } from '../../shared/reducers';
import {
  getClaimsRecord,
  getOwnershipExtensionRecord,
  getRegisterRecord,
  getUnRegisterRecord,
  getWithdrawRecord,
  getWorkersRecord
} from './records.api';

interface IRecordLoadingAndError {
  errorMessage: null | string;
  loading: boolean;
  fetchSuccess: boolean;
}

interface IWorkerInitialState extends IRecordLoadingAndError {
  workers: BaseResponse<IRecordWorker> | undefined;
}

interface IOwnershipExtensionInitialState extends IRecordLoadingAndError {
  ownerships: BaseResponse<IRecordOwnership> | undefined;
}

interface IClaimInitialState extends IRecordLoadingAndError {
  claims: BaseResponse<IRecordClaim> | undefined;
}

interface IRegisterInitialState extends IRecordLoadingAndError {
  registers: BaseResponse<IRecordRegister> | undefined;
}

interface IUnRegisterInitialState extends IRecordLoadingAndError {
  unregisters: BaseResponse<IRecordUnRegister> | undefined;
}

interface IWithdrawInitialState extends IRecordLoadingAndError {
  withdraws: BaseResponse<IRecordWithdraw> | undefined;
}

interface IInitialState {
  workerInitialState: IWorkerInitialState;
  ownershipInitialState: IOwnershipExtensionInitialState;
  claimInitialState: IClaimInitialState;
  registerInitialState: IRegisterInitialState;
  unregisterInitialState: IUnRegisterInitialState;
  withdrawInitialState: IWithdrawInitialState;
}

const workerInitialState: IWorkerInitialState = {
  workers: undefined,
  loading: false,
  errorMessage: null,
  fetchSuccess: false,
};

const ownershipInitialState: IOwnershipExtensionInitialState = {
  ownerships: undefined,
  loading: false,
  errorMessage: null,
  fetchSuccess: false,
};

const claimInitialState: IClaimInitialState = {
  claims: undefined,
  loading: false,
  errorMessage: null,
  fetchSuccess: false,
};

const registerInitialState: IRegisterInitialState = {
  registers: undefined,
  loading: false,
  errorMessage: null,
  fetchSuccess: false,
};

const unregisterInitialState: IUnRegisterInitialState = {
  unregisters: undefined,
  loading: false,
  errorMessage: null,
  fetchSuccess: false,
};

const withdrawInitialState: IWithdrawInitialState = {
  withdraws: undefined,
  loading: false,
  errorMessage: null,
  fetchSuccess: false,
};

const initialState: IInitialState = {
  workerInitialState,
  ownershipInitialState,
  claimInitialState,
  registerInitialState,
  unregisterInitialState,
  withdrawInitialState,
};

export const recordsAdapter = createEntityAdapter<IRecord>({
  selectId: ({ id }) => id,
});

// Config slice
const { actions, reducer } = createSlice({
  name: 'records',
  initialState: recordsAdapter.getInitialState({ initialState }),
  reducers: {
    // Worker
    fetchingWorker({ initialState }) {
      initialState.workerInitialState.loading = true;
    },
    hardResetWorker({ initialState }) {
      initialState.workerInitialState.loading = false;
      initialState.workerInitialState.fetchSuccess = false;
      initialState.workerInitialState.workers = undefined;
      initialState.workerInitialState.errorMessage = null;
    },
    softResetWorker({ initialState }) {
      initialState.workerInitialState.fetchSuccess = false;
      initialState.workerInitialState.errorMessage = null;
      initialState.workerInitialState.loading = false;
    },
    // OwnershipExtension
    fetchingOwnership({ initialState }) {
      initialState.ownershipInitialState.loading = true;
    },
    hardResetOwnership({ initialState }) {
      initialState.ownershipInitialState.loading = false;
      initialState.ownershipInitialState.fetchSuccess = false;
      initialState.ownershipInitialState.ownerships = undefined;
      initialState.ownershipInitialState.errorMessage = null;
    },
    softResetOwnership({ initialState }) {
      initialState.ownershipInitialState.fetchSuccess = false;
      initialState.ownershipInitialState.errorMessage = null;
      initialState.ownershipInitialState.loading = false;
    },
    // Claims
    fetchingClaim({ initialState }) {
      initialState.claimInitialState.loading = true;
    },
    hardResetClaim({ initialState }) {
      initialState.claimInitialState.loading = false;
      initialState.claimInitialState.fetchSuccess = false;
      initialState.claimInitialState.claims = undefined;
      initialState.claimInitialState.errorMessage = null;
    },
    softResetClaim({ initialState }) {
      initialState.claimInitialState.fetchSuccess = false;
      initialState.claimInitialState.errorMessage = null;
      initialState.claimInitialState.loading = false;
    },
    // Register
    fetchingRegister({ initialState }) {
      initialState.registerInitialState.loading = true;
    },
    hardResetRegister({ initialState }) {
      initialState.registerInitialState.loading = false;
      initialState.registerInitialState.fetchSuccess = false;
      initialState.registerInitialState.registers = undefined;
      initialState.registerInitialState.errorMessage = null;
    },
    softResetRegister({ initialState }) {
      initialState.registerInitialState.fetchSuccess = false;
      initialState.registerInitialState.errorMessage = null;
      initialState.registerInitialState.loading = false;
    },
    // Unregister
    fetchinUnRegister({ initialState }) {
      initialState.unregisterInitialState.loading = true;
    },
    hardResetUnRegister({ initialState }) {
      initialState.unregisterInitialState.loading = false;
      initialState.unregisterInitialState.fetchSuccess = false;
      initialState.unregisterInitialState.unregisters = undefined;
      initialState.unregisterInitialState.errorMessage = null;
    },
    softResetUnRegister({ initialState }) {
      initialState.unregisterInitialState.fetchSuccess = false;
      initialState.unregisterInitialState.errorMessage = null;
      initialState.unregisterInitialState.loading = false;
    },
    // Withdraw
    fetchingWithdraw({ initialState }) {
      initialState.withdrawInitialState.loading = true;
    },
    hardResetWithdraw({ initialState }) {
      initialState.withdrawInitialState.loading = false;
      initialState.withdrawInitialState.fetchSuccess = false;
      initialState.withdrawInitialState.withdraws = undefined;
      initialState.withdrawInitialState.errorMessage = null;
    },
    softResetWithdraw({ initialState }) {
      initialState.withdrawInitialState.fetchSuccess = false;
      initialState.withdrawInitialState.errorMessage = null;
      initialState.withdrawInitialState.loading = false;
    },
  },
  extraReducers: {
    // Worker
    [getWorkersRecord.fulfilled.type]: ({ initialState }, { payload }: PayloadAction<BaseResponse<IRecordWorker>>) => {
      initialState.workerInitialState.loading = false;
      initialState.workerInitialState.fetchSuccess = true;
      initialState.workerInitialState.workers = payload;
      initialState.workerInitialState.errorMessage = null;
    },
    [getWorkersRecord.rejected.type]: ({ initialState }, { payload }: PayloadAction<any>) => {
      initialState.workerInitialState.loading = false;
      initialState.workerInitialState.fetchSuccess = false;
      initialState.workerInitialState.errorMessage = payload?.message;
    },
    // Ownership
    [getOwnershipExtensionRecord.fulfilled.type]: (
      { initialState },
      { payload }: PayloadAction<BaseResponse<IRecordOwnership>>
    ) => {
      initialState.ownershipInitialState.loading = false;
      initialState.ownershipInitialState.fetchSuccess = true;
      initialState.ownershipInitialState.ownerships = payload;
      initialState.ownershipInitialState.errorMessage = null;
    },
    [getOwnershipExtensionRecord.rejected.type]: ({ initialState }, { payload }: PayloadAction<any>) => {
      initialState.ownershipInitialState.loading = false;
      initialState.ownershipInitialState.fetchSuccess = false;
      initialState.ownershipInitialState.errorMessage = payload?.message;
    },
    // Claims
    [getClaimsRecord.fulfilled.type]: ({ initialState }, { payload }: PayloadAction<BaseResponse<IRecordClaim>>) => {
      initialState.claimInitialState.loading = false;
      initialState.claimInitialState.fetchSuccess = true;
      initialState.claimInitialState.claims = payload;
      initialState.claimInitialState.errorMessage = null;
    },
    [getClaimsRecord.rejected.type]: ({ initialState }, { payload }: PayloadAction<any>) => {
      initialState.claimInitialState.loading = false;
      initialState.claimInitialState.fetchSuccess = false;
      initialState.claimInitialState.errorMessage = payload?.message;
    },
    // Register
    [getRegisterRecord.fulfilled.type]: (
      { initialState },
      { payload }: PayloadAction<BaseResponse<IRecordRegister>>
    ) => {
      initialState.registerInitialState.loading = false;
      initialState.registerInitialState.fetchSuccess = true;
      initialState.registerInitialState.registers = payload;
      initialState.registerInitialState.errorMessage = null;
    },
    [getRegisterRecord.rejected.type]: ({ initialState }, { payload }: PayloadAction<any>) => {
      initialState.registerInitialState.loading = false;
      initialState.registerInitialState.fetchSuccess = false;
      initialState.registerInitialState.errorMessage = payload?.message;
    },
    // Unregister
    [getUnRegisterRecord.fulfilled.type]: (
      { initialState },
      { payload }: PayloadAction<BaseResponse<IRecordUnRegister>>
    ) => {
      initialState.unregisterInitialState.loading = false;
      initialState.unregisterInitialState.fetchSuccess = true;
      initialState.unregisterInitialState.unregisters = payload;
      initialState.unregisterInitialState.errorMessage = null;
    },
    [getUnRegisterRecord.rejected.type]: ({ initialState }, { payload }: PayloadAction<any>) => {
      initialState.unregisterInitialState.loading = false;
      initialState.unregisterInitialState.fetchSuccess = false;
      initialState.unregisterInitialState.errorMessage = payload?.message;
    },
    // Withdraw
    [getWithdrawRecord.fulfilled.type]: (
      { initialState },
      { payload }: PayloadAction<BaseResponse<IRecordWithdraw>>
    ) => {
      initialState.withdrawInitialState.loading = false;
      initialState.withdrawInitialState.fetchSuccess = true;
      initialState.withdrawInitialState.withdraws = payload;
      initialState.withdrawInitialState.errorMessage = null;
    },
    [getWithdrawRecord.rejected.type]: ({ initialState }, { payload }: PayloadAction<any>) => {
      initialState.withdrawInitialState.loading = false;
      initialState.withdrawInitialState.fetchSuccess = false;
      initialState.withdrawInitialState.errorMessage = payload?.message;
    },
  },
});

// Export actions
export default reducer;
export const {
  fetchingWorker,
  fetchingOwnership,
  fetchingClaim,
  fetchingRegister,
  fetchinUnRegister,
  fetchingWithdraw,
  hardResetWorker,
  hardResetOwnership,
  hardResetClaim,
  hardResetRegister,
  hardResetUnRegister,
  hardResetWithdraw,
  softResetWorker,
  softResetOwnership,
  softResetClaim,
  softResetRegister,
  softResetUnRegister,
  softResetWithdraw,
} = actions;

const { selectById } = recordsAdapter.getSelectors();

const getRecordState = (rootState: RootState) => rootState.records;

export const selectEntityById = (id: number) => {
  return createSelector(getRecordState, (state) => selectById(state, id));
};

export const recordsSelectors = recordsAdapter.getSelectors<RootState>((state) => state.records);
