import { createAsyncThunk } from '@reduxjs/toolkit';
import { pickBy } from 'lodash';
import remAxios from '../../config/rem-axios-interceptor';
import { MANAGEMENT_SITE_URL } from '../../config/constants';

export interface ILoginForm {
  username: string;
  password: string;
  rememberMe: boolean;
}

export const login = createAsyncThunk(`authenticate`, async (body: ILoginForm, thunkAPI) => {
  try {
    const { data } = await remAxios.post(`${MANAGEMENT_SITE_URL}api/authenticate`, pickBy(body));
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const loginKeyCloak = createAsyncThunk(`authenticate-keycloak`, async (body: ILoginForm, thunkAPI) => {
  try {
    const { data } = await remAxios.post(`${MANAGEMENT_SITE_URL}api/sso/anft`, pickBy(body));
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const account = createAsyncThunk(`account`, async (_, thunkAPI) => {
  try {
    const { data } = await remAxios.get(`${MANAGEMENT_SITE_URL}api/account`);
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
