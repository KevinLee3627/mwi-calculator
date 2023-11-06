import { clientData } from 'src/core/clientData';
import { ItemHrid } from 'src/core/hrid/ItemHrid';
import { MarketData } from 'src/core/market/MarketData';
import { MedianMarketData } from 'src/core/market/MedianMarketData';
import { Nullish } from 'src/util/utilityTypes';

export class Market {
  market: MarketData['market'] | MedianMarketData['market'] | Nullish;

  constructor(market: MarketData['market'] | MedianMarketData['market'] | Nullish) {
    this.market = market;
  }

  getItem(hrid: ItemHrid) {
    if (this.market != null) {
      const displayName = clientData.itemDetailMap[hrid].name;
      return this.market[displayName];
    } else {
      // If marketdata is invalid/does not exist, just use the vendor price
      const item = clientData.itemDetailMap[hrid];
      return { ask: item.sellPrice, bid: item.sellPrice };
    }
  }

  getItemPrice(itemHrid: ItemHrid) {
    if (itemHrid === '/items/coin') return 1;
    const { ask, bid } = this.getItem(itemHrid);
    if (ask === -1 && bid === -1) {
      return clientData.itemDetailMap[itemHrid].sellPrice;
    } else if (ask === -1) {
      return bid;
    } else if (bid === -1) {
      return ask;
    } else {
      return (ask + bid) / 2;
    }
  }
}
