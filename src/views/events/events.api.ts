import { createAsyncThunk } from '@reduxjs/toolkit';
import { pickBy } from 'lodash';
import axios from '../../config/axios-interceptor';
import { LISTING_INSTANCE } from '../../shared/blockchain-helpers';
import { EventType } from '../../shared/enumeration/eventType';
import { IGetAllResp, IParams } from '../../shared/models/base.model';
import { IEventRecord } from '../../shared/models/eventRecord.model';
import { IEvent, IEventArg } from '../../shared/models/events.model';
import { TypedEvent } from '../../typechain/common';
import { eventFilterMapping, handPickEventFilterVariable } from './eventsHelper';

export interface IEventTrackingFilter extends IParams {
  eventType: EventType;
  listingId: number;
}

const prefix = 'event-trackings';

// APIs calling centralized server
export const getEntities = createAsyncThunk(`get-all-${prefix}`, async (fields: IEventTrackingFilter, thunkAPI) => {
  try {
    const params = pickBy(fields);
    const { data } = await axios.get<IGetAllResp<IEvent>>(`${prefix}`, { params });
    // Attemp to fetch blockchain data
    const listingsPartialInfo = await getEventPartialInfo(data.results, fields.eventType);
    data.results = listingsPartialInfo;
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getEntity = createAsyncThunk(`get-single-${prefix}`, async (id: number, thunkAPI) => {
  try {
    const { data } = await axios.get<IEvent>(`${prefix}/${id}`);
    // return await getListingCompleteInfo(data);
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Rename function
const getEventPartialInfo = async (events: IEvent[], eventType: EventType): Promise<IEvent[]> => {
  try {
    const eventPromises: Promise<Array<TypedEvent<IEventArg>>>[] = [];

    for (let index = 0; index < events.length; index++) {
      const { asset, block } = events[index];
      const instance = LISTING_INSTANCE(asset.address);
      // Không có instance thì throw Error + break luôn
      if (instance) {
        const blockTag: number = Number(block);
        const filter = eventFilterMapping(instance, eventType);

        eventPromises.push(instance.queryFilter(filter, blockTag, blockTag));
      } else {
        throw Error('Listing instance error');
      }
    }

    // Calling promises
    const filterResults = await Promise.all(eventPromises);

    // Mapping new properties based on index
    // https://stackoverflow.com/questions/28066429/promise-all-order-of-resolved-values
    const output: IEvent[] = events.map((e, i) => {
      const filterResult = filterResults[i];
      const firstEvent = filterResult[0];
      const eventObject = handPickEventFilterVariable(firstEvent.args, eventType);
      return {
        ...e,
        eventArg: eventObject,
      };
    });
    return output;
  } catch (error) {
    console.log(`Error in fetching partialInfo: ${error}`);
    return events;
  }
};


export const deleteEventRecordById = createAsyncThunk('deleteEventRecordById', async (eventIds: Array<number>, thunkAPI) => {
  try {
    const { data } = await axios.delete<IEventRecord>(`${prefix}?ids=${eventIds.map((item) => item).join(',')}`);
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error);
  }
});

