/* eslint-disable tailwindcss/no-custom-classname */
import { useState } from 'react';
import { Select } from 'src/components/Select';
import { SkillIcon } from 'src/components/SkillIcon';
import { clientData } from 'src/core/clientData';
import { HouseRoomDetail } from 'src/core/house/HouseRoomDetail';
import { HouseRoomHrid } from 'src/core/hrid/HouseRoomHrid';
import { ItemHrid } from 'src/core/hrid/ItemHrid';
import { range } from 'src/util/range';

const roomDetailMap = clientData.houseRoomDetailMap;

export function HouseCalculator() {
  const [selectedRoom, setSelectedRoom] = useState<HouseRoomDetail>(
    roomDetailMap['/house_rooms/dairy_barn']
  );
  const [startLevel, setStartLevel] = useState(0);
  const [endLevel, setEndLevel] = useState(8);
  const [activeTab, setActiveTab] = useState('total');

  const totalCosts = Object.values(selectedRoom.upgradeCostsMap).reduce<
    Record<string, number>
  >((acc, costs, i) => {
    costs.forEach((cost) => {
      if (acc[cost.itemHrid] == null) {
        acc[cost.itemHrid] = 0;
      }
      acc[cost.itemHrid] += cost.count;
    });
    return acc;
  }, {}) as Record<ItemHrid, number>;

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
        <a
          role="tab"
          className={`tab-bordered tab ${activeTab === 'three' && 'tab-active'}`}
          onClick={() => setActiveTab('three')}
        >
          Tab 3
        </a>
      </div>
      <div>
        {activeTab === 'total' &&
          Object.entries(getCosts({ startLevel, endLevel, roomHrid: selectedRoom.hrid }))
            .sort((a, b) => {
              const indexA = clientData.itemDetailMap[a[0] as ItemHrid].sortIndex;
              const indexB = clientData.itemDetailMap[b[0] as ItemHrid].sortIndex;
              return indexA - indexB;
            })
            .map((entry) => {
              const [itemHrid, amount] = entry as [ItemHrid, number];
              return (
                <div key={`${selectedRoom.hrid}-${itemHrid}-${amount}`}>
                  {itemHrid} - {amount}
                </div>
              );
            })}
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
                <div key={`${selectedRoom.hrid}-level-${levelStr}`}>
                  <p>
                    Level {level - 1} --{'>'} {level}
                  </p>
                  <div>
                    {costArr.map((cost) => {
                      return (
                        <div key={`levelByLevel-${selectedRoom.hrid}-${cost.itemHrid}`}>
                          {cost.itemHrid} ({cost.count})
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
}

interface GetCostsParams {
  startLevel: number;
  endLevel: number;
  roomHrid: HouseRoomHrid;
}
function getCosts({ startLevel, endLevel, roomHrid }: GetCostsParams) {
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
