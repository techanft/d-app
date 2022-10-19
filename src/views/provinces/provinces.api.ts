import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { pickBy } from 'lodash';
import { MANAGEMENT_SITE_URL } from '../../config/constants';
import { IDistrictsAddress, IProvincesAddress, IWardsAddress } from '../../shared/models/provinces.model';

const provinces = 'address/provinces';
const districts = 'address/districts';
const wards = 'address/wards';

export const getProvincesEntites = createAsyncThunk(`get-${provinces}`, async (field: { country: 'VN' }, thunkAPI) => {
  try {
    const params = pickBy(field);
    const result = await axios.get<IProvincesAddress[]>(`${MANAGEMENT_SITE_URL}api/${provinces}`, { params });
    return result;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getDistrictsEntites = createAsyncThunk(
  `get-${districts}`,
  async (field: { province: string }, thunkAPI) => {
    try {
      const params = pickBy(field);
      const result = await axios.get<IDistrictsAddress[]>(`${MANAGEMENT_SITE_URL}api/${districts}`, { params });
      return result;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getWardsEntites = createAsyncThunk(`get-${wards}`, async (field: { district: string }, thunkAPI) => {
  try {
    const params = pickBy(field);
    const result = await axios.get<IWardsAddress[]>(`${MANAGEMENT_SITE_URL}api/${wards}`, { params });
    return result;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
