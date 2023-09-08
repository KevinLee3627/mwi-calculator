import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { MarketData } from 'src/core/market/MarketData';

export const marketApi = createApi({
  reducerPath: 'marketApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://raw.githubusercontent.com/holychikenz/MWIApi/main/'
  }),
  endpoints: (builder) => ({
    // TODO: Is this how it's done...?
    getMarketData: builder.query<MarketData, string>({
      query: () => 'milkyapi.json'
    })
  })
});

export const { useGetMarketDataQuery } = marketApi;
