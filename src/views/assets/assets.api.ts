import { IAsset } from "../../shared/models/assets.model";
import { splitApi } from "../../shared/splitApi";
import { IAssetFilter } from "../realEstateListing/RealEstateListing";

export interface IGetAssets {
  count: number;
  results: IAsset[];
}

export const assetsApi = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    getAssets: builder.query<IGetAssets, IAssetFilter | void>({
      query: (fields: IAssetFilter) => `assets?page=${fields.page}&size=${fields.size}`,
    }),
    getAsset: builder.query<IAsset, string>({
      query: (id) => `assets/${id}`,
    }),
  }),
  overrideExisting: false,
});

export const { useGetAssetsQuery, useGetAssetQuery } = assetsApi;
