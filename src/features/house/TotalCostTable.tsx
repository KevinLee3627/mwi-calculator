import { clientData } from 'src/core/clientData';
import { HouseRoomDetail } from 'src/core/house/HouseRoomDetail';
import { ItemHrid } from 'src/core/hrid/ItemHrid';
import { getHouseCosts } from 'src/features/house/getHouseCosts';
import { ItemEntry } from 'src/features/house/ItemEntry';

interface TotalCostTableProps {
  room: HouseRoomDetail;
  startLevel: number;
  endLevel: number;
}

export function TotalCostTable({ room, startLevel, endLevel }: TotalCostTableProps) {
  return (
    <table className="table-zebra table">
      <thead>
        <tr>
          <th>Item</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(getHouseCosts({ startLevel, endLevel, roomHrid: room.hrid }))
          .sort((a, b) => {
            const indexA = clientData.itemDetailMap[a[0] as ItemHrid].sortIndex;
            const indexB = clientData.itemDetailMap[b[0] as ItemHrid].sortIndex;
            return indexA - indexB;
          })
          .map((entry) => {
            const [itemHrid, amount] = entry as [ItemHrid, number];
            return (
              <ItemEntry
                key={`${room.hrid}-${itemHrid}-${amount}`}
                itemHrid={itemHrid}
                count={amount}
              />
            );
          })}
      </tbody>
    </table>
  );
}
