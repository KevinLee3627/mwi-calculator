import { clientData } from 'src/old/core/clientData';
import { ItemHrid } from 'src/old/core/hrid/ItemHrid';
import { MarketData } from 'src/old/core/market/MarketData';
import { MedianMarketData } from 'src/old/core/market/MedianMarketData';

export class Market {
  marketData: MarketData | MedianMarketData | undefined;

  constructor(marketData: MarketData | MedianMarketData | undefined) {
    this.marketData = marketData;
  }

  getEntry(hrid: ItemHrid) {
    if (this.marketData != null) {
      const displayName = clientData.itemDetailMap[hrid].name;
      return this.marketData.market[displayName];
    } else {
      // If marketdata is invalid/does not exist, just use the vendor price
      const item = clientData.itemDetailMap[hrid];
      return { ask: item.sellPrice, bid: item.sellPrice };
    }
  }

  getApproxValue(hrid: ItemHrid) {
    if (hrid == null) return 0;
    if (hrid === '/items/coin') return 1;
    // TODO: Add overrides
    const { ask, bid } = this.getEntry(hrid);
    if (ask === -1 && bid === -1) {
      return clientData.itemDetailMap[hrid].sellPrice;
    } else if (ask === -1) {
      return bid;
    } else if (bid === -1) {
      return ask;
    } else {
      return (ask + bid) / 2;
    }
  }

  // Sums of approx. values of multiple items
  getAveragePrice(hrids: ItemHrid[]) {
    if (hrids == null) return 0;
    else return hrids.reduce((acc, hrid) => acc + this.getApproxValue(hrid), 0);
  }
}
