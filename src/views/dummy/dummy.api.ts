import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type AssetsResponse = Array<any>

export const api = createApi({
  reducerPath: 'api',

  baseQuery: fetchBaseQuery({
    baseUrl: 'https://dev.anft.vn/api/assets',
  }),

  endpoints: (builder) => ({
    getAssets: builder.query<AssetsResponse, void>({
      query: () => ``,
    }),
  }),
});

export const {  useGetAssetsQuery } = api;
