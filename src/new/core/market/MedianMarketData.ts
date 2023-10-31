import { MarketEntry } from 'src/new/core/market/MarketEntry';

export interface MedianMarketData {
  time: number; // unix epoch
  market: Record<string, Omit<MarketEntry, 'vendor'>>;
}
