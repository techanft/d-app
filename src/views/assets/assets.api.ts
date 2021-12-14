import { IAsset } from "../../shared/models/assets.model";
import { splitApi } from "../../shared/splitApi";

export const assetsApi = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    getAssets: builder.query<IAsset[], void>({
      query: () => `assets?size=100`,
    }),
    getAsset: builder.query<IAsset, string>({
      query: (id) => `assets/${id}`,
    }),
  }),
  overrideExisting: false,
});



export const { useGetAssetsQuery, useGetAssetQuery } = assetsApi;
