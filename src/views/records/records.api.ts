import { createAsyncThunk } from '@reduxjs/toolkit';
import { pickBy } from 'lodash';
import axios from '../../config/axios-interceptor';
import { RecordType } from '../../shared/enumeration/recordType';
import { IGetAllResp, IParams } from '../../shared/models/base.model';
import {
  IRecordClaim,
  IRecordOwnership,
  IRecordRegister,
  IRecordUnRegister,
  IRecordWithdraw,
  IRecordWorker
} from '../../shared/models/record.model';

export interface IRecordParams extends IParams {
  listingAddress?: string;
  previousOwner?: string;
  newOwner?: string;
  owner?: string;
}

export const prefix = 'records';

// APIs calling centralized server
export const getWorkersRecord = createAsyncThunk(`getWorkersRecord`, async (fields: IRecordParams, thunkAPI) => {
  try {
    const params = pickBy(fields);
    const { data} = await axios.get<IGetAllResp<IRecordWorker>>(`${prefix}/${RecordType.UPDATE_WORKER}`, {
      params,
    });
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getOwnershipExtensionRecord = createAsyncThunk(
  `getOwnershipExtensionRecord`,
  async (fields: IRecordParams, thunkAPI) => {
    try {
      const params = pickBy(fields);
      const { data} = await axios.get<IGetAllResp<IRecordOwnership>>(
        `${prefix}/${RecordType.OWNERSHIP_EXTENSION}`,
        {
          params,
        }
      );
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getClaimsRecord = createAsyncThunk(`getClaimsRecord`, async (fields: IRecordParams, thunkAPI) => {
  try {
    const params = pickBy(fields);
    const { data} = await axios.get<IGetAllResp<IRecordClaim>>(`${prefix}/${RecordType.CLAIM}`, {
      params,
    });
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getRegisterRecord = createAsyncThunk(`getRegisterRecord`, async (fields: IRecordParams, thunkAPI) => {
  try {
    const params = pickBy(fields);
    const { data} = await axios.get<IGetAllResp<IRecordRegister>>(`${prefix}/${RecordType.REGISTER}`, {
      params,
    });
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getUnRegisterRecord = createAsyncThunk(`getUnRegisterRecord`, async (fields: IRecordParams, thunkAPI) => {
  try {
    const params = pickBy(fields);
    const { data} = await axios.get<IGetAllResp<IRecordUnRegister>>(
      `${prefix}/${RecordType.UNREGISTER}`,
      {
        params,
      }
    );
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getWithdrawRecord = createAsyncThunk(`getWithdrawRecord`, async (fields: IRecordParams, thunkAPI) => {
  try {
    const params = pickBy(fields);
    const { data} = await axios.get<IGetAllResp<IRecordWithdraw>>(`${prefix}/${RecordType.WITHDRAW}`, {
      params,
    });
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
