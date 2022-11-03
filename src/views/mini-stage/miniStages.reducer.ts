import { createEntityAdapter, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { IMiniStage } from '../../shared/models/stage.model';
import { RootState } from '../../shared/reducers';

import { getCurrentEntity, getEntities, getEntity } from './miniStages.api';

interface IMiniStageState  {
  currentEntity: null | IMiniStage;
  fetchEntitiesSuccess: boolean,
  fetchEntitySuccess: boolean,
  updateEntitySuccess: boolean,
  deleteEntitySuccess: boolean,
  loading: boolean,
  errorMessage: string | null,
  totalItems: number,
}

const initialState: IMiniStageState = {
  fetchEntitiesSuccess: false,
  fetchEntitySuccess: false,
  updateEntitySuccess: false,
  deleteEntitySuccess: false,
  loading: false,
  errorMessage: null,
  totalItems: 0,
  currentEntity: null,
};

export const miniStageSAdapter = createEntityAdapter<IMiniStage>({
  selectId: ({ id }) => id,
});

const { actions, reducer } = createSlice({
  name: 'miniStageSlice',
  initialState: miniStageSAdapter.getInitialState({ initialState }),
  reducers: {
    fetching(state) {
      state.initialState.loading = true;
    },
    resetAll(state) {
      state.initialState.loading = false;
      state.initialState.fetchEntitiesSuccess = false;
      state.initialState.fetchEntitySuccess = false;
      state.initialState.updateEntitySuccess = false;
      state.initialState.deleteEntitySuccess = false;
      state.initialState.errorMessage = null;
      state.initialState.currentEntity = null;
    },
    resetEntity(state) {
      state.initialState.updateEntitySuccess = false;
      state.initialState.errorMessage = null;
      state.initialState.deleteEntitySuccess = false;
    },
  },
  extraReducers: {
    [getEntities.fulfilled.type]: (state, { payload }: PayloadAction<AxiosResponse<IMiniStage[]>>) => {
      miniStageSAdapter.setAll(state, payload.data);
      state.initialState.totalItems = Number(payload.headers['x-total-count']);
      state.initialState.fetchEntitiesSuccess = true;
      state.initialState.loading = false;
    },
    [getEntities.rejected.type]: (state, { payload }: PayloadAction<any>) => {
      state.initialState.errorMessage = payload?.message;
      state.initialState.loading = false;
      state.initialState.fetchEntitiesSuccess = false;
    },
    [getEntity.fulfilled.type]: (state, { payload }: PayloadAction<IMiniStage>) => {
      miniStageSAdapter.upsertOne(state, payload);
      state.initialState.fetchEntitySuccess = true;
      state.initialState.loading = false;
    },
    [getEntity.rejected.type]: (state, { payload }: PayloadAction<any>) => {
      state.initialState.errorMessage = payload?.message;
      state.initialState.loading = false;
      state.initialState.fetchEntitySuccess = false;
    },
    [getCurrentEntity.fulfilled.type]: (state, { payload }: PayloadAction<IMiniStage>) => {
      state.initialState.currentEntity = payload;
      state.initialState.fetchEntitySuccess = true;
      state.initialState.loading = false;
    },
    [getCurrentEntity.rejected.type]: (state, { payload }: PayloadAction<any>) => {
      state.initialState.errorMessage = payload?.message;
      state.initialState.loading = false;
      state.initialState.fetchEntitySuccess = false;
    },
  },
});

export const { fetching, resetAll, resetEntity } = actions;
export default reducer;

export const miniStageSelectors = miniStageSAdapter.getSelectors<RootState>((state) => state.miniStages);

const { selectById } = miniStageSAdapter.getSelectors();
const getMiniStageSState = (rootState: RootState) => rootState.miniStages;

export const selectEntityById = (id: string) => {
  return createSelector(getMiniStageSState, (state) => selectById(state, id));
};
