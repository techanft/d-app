import { IAsset } from "../../shared/models/assets.model";
import { splitApi } from "../../shared/splitApi";
import { IAssetFilter } from "../realEstateListing/RealEstateListing";
import { IResponse } from "./assets.reducer";

export interface IGetAssets {
  count: number;
  results: IAsset[];
}

export const assetsApi = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    getAssets: builder.query<IResponse, IAssetFilter | void>({
      query: (fields : IAssetFilter) => `assets?page=${fields.page}&size=${fields.size}&sort=${fields.sort}`,
    }),
    getAsset: builder.query<IAsset, string>({
      query: (id) => `assets/${id}`,
    }),
  }),
  overrideExisting: false,
});

export const { useGetAssetsQuery, useGetAssetQuery } = assetsApi;
