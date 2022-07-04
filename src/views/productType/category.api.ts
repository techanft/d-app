import { createAsyncThunk } from '@reduxjs/toolkit';
import { pickBy } from 'lodash';
import axios from '../../config/axios-interceptor';
import { MANAGEMENT_SITE_URL } from '../../config/constants';
import { IParams } from '../../shared/models/base.model';
import { CategoryType, IListingType, INewListingType } from '../../shared/models/listingType.model';

export interface IListingTypeFilter extends IParams {
  parent: CategoryType;
}

const prefix = 'listing-types';

export const getEntities = createAsyncThunk(
  `get-all-${prefix}`,
  async (fields: IListingTypeFilter | undefined, thunkAPI) => {
    try {
      const params = pickBy(fields);
      return await axios.get<IListingType[]>(`${MANAGEMENT_SITE_URL}api/${prefix}`, { params });
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getEntity = createAsyncThunk(`get-single-${prefix}`, async (id: string, thunkAPI) => {
  try {
    const { data } = await axios.get<IListingType>(`${MANAGEMENT_SITE_URL}api/${prefix}/${id}`);
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const updateEntity = createAsyncThunk(`update-one-${prefix}`, async (body: IListingType, thunkAPI) => {
  try {
    const { id } = body;
    const { data } = await axios.put<IListingType>(`${MANAGEMENT_SITE_URL}api/${prefix}/${id}`, body);
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const createEntity = createAsyncThunk(`create-one-${prefix}`, async (body: INewListingType, thunkAPI) => {
  try {
    const { data } = await axios.post(`${MANAGEMENT_SITE_URL}api/${prefix}`, pickBy(body));
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const removeEntity = createAsyncThunk(`delete-one-${prefix}`, async (id: string, thunkAPI) => {
  try {
    await axios.delete(`${MANAGEMENT_SITE_URL}api/${prefix}/${id}`);
    return id;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
