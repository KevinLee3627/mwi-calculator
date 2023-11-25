import { clientData } from 'src/core/clientData';
import { HouseRoomHrid } from 'src/core/hrid/HouseRoomHrid';
import { ItemHrid } from 'src/core/hrid/ItemHrid';

interface GetHouseCostsParams {
  startLevel: number;
  endLevel: number;
  roomHrid: HouseRoomHrid;
}

export function getHouseCosts({ startLevel, endLevel, roomHrid }: GetHouseCostsParams) {
  const costMap = clientData.houseRoomDetailMap[roomHrid].upgradeCostsMap;

  const totalCosts = Object.entries(costMap).reduce<Record<string, number>>(
    (acc, entry) => {
      const [key, val] = entry;
      const level = parseInt(key, 10);
      if (level <= startLevel || level > endLevel) return acc;

      val.forEach((cost) => {
        if (acc[cost.itemHrid] == null) {
          acc[cost.itemHrid] = 0;
        }
        acc[cost.itemHrid] += cost.count;
      });
      return acc;
    },
    {}
  ) as Record<ItemHrid, number>;
  return totalCosts;
}
