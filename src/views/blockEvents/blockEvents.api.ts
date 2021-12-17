import { baseApi } from "../../shared/baseApi";
import { IEventRecord, INewEventRecord } from "../../shared/models/eventRecord.model";

export interface IGetBlockEvent {
  count: number;
  results: IEventRecord[];
}

export const blockEventsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBlockEvents: builder.query<IGetBlockEvent, void>({
      query: () => `block-events`,
    }),
    getBlockEvent: builder.query<IEventRecord, string>({
      query: (id) => `block-events/${id}`,
    }),
    createBlockEvent: builder.mutation<IEventRecord, Partial<INewEventRecord>>({
      query(body) {
        return {
          url: `block-events`,
          method: "POST",
          body,
        };
      },
    }),
  }),
  overrideExisting: false,
});

export const { useGetBlockEventQuery, useGetBlockEventsQuery,useCreateBlockEventMutation } = blockEventsApi;
