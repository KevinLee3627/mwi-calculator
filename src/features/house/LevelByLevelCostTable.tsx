import { Dispatch, SetStateAction } from 'react';
import { clientData } from 'src/core/clientData';
import { HouseRoomDetail } from 'src/core/house/HouseRoomDetail';
import { ItemHrid } from 'src/core/hrid/ItemHrid';
import { ItemEntry } from 'src/features/house/ItemEntry';
import { Market } from 'src/features/market/Market';

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
  return Object.entries(room.upgradeCostsMap)
    .filter((entry) => {
      const [levelStr] = entry;
      const level = parseInt(levelStr, 10);
      return level > startLevel && level <= endLevel;
    })
    .map((entry) => {
      const [levelStr, costArr] = entry;
      const level = parseInt(levelStr, 10);

      return (
        <div key={`${room.hrid}-level-${levelStr}`} className="mb-4">
          <p className="font-bold">
            Level {level - 1} → {level}
          </p>
          <div className="table-zebra table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Amount</th>
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
