import { Dispatch, SetStateAction } from 'react';
import { clientData } from 'src/core/clientData';
import { HouseRoomDetail } from 'src/core/house/HouseRoomDetail';
import { ItemHrid } from 'src/core/hrid/ItemHrid';
import { ItemEntry } from 'src/features/house/ItemEntry';
import { getHouseCosts } from 'src/features/house/getHouseCosts';
import { Market } from 'src/features/market/Market';
import { formatNumber } from 'src/util/formatNumber';

interface LevelByLevelCostTableProps {
  room: HouseRoomDetail;
  startLevel: number;
  endLevel: number;
  market: Market | null;
  priceOverrides: Partial<Record<ItemHrid, number>>;
  setPriceOverrides: Dispatch<SetStateAction<Partial<Record<ItemHrid, number>>>>;
}

export function LevelByLevelCostTable({
  room,
  startLevel,
  endLevel,
  market,
  priceOverrides,
  setPriceOverrides
}: LevelByLevelCostTableProps) {
  const relevantCosts = Object.entries(room.upgradeCostsMap).filter((entry) => {
    const [levelStr] = entry;
    const level = parseInt(levelStr, 10);
    return level > startLevel && level <= endLevel;
  });

  return relevantCosts.map((entry) => {
    const [levelStr, costArr] = entry;
    const level = parseInt(levelStr, 10);

    // TODO: not efficient but works
    const totalCoinCost = Object.entries(
      getHouseCosts({ startLevel: level - 1, endLevel: level, roomHrid: room.hrid })
    ).reduce((acc, entry) => {
      const [itemHrid, count] = entry as [ItemHrid, number];
      const override = priceOverrides[itemHrid];
      if (override != null) return acc + override * count;

      const vendorPrice = clientData.itemDetailMap[itemHrid].sellPrice;
      const itemCost = market ? market.getItemPrice(itemHrid) : vendorPrice;
      return acc + itemCost * count;
    }, 0);

    return (
      <div key={`${room.hrid}-level-${levelStr}`} className="mb-4">
        <p className="font-bold">
          Level {level - 1} → {level}
        </p>
        <div className="table-zebra table">
          <thead>
            <tr>
              <th>Total Coin Cost: {formatNumber(totalCoinCost)}</th>
            </tr>
            <tr>
              <th>Item</th>
              <th>Amount</th>
              <th>Price per Item</th>
              <th>Total Item Price</th>
            </tr>
          </thead>
          <tbody>
            {costArr.map((cost) => {
              const defaultPrice =
                market != null
                  ? market.getItemPrice(cost.itemHrid)
                  : clientData.itemDetailMap[cost.itemHrid].sellPrice;
              return (
                <ItemEntry
                  key={`levelByLevel-${room.hrid}-${cost.itemHrid}`}
                  itemHrid={cost.itemHrid}
                  count={cost.count}
                  priceOverrides={priceOverrides}
                  setPriceOverrides={setPriceOverrides}
                  defaultPrice={defaultPrice}
                />
              );
            })}
          </tbody>
        </div>
      </div>
    );
  });
}
