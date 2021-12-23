import { createEntityAdapter, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IGetAllResp, IInitialState } from '../../shared/models/base.model';
import { IEventRecord } from '../../shared/models/eventRecord.model';
import { IEvent } from '../../shared/models/events.model';
import { RootState } from '../../shared/reducers';
import { deleteMany, getEntities, getEntity } from './events.api';
interface IEventInitialState extends IInitialState {
  deleteSuccess: boolean;
}

const initialState: IEventInitialState = {
  fetchEntitiesSuccess: false,
  fetchEntitySuccess: false,
  updateEntitySuccess: false,
  deleteEntitySuccess: false,
  entitiesLoading: false,
  entityLoading: false,
  errorMessage: null,
  deleteSuccess: false,
  totalItems: 0,
};

export const eventsAdapter = createEntityAdapter<IEvent>({
  selectId: ({ id }) => id,
});

// Config slice
const { actions, reducer } = createSlice({
  name: 'events',
  initialState: eventsAdapter.getInitialState({ initialState }),
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
      initialState.deleteSuccess = false;
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
    [getEntities.fulfilled.type]: (state, { payload }: PayloadAction<IGetAllResp<IEvent>>) => {
      eventsAdapter.setAll(state, payload.results);
      // eventsAdapter.upsertMany(state, payload.results);
      state.initialState.totalItems = payload.count;
      state.initialState.fetchEntitiesSuccess = true;
      state.initialState.entitiesLoading = false;
    },
    [getEntities.rejected.type]: (state, { payload }: PayloadAction<any>) => {
      state.initialState.errorMessage = payload?.message;
      state.initialState.entitiesLoading = false;
      state.initialState.fetchEntitiesSuccess = false;
    },
    [getEntity.fulfilled.type]: (state, { payload }: PayloadAction<IEvent>) => {
      eventsAdapter.upsertOne(state, payload);
      state.initialState.fetchEntitySuccess = true;
      state.initialState.entityLoading = false;
    },
    [getEntity.rejected.type]: (state, { payload }: PayloadAction<any>) => {
      state.initialState.errorMessage = payload?.message;
      state.initialState.entityLoading = false;
      state.initialState.fetchEntitySuccess = false;
    },
    [deleteMany.fulfilled.type]: (state, _: PayloadAction<IEventRecord>) => {
      state.initialState.deleteSuccess = true;
      state.initialState.entitiesLoading = false;
    },
    [deleteMany.rejected.type]: (state, { payload }) => {
      state.initialState.errorMessage = payload;
      state.initialState.entitiesLoading = false;
    },
  },
});

// Export actions
export default reducer;
export const { fetchingEntities, fetchingEntity, hardReset, softReset } = actions;

const { selectById } = eventsAdapter.getSelectors();

const getEventState = (rootState: RootState) => rootState.events;

export const selectEntityById = (id: number) => {
  return createSelector(getEventState, (state) => selectById(state, id));
};

export const eventsSelectors = eventsAdapter.getSelectors<RootState>((state) => state.events);
