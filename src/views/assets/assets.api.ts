import { splitApi } from "../../shared/splitApi";

type AssetsResponse = Array<any>;
type AssetResponse = Object;

export const assetsApi = splitApi.injectEndpoints({
  endpoints: (builder) => ({
    getAssets: builder.query<AssetsResponse, void>({
      query: () => `assets`,
    }),
    getAsset: builder.query<AssetResponse, string>({
      query: (id) => `assets/${id}`,
    }),
  }),
  overrideExisting: false,
});

export const { useGetAssetsQuery,useGetAssetQuery } = assetsApi;
