/* eslint-disable tailwindcss/no-custom-classname */
import { useState } from 'react';
import { ItemIcon } from 'src/components/ItemIcon';
import { Select } from 'src/components/Select';
import { SkillIcon } from 'src/components/SkillIcon';
import { clientData } from 'src/core/clientData';
import { HouseRoomDetail } from 'src/core/house/HouseRoomDetail';
import { ItemHrid } from 'src/core/hrid/ItemHrid';
import { getHouseCosts } from 'src/features/house/getHouseCosts';
import { useStats } from 'src/hooks/useStats';
import { formatNumber } from 'src/util/formatNumber';

const roomDetailMap = clientData.houseRoomDetailMap;

export function HouseCalculator() {
  const { house } = useStats();

  const [selectedRoom, setSelectedRoom] = useState<HouseRoomDetail>(
    roomDetailMap['/house_rooms/dairy_barn']
  );
  const [startLevel, setStartLevel] = useState(house[selectedRoom.hrid]);
  const [endLevel, setEndLevel] = useState(8);
  const [activeTab, setActiveTab] = useState('total');

  return (
    <div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Room</span>
        </label>
        <Select
          options={Object.values(roomDetailMap)
            .sort((a, b) => a.sortIndex - b.sortIndex)
            .map((room) => ({
              label: room.name,
              value: room
            }))}
          value={{ label: selectedRoom.name, value: selectedRoom }}
          placeholder="test"
          onChange={(selected) => {
            if (selected == null) {
              setSelectedRoom(roomDetailMap['/house_rooms/dairy_barn']);
            } else {
              setSelectedRoom(selected.value);
            }
          }}
          formatOptionLabel={(data) => {
            return (
              <div className="flex items-center gap-2">
                <SkillIcon skillHrid={data.value.skillHrid} />
                {data.value.name}
              </div>
            );
          }}
          isClearable
        />
      </div>
      <div className="flex gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Start Level</span>
          </label>
          <input
            type="number"
            value={startLevel}
            min={0}
            max={7}
            className="input-bordered input-primary input"
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              setStartLevel(value);
            }}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">End Level</span>
          </label>
          <input
            type="number"
            value={endLevel}
            min={1}
            max={8}
            className="input-bordered input-primary input"
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              setEndLevel(value);
            }}
          />
        </div>
      </div>
      {/* tailwindcss/classnames-order */}
      <div role="tablist" className="tabs my-4">
        <a
          role="tab"
          className={`tab-bordered tab ${activeTab === 'total' && 'tab-active'}`}
          onClick={() => setActiveTab('total')}
        >
          Total Costs
        </a>
        <a
          role="tab"
          className={`tab-bordered tab ${activeTab === 'levelByLevel' && 'tab-active'}`}
          onClick={() => setActiveTab('levelByLevel')}
        >
          Level-by-Level Costs
        </a>
      </div>
      <div>
        {activeTab === 'total' && (
          <table className="table-zebra table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(
                getHouseCosts({ startLevel, endLevel, roomHrid: selectedRoom.hrid })
              )
                .sort((a, b) => {
                  const indexA = clientData.itemDetailMap[a[0] as ItemHrid].sortIndex;
                  const indexB = clientData.itemDetailMap[b[0] as ItemHrid].sortIndex;
                  return indexA - indexB;
                })
                .map((entry) => {
                  const [itemHrid, amount] = entry as [ItemHrid, number];
                  return (
                    <ItemEntry
                      key={`${selectedRoom.hrid}-${itemHrid}-${amount}`}
                      itemHrid={itemHrid}
                      count={amount}
                    />
                  );
                })}
            </tbody>
          </table>
        )}
        {activeTab === 'levelByLevel' &&
          Object.entries(selectedRoom.upgradeCostsMap)
            .filter((entry) => {
              const [levelStr] = entry;
              const level = parseInt(levelStr, 10);
              return level > startLevel && level <= endLevel;
            })
            .map((entry) => {
              const [levelStr, costArr] = entry;
              const level = parseInt(levelStr, 10);

              return (
                <div key={`${selectedRoom.hrid}-level-${levelStr}`} className="mb-4">
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
                          key={`levelByLevel-${selectedRoom.hrid}-${cost.itemHrid}`}
                          itemHrid={cost.itemHrid}
                          count={cost.count}
                        />
                      ))}
                    </tbody>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
}

interface ItemEntryProps {
  itemHrid: ItemHrid;
  count: number;
}
function ItemEntry({ itemHrid, count }: ItemEntryProps) {
  const name = clientData.itemDetailMap[itemHrid].name;
  return (
    <tr>
      <td>
        <ItemIcon itemHrid={itemHrid} />
        <span className="ml-2">{name}</span>
      </td>
      <td>{formatNumber(count)}</td>
    </tr>
  );
}
