import { createEntityAdapter, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAsset } from '../../shared/models/assets.model';
import { IGetAllResp, IInitialState } from '../../shared/models/base.model';
import { RootState } from '../../shared/reducers';
import { getEntities, getEntity, getStakeholderListingStakes, getEntityOptions } from './assets.api';
import { cloneDeep } from 'lodash';
import { deepCopy } from 'ethers/lib/utils';
// import { assetsApi } from "./assets.api";

const initialState: IInitialState = {
  fetchEntitiesSuccess: false,
  fetchEntitySuccess: false,
  updateEntitySuccess: false,
  deleteEntitySuccess: false,
  entitiesLoading: false,
  entityLoading: false,
  errorMessage: null,
  totalItems: 0,
};

export const assetsAdapter = createEntityAdapter<IAsset>({
  selectId: ({ id }) => id,
});

// Config slice
const { actions, reducer } = createSlice({
  name: 'assets',
  initialState: assetsAdapter.getInitialState({ initialState }),
  reducers: {
    fetchingEntities({ initialState }) {
      initialState.entitiesLoading = true;
    },
    fetchingEntity({ initialState }) {
      initialState.entityLoading = true;
    },
    hardReset({ initialState }) {
      initialState.entitiesLoading = false;
      initialState.entityLoading = false;
      initialState.fetchEntitiesSuccess = false;
      initialState.fetchEntitySuccess = false;
      initialState.updateEntitySuccess = false;
      initialState.deleteEntitySuccess = false;
      initialState.errorMessage = null;
      initialState.totalItems = 0;
    },
    softReset({ initialState }) {
      initialState.updateEntitySuccess = false;
      initialState.errorMessage = null;
      initialState.fetchEntitySuccess = false;
      initialState.deleteEntitySuccess = false;
    },
  },
  extraReducers: {
    [getEntities.fulfilled.type]: (state, { payload }: PayloadAction<IGetAllResp<IAsset>>) => {
      // assetsAdapter.setAll(state, payload.results);
      assetsAdapter.upsertMany(state, payload.results);
      state.initialState.totalItems = payload.count;
      state.initialState.fetchEntitiesSuccess = true;
      state.initialState.entitiesLoading = false;
    },
    [getEntities.rejected.type]: (state, { payload }: PayloadAction<any>) => {
      state.initialState.errorMessage = payload?.message;
      state.initialState.entitiesLoading = false;
      state.initialState.fetchEntitiesSuccess = false;
    },
    [getEntity.fulfilled.type]: (state, { payload }: PayloadAction<IAsset>) => {
      assetsAdapter.upsertOne(state, payload);
      state.initialState.fetchEntitySuccess = true;
      state.initialState.entityLoading = false;
    },
    [getEntity.rejected.type]: (state, { payload }: PayloadAction<any>) => {
      state.initialState.errorMessage = payload?.message;
      state.initialState.entityLoading = false;
      state.initialState.fetchEntitySuccess = false;
    },
    [getEntityOptions.fulfilled.type]: (state, { payload }: PayloadAction<IAsset>) => {
      assetsAdapter.upsertOne(state, payload);
      state.initialState.fetchEntitySuccess = true;
      state.initialState.entityLoading = false;
    },
    [getEntityOptions.rejected.type]: (state, { payload }: PayloadAction<any>) => {
      state.initialState.errorMessage = payload?.message;
      state.initialState.entityLoading = false;
      state.initialState.fetchEntitySuccess = false;
    },
    [getStakeholderListingStakes.fulfilled.type]: (state, { payload }: PayloadAction<IAsset>) => {
      // const{id} = payload
      // // const options = [...payload.options];
      // // const modifiedPayload = {...payload};
      // // console.log(state.entities, 'st')
      // let a = deepCopy(state.entities)
      // // console.log(a, 'a');
      
      // console.log(a,'a')
      // let b = {...a, [id]: payload};
      // console.log(b, 'b')
      // state.entities = {};
      // state.entities = {...b};
      // state.entities = Object.assign(a, {})
      // modifiedPayload.options = options
      // console.log(modifiedPayload, 'modifiedPayload')
      // assetsAdapter.removeAll(state);
      // assetsAdapter.addOne(state, {...payload, options});
      assetsAdapter.upsertOne(state, payload);

      state.initialState.fetchEntitySuccess = true;
      state.initialState.entityLoading = false;
    },
    [getStakeholderListingStakes.rejected.type]: (state, { payload }: PayloadAction<any>) => {
      state.initialState.errorMessage = payload?.message;
      state.initialState.entityLoading = false;
      state.initialState.fetchEntitySuccess = false;
    },
  },
});

// Export actions
export default reducer;
export const { fetchingEntities, fetchingEntity, hardReset, softReset } = actions;

const { selectById, selectAll } = assetsAdapter.getSelectors();

const getAssetState = (rootState: RootState) => rootState.assets;

export const selectEntityById = (id: number) => {
  return createSelector(getAssetState, (state) => selectById(state, id));
};

export const assetsSelectors = assetsAdapter.getSelectors<RootState>((state) => state.assets);
