import { MarketEntry } from 'src/new/core/market/MarketEntry';

export interface MarketData {
  time: number; //unix epoch
  market: Record<string, MarketEntry>;
}
