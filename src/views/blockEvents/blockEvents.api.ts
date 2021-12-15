import { baseApi } from "../../shared/baseApi";
import { IBlockEvent, INewBlockEvent } from "../../shared/models/blockEvents.model";

export interface IGetBlockEvent {
  count: number;
  results: IBlockEvent[];
}

export const blockEventsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBlockEvents: builder.query<IGetBlockEvent, void>({
      query: () => `block-events`,
    }),
    getBlockEvent: builder.query<IBlockEvent, string>({
      query: (id) => `block-events/${id}`,
    }),
    createBlockEvent: builder.mutation<IBlockEvent, Partial<INewBlockEvent>>({
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
