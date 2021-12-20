import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { getAddress, getContractWithSigner, getProviderLogin, getSigner, getTransactionReceipt } from "./wallet.api";

interface IAuthenticationState {
  transactionReceipt:ethers.providers.TransactionReceipt|null;
  getTransactionRecepitSuccess:boolean;
  signerAddress: string | undefined;
  getSignerAddressSuccess: boolean;
  contractWithSigner: ethers.Contract | null;
  getContractWithSignerSuccess: boolean;
  signer: ethers.providers.JsonRpcSigner | null;
  getSignerSuccess: boolean;
  getProviderLoginSuccess: boolean;
  loading: boolean;
  user: any | null;
  token: string | null;
  errorMessage: string | null;
}

const initialState: IAuthenticationState = {
  transactionReceipt:null,
  getTransactionRecepitSuccess:false,
  signerAddress: undefined,
  getSignerAddressSuccess: false,
  contractWithSigner: null,
  getContractWithSignerSuccess: false,
  signer: null,
  getSignerSuccess: false,
  getProviderLoginSuccess: false,
  loading: false,
  user: null,
  token: null,
  errorMessage: null,
};

// export type IAuthentication = Readonly<typeof initialState>;

const walletSlice = createSlice({
  name: "walletSlice",
  initialState,
  reducers: {
    fetching(state) {
      state.loading = true;
    },
    reset(state) {
      state.signerAddress = "";
      state.getSignerAddressSuccess = false;
      state.contractWithSigner = null;
      state.getContractWithSignerSuccess = false;
      state.signer = null;
      state.getSignerSuccess = false;
      state.getProviderLoginSuccess = false;
      state.loading = false;
      state.user = null;
      state.token = null;
      state.errorMessage = null;
    },
    softReset(state) {
      state.getSignerAddressSuccess = false;
      state.getContractWithSignerSuccess = false;
      state.getSignerSuccess = false;
      state.getProviderLoginSuccess = false;
      state.loading = false;
      state.errorMessage = null;
    },
  },
  extraReducers: {
    [getProviderLogin.fulfilled.type]: (state, { payload }: PayloadAction<string>) => {
      state.getProviderLoginSuccess = true;
      state.errorMessage = null;
      state.loading = false;
    },
    [getProviderLogin.rejected.type]: (state, { payload }) => {
      state.getProviderLoginSuccess = false;
      state.errorMessage = payload;
      state.loading = false;
    },
    [getSigner.fulfilled.type]: (state, { payload }: PayloadAction<ethers.providers.JsonRpcSigner>) => {
      state.signer = payload;
      state.getSignerSuccess = true;
      state.errorMessage = null;
      state.loading = false;
    },
    [getSigner.rejected.type]: (state, { payload }) => {
      state.getSignerSuccess = false;
      state.errorMessage = payload;
      state.loading = false;
    },
    [getContractWithSigner.fulfilled.type]: (state, { payload }: ethers.Contract) => {
      state.contractWithSigner = payload;
      state.getContractWithSignerSuccess = true;
      state.errorMessage = null;
      state.loading = false;
    },
    [getContractWithSigner.rejected.type]: (state, { payload }) => {
      state.getContractWithSignerSuccess = false;
      state.errorMessage = payload;
      state.loading = false;
    },
    [getAddress.fulfilled.type]: (state, { payload }: PayloadAction<string>) => {
      state.signerAddress = payload;
      state.getSignerAddressSuccess = true;
      state.errorMessage = null;
      state.loading = false;
    },
    [getAddress.rejected.type]: (state, { payload }) => {
      state.getSignerAddressSuccess = false;
      state.errorMessage = payload;
      state.loading = false;
    },
    [getTransactionReceipt.fulfilled.type]: (state, { payload }: PayloadAction<ethers.providers.TransactionReceipt>) => {
      state.transactionReceipt = payload;
      state.getTransactionRecepitSuccess = true;
      state.errorMessage = null;
      state.loading = false;
    },
    [getTransactionReceipt.rejected.type]: (state, { payload }) => {
      state.getTransactionRecepitSuccess = false;
      state.errorMessage = payload;
      state.loading = false;
    },
  },
});

export default walletSlice.reducer;
export const { fetching, reset, softReset } = walletSlice.actions;