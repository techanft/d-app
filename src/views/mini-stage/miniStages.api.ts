import { IParams } from './../../shared/models/base.model';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { pickBy } from 'lodash';
import { IMiniStage } from '../../shared/models/stage.model';
import axios from '../../config/axios-interceptor';
import { MANAGEMENT_SITE_URL } from '../../config/constants';

const prefix = 'external/stages';

export const getEntities = createAsyncThunk(`get-all-${prefix}-periods`, async (fields: IParams, thunkAPI) => {
  try {
    const params = pickBy(fields);
    return await axios.get<IMiniStage[]>(`${MANAGEMENT_SITE_URL}api/${prefix}/periods`, { params });
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getEntity = createAsyncThunk(`get-single-${prefix}-period`, async (id: string, thunkAPI) => {
  try {
    const { data } = await axios.get<IMiniStage>(`${MANAGEMENT_SITE_URL}api/${prefix}/${id}`);
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getCurrentEntity = createAsyncThunk(`get-current-${prefix}-period`, async (_, thunkAPI) => {
  try {
    const { data } = await axios.get<IMiniStage>(`${MANAGEMENT_SITE_URL}api/${prefix}/current-period`);
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
