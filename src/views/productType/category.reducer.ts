import { createEntityAdapter, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { IInitialState, IResponse } from '../../shared/models/base.model';
import { IListingType } from '../../shared/models/listingType.model';
import { RootState } from '../../shared/reducers';
import { createEntity, getEntities, getEntity, removeEntity, updateEntity } from './category.api';

interface IListingTypeInitial extends IInitialState {
  loading: boolean;
}

const initialState: IListingTypeInitial = {
  fetchEntitiesSuccess: false,
  fetchEntitySuccess: false,
  updateEntitySuccess: false,
  deleteEntitySuccess: false,
  entitiesLoading: false,
  entityLoading: false,
  loading: false,
  errorMessage: null,
  totalItems: 0,
};

export const categoryAdapter = createEntityAdapter<IListingType>({
  selectId: ({ id }) => id,
});

const { actions, reducer } = createSlice({
  name: 'categorySlice',
  initialState: categoryAdapter.getInitialState({ initialState }),
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
    },
    resetEntity(state) {
      state.initialState.updateEntitySuccess = false;
      state.initialState.errorMessage = null;
      state.initialState.deleteEntitySuccess = false;
    },
  },
  extraReducers: {
    [getEntities.fulfilled.type]: (state, { payload }: PayloadAction<AxiosResponse<IResponse<IListingType[]>>>) => {
      categoryAdapter.setAll(state, payload.data.results);
      state.initialState.totalItems = Number(payload.data.count);
      state.initialState.fetchEntitiesSuccess = true;
      state.initialState.loading = false;
    },
    [getEntities.rejected.type]: (state, { payload }: PayloadAction<any>) => {
      state.initialState.errorMessage = payload?.message;
      state.initialState.loading = false;
      state.initialState.fetchEntitiesSuccess = false;
    },
    [getEntity.fulfilled.type]: (state, { payload }: PayloadAction<IListingType>) => {
      categoryAdapter.upsertOne(state, payload);
      state.initialState.fetchEntitySuccess = true;
      state.initialState.loading = false;
    },
    [getEntity.rejected.type]: (state, { payload }: PayloadAction<any>) => {
      state.initialState.errorMessage = payload?.message;
      state.initialState.loading = false;
      state.initialState.fetchEntitySuccess = false;
    },
    [updateEntity.fulfilled.type]: (state, { payload }: PayloadAction<IListingType>) => {
      categoryAdapter.updateOne(state, { id: payload.id, changes: payload });
      state.initialState.updateEntitySuccess = true;
      state.initialState.loading = false;
    },
    [updateEntity.rejected.type]: (state, { payload }: PayloadAction<any>) => {
      state.initialState.errorMessage = payload?.message;
      state.initialState.loading = false;
      state.initialState.updateEntitySuccess = false;
    },
    [createEntity.fulfilled.type]: (state, { payload }: PayloadAction<IListingType>) => {
      categoryAdapter.addOne(state, payload);
      state.initialState.updateEntitySuccess = true;
      state.initialState.loading = false;
    },
    [createEntity.rejected.type]: (state, { payload }: PayloadAction<any>) => {
      state.initialState.errorMessage = payload?.message;
      state.initialState.loading = false;
      state.initialState.updateEntitySuccess = false;
    },
    [removeEntity.fulfilled.type]: (state, { payload }: PayloadAction<string>) => {
      categoryAdapter.removeOne(state, payload);
      state.initialState.totalItems -= 1;
      state.initialState.deleteEntitySuccess = true;
      state.initialState.loading = false;
    },
    [removeEntity.rejected.type]: (state, { payload }: PayloadAction<any>) => {
      state.initialState.errorMessage = payload?.message;
      state.initialState.loading = false;
      state.initialState.deleteEntitySuccess = false;
    },
  },
});

export const { fetching, resetAll, resetEntity } = actions;
export default reducer;

export const categorySelectors = categoryAdapter.getSelectors<RootState>((state) => state.category);

const { selectById } = categoryAdapter.getSelectors();
const getCategoryState = (rootState: RootState) => rootState.category;

export const selectEntityById = (id: string) => {
  return createSelector(getCategoryState, (state) => selectById(state, id));
};
