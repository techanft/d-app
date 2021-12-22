import { createAsyncThunk } from '@reduxjs/toolkit';
import { pickBy } from 'lodash';
import axios from '../../config/axios-interceptor';
import { LISTING_INSTANCE } from '../../shared/blockchain-helpers';
import { EventType } from '../../shared/enumeration/eventType';
import { IGetAllResp, IParams } from '../../shared/models/base.model';
import { IEventRecord } from '../../shared/models/eventRecord.model';
import { IEvent, IEventArg } from '../../shared/models/events.model';
import { TypedEvent } from '../../typechain/common';
import { eventFilterMapping, handPickEventFilterVariable } from './events-helper';

export interface IEventTrackingFilter extends IParams {
  eventType: EventType;
  listingId: number;
}

export const prefix = 'event-trackings';

// APIs calling centralized server
export const getEntities = createAsyncThunk(`get-all-${prefix}`, async (fields: IEventTrackingFilter, thunkAPI) => {
  try {
    const params = pickBy(fields);
    const { data: eventRecord } = await axios.get<IGetAllResp<IEvent>>(`${prefix}`, { params });
    const listingsPartialInfo = await getEventsArgsByBlock(eventRecord.results, fields.eventType);
    eventRecord.results = listingsPartialInfo;
    return eventRecord;
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


const getEventsArgsByBlock = async (eventRecords: IEvent[], eventType: EventType): Promise<IEvent[]> => {
  try {
    const filterPromises: Promise<Array<TypedEvent<IEventArg>>>[] = [];

    // Since these eventRecords records for the same listing, we can safely assume that the {listingAddress} is consistent between array elements. (eventRecords[0] is reasonable)
    const listingAddress = eventRecords[0].asset.address; 
    const instance = LISTING_INSTANCE(listingAddress);
    if (!instance) throw Error('Listing instance error');
    
    
    for (let index = 0; index < eventRecords.length; index++) {
      const { block } = eventRecords[index];
      const blockTag: number = Number(block);
      const filter = eventFilterMapping(instance, eventType);
      filterPromises.push(instance.queryFilter(filter, blockTag, blockTag));
    }

    const filterResults = await Promise.all(filterPromises);

    const output: IEvent[] = eventRecords.map((e, i) => {
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
    console.log(`Error in fetching events args by block: ${error}`);
    return eventRecords;
  }
};

export const deleteMany = createAsyncThunk(`deleteMany-${prefix}`, async (eventIds: Array<number>, thunkAPI) => {
  try {
    const { data } = await axios.delete<IEventRecord>(`${prefix}?ids=${eventIds.map((item) => item).join(',')}`);
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error);
  }
});

