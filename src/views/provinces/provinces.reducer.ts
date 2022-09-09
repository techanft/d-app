import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { IResponse } from '../../shared/models/base.model';
import { IDistrictsAddress, IProvincesAddress, IWardsAddress } from '../../shared/models/provinces.model';
import { getDistrictsEntites, getProvincesEntites, getWardsEntites } from './provinces.api';

interface IProvinceState {
  fetchProvincesSuccess: boolean;
  provincesEntities: IProvincesAddress[];

  fetchDistrictsSuccess: boolean;
  districtsEntities: IDistrictsAddress[];

  fetchWardsSuccess: boolean;
  wardsEntities: IWardsAddress[];
  errorMessage: string | null;
  loading: boolean;
}

const initialState: IProvinceState = {
  fetchProvincesSuccess: false,
  provincesEntities: [],

  fetchDistrictsSuccess: false,
  districtsEntities: [],

  fetchWardsSuccess: false,
  wardsEntities: [],
  errorMessage: null,
  loading: false,
};

const provinceSlice = createSlice({
  name: 'provinceSlice',
  initialState,
  reducers: {
    fetching: (state) => {
      state.loading = true;
    },
    resetEntity: (state) => {
      state.loading = false;
      state.errorMessage = null;
      state.fetchDistrictsSuccess = false;
      state.fetchProvincesSuccess = false;
      state.fetchWardsSuccess = false;
    },
    resetAll: (state) => {
      state.loading = false;
      state.errorMessage = null;
      state.fetchDistrictsSuccess = false;
      state.fetchProvincesSuccess = false;
      state.fetchWardsSuccess = false;
      state.districtsEntities = [];
      state.provincesEntities = [];
      state.wardsEntities = [];
    },
    resetDistricts: (state) => {
      state.loading = false;
      state.districtsEntities = [];
      state.fetchDistrictsSuccess = false;
    },
  },
  extraReducers: {
    [getDistrictsEntites.fulfilled.type]: (
      state,
      { payload }: PayloadAction<AxiosResponse<IResponse<IDistrictsAddress[]>>>
    ) => {
      state.fetchDistrictsSuccess = true;
      state.loading = false;
      state.districtsEntities = payload.data.results;
    },
    [getDistrictsEntites.rejected.type]: (state, { payload }: PayloadAction<any>) => {
      state.errorMessage = payload?.message;
      state.loading = false;
      state.fetchDistrictsSuccess = false;
    },
    [getProvincesEntites.fulfilled.type]: (
      state,
      { payload }: PayloadAction<AxiosResponse<IResponse<IProvincesAddress[]>>>
    ) => {
      state.fetchProvincesSuccess = true;
      state.loading = false;
      state.provincesEntities = payload.data.results;
    },
    [getProvincesEntites.rejected.type]: (state, { payload }: PayloadAction<any>) => {
      state.errorMessage = payload?.message;
      state.loading = false;
      state.fetchProvincesSuccess = false;
    },
    [getWardsEntites.fulfilled.type]: (
      state,
      { payload }: PayloadAction<AxiosResponse<IResponse<IWardsAddress[]>>>
    ) => {
      state.fetchWardsSuccess = true;
      state.loading = false;
      state.wardsEntities = payload.data.results;
    },
    [getWardsEntites.rejected.type]: (state, { payload }: PayloadAction<any>) => {
      state.errorMessage = payload?.message;
      state.loading = false;
      state.fetchWardsSuccess = false;
    },
  },
});

export default provinceSlice.reducer;
export const { fetching, resetAll, resetEntity, resetDistricts } = provinceSlice.actions;
