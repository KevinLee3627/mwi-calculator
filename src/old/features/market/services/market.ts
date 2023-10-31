import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { MarketData } from 'src/old/core/market/MarketData';
import { MedianMarketData } from 'src/old/core/market/MedianMarketData';

export const marketApi = createApi({
  reducerPath: 'marketApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://raw.githubusercontent.com/holychikenz/MWIApi/main/'
  }),
  endpoints: (builder) => ({
    // TODO: Is this how it's done...?
    getMarketData: builder.query<MarketData, string>({
      query: () => 'milkyapi.json'
    }),
    getMedianMarketData: builder.query<MedianMarketData, string>({
      query: () => 'medianmarket.json'
    })
  })
});

export const { useGetMarketDataQuery, useGetMedianMarketDataQuery } = marketApi;
