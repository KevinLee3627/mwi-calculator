import { MarketEntry } from 'src/core/market/MarketEntry';

export interface MedianMarketData {
  time: number; // unix epoch
  market: Record<string, Omit<MarketEntry, 'vendor'>>;
}
