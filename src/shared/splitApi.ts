import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// initialize an empty api service that we'll inject endpoints into later as needed
// Change splitApi => baseAPI since this is an api instance, not a function.
export const splitApi = createApi({
    reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://dev.anft.vn/api/' }),
  endpoints: () => ({}),
})