import { MarketEntry } from 'src/old/core/market/MarketEntry';

export interface MarketData {
  time: number; //unix epoch
  market: Record<string, MarketEntry>;
}
