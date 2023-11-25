import { HouseRoomDetail } from 'src/core/house/HouseRoomDetail';
import { ItemEntry } from 'src/features/house/ItemEntry';

interface LevelByLevelCostTableProps {
  room: HouseRoomDetail;
  startLevel: number;
  endLevel: number;
}

export function LevelByLevelCostTable({
  room,
  startLevel,
  endLevel
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
              {costArr.map((cost) => (
                <ItemEntry
                  key={`levelByLevel-${room.hrid}-${cost.itemHrid}`}
                  itemHrid={cost.itemHrid}
                  count={cost.count}
                />
              ))}
            </tbody>
          </div>
        </div>
      );
    });
}
