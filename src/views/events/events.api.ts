import { createAsyncThunk } from '@reduxjs/toolkit';
import { ethers } from 'ethers';
import { pickBy } from 'lodash';
import axios from '../../config/axios-interceptor';
import { LISTING_INSTANCE } from '../../shared/blockchain-helpers';
import { EventType } from '../../shared/enumeration/eventType';
import { IGetAllResp, IParams } from '../../shared/models/base.model';
import { IEvent } from '../../shared/models/events.model';
import { gettersMapping } from './gettersMapping';

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
    const listingsPartialInfo = await getListingsPartialInfo(data.results, fields.eventType);
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
const getListingsPartialInfo = async (events: IEvent[], eventType: EventType): Promise<IEvent[]> => {
  try {
    // REMOVE OBSOLETE COMMENTS
    // Only value and dailyPayment is neccessary
    const eventPromises: Promise<ethers.Event[]>[] = [];

    for (let index = 0; index < events.length; index++) {
      const { asset, block } = events[index];
      const instance = LISTING_INSTANCE(asset.address);
      // Không có instance thì throw Error + break luôn
      if (instance) {
        const blockTag: number = Number(block);
        const filter = gettersMapping(instance, eventType);
        eventPromises.push(instance.queryFilter(filter, blockTag, blockTag));
      }
    }

    // Calling promises
    // Rename: filterResults
    const listingEvent = await Promise.all(eventPromises);
    // Mapping new properties based on index
    // https://stackoverflow.com/questions/28066429/promise-all-order-of-resolved-values
    const output: IEvent[] = events.map((e, i) => {

      // Không viết listingEvent[i][0];
      /*
        const filterResult = listingEvent[i];
        const firstEvent = filterResult[0]
      */ 

      return {
        ...e,
        eventArg: listingEvent[i][0].args, 
      };
    });

    return output;
  } catch (error) {
    console.log(`Error in fetching partialInfo: ${error}`);
    return events;
  }
};
