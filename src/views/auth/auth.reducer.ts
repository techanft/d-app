import { IUser } from './../../shared/models/user.model';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { account, login, loginKeyCloak } from './auth.api';

interface IInitialLoginState {
  loading: boolean;
  errorMessage: string | null;
  user: IUser | null;
  loginSuccess: boolean;
  getAccountSuccess: boolean;
  token: string | null;
  loginModalVisible: boolean;
}

const initialState: IInitialLoginState = {
  loading: false,
  errorMessage: null,
  loginSuccess: false,
  getAccountSuccess: false,
  token: null,
  user: null,
  loginModalVisible: false,
};

const { actions, reducer } = createSlice({
  name: 'authenticationSlice',
  initialState,
  reducers: {
    fetching(state) {
      state.loading = true;
    },
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem('authentication_token');
    },
    storeToken: (state, { payload }: PayloadAction<string>) => {
      state.token = payload;
    },
    resetAll(state) {
      state.loading = false;
      state.loginSuccess = false;
      state.getAccountSuccess = false;
      state.token = null;
      state.user = null;
      state.errorMessage = null;
    },
    resetEntity(state) {
      state.getAccountSuccess = false;
      state.loginSuccess = false;
      state.loading = false;
      state.errorMessage = null;
    },
    setLoginModalVisible(state, { payload }: PayloadAction<boolean>) {
      state.loginModalVisible = payload;
    },
  },
  extraReducers: {
    [login.fulfilled.type]: (state, { payload }: PayloadAction<{ id_token: string }>) => {
      localStorage.setItem('authentication_token', payload.id_token);
      state.token = payload.id_token;
      state.loginSuccess = true;
      state.loading = false;
    },
    [login.rejected.type]: (state, { payload }: PayloadAction<any>) => {
      localStorage.removeItem('authentication_token');
      state.errorMessage = payload?.message;
      state.loading = false;
      state.loginSuccess = false;
    },
    [loginKeyCloak.fulfilled.type]: (state, { payload }: PayloadAction<{ id_token: string }>) => {
      localStorage.setItem('authentication_token', payload.id_token);
      state.token = payload.id_token;
      state.loginSuccess = true;
      state.loading = false;
    },
    [loginKeyCloak.rejected.type]: (state, { payload }: PayloadAction<any>) => {
      localStorage.removeItem('authentication_token');
      state.errorMessage = payload?.message;
      state.loading = false;
      state.loginSuccess = false;
    },
    [account.fulfilled.type]: (state, { payload }: PayloadAction<IUser>) => {
      state.user = payload;
      state.getAccountSuccess = true;
      state.errorMessage = null;
      state.loading = false;
    },
    [account.rejected.type]: (state, { payload }) => {
      localStorage.removeItem('authentication_token');
      state.getAccountSuccess = false;
      state.loading = false;
    },
  },
});

export const { fetching, resetAll, resetEntity, logout, storeToken, setLoginModalVisible } = actions;
export default reducer;
