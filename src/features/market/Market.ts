import { clientData } from 'src/core/clientData';
import { ItemHrid } from 'src/core/hrid/ItemHrid';
import { MarketData } from 'src/core/market/MarketData';
import { MedianMarketData } from 'src/core/market/MedianMarketData';

export class Market {
  marketData: MarketData | MedianMarketData;

  constructor(marketData: MarketData | MedianMarketData) {
    this.marketData = marketData;
  }

  getEntry(hrid: ItemHrid) {
    const displayName = clientData.itemDetailMap[hrid].name;
    return this.marketData.market[displayName];
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
