import { MarketEntry } from 'src/core/market/MarketEntry';

export interface MarketData {
  time: number; //unix epoch
  market: Record<string, MarketEntry>;
}
