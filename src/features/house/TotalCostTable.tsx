import { useMemo, useState } from 'react';
import { clientData } from 'src/core/clientData';
import { HouseRoomDetail } from 'src/core/house/HouseRoomDetail';
import { ItemHrid } from 'src/core/hrid/ItemHrid';
import { getHouseCosts } from 'src/features/house/getHouseCosts';
import { ItemEntry } from 'src/features/house/ItemEntry';
import { Market } from 'src/features/market/Market';

interface TotalCostTableProps {
  room: HouseRoomDetail;
  startLevel: number;
  endLevel: number;
  market: Market | null;
}

export function TotalCostTable({
  room,
  startLevel,
  endLevel,
  market
}: TotalCostTableProps) {
  const [priceOverrides, setPriceOverrides] = useState<Partial<Record<ItemHrid, number>>>(
    {}
  );

  const totalCoinCost = useMemo(() => {
    return Object.entries(
      getHouseCosts({ startLevel, endLevel, roomHrid: room.hrid })
    ).reduce((acc, entry) => {
      const [itemHrid, count] = entry as [ItemHrid, number];
      const override = priceOverrides[itemHrid];
      if (override != null) return acc + override * count;

      const vendorPrice = clientData.itemDetailMap[itemHrid].sellPrice;
      const itemCost = market ? market.getItemPrice(itemHrid) : vendorPrice;
      return acc + itemCost * count;
    }, 0);
  }, [startLevel, endLevel, room, market, priceOverrides]);

  const totalCosts = useMemo(() => {
    console.log('recalc');
    return Object.entries(getHouseCosts({ startLevel, endLevel, roomHrid: room.hrid }))
      .sort((a, b) => {
        const indexA = clientData.itemDetailMap[a[0] as ItemHrid].sortIndex;
        const indexB = clientData.itemDetailMap[b[0] as ItemHrid].sortIndex;
        return indexA - indexB;
      })
      .map((entry) => {
        const [itemHrid, amount] = entry as [ItemHrid, number];

        const defaultPrice =
          market != null
            ? market.getItemPrice(itemHrid)
            : clientData.itemDetailMap[itemHrid].sellPrice;

        return (
          <ItemEntry
            key={`${room.hrid}-${itemHrid}-${amount}-total-override`}
            itemHrid={itemHrid}
            count={amount}
            priceOverrides={priceOverrides}
            setPriceOverrides={setPriceOverrides}
            defaultPrice={defaultPrice}
          />
        );
      });
  }, [startLevel, endLevel, priceOverrides, room.hrid, market]);

  return (
    <table className="table-zebra table">
      <thead>
        <tr>
          <th>Total Coin Cost: {totalCoinCost}</th>
        </tr>
        <tr>
          <th>Item</th>
          <th>Amount</th>
          <th>Avg. Market Cost</th>
        </tr>
      </thead>
      <tbody>{totalCosts}</tbody>
    </table>
  );
}
