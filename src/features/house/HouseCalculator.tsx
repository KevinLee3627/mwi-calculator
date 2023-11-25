/* eslint-disable tailwindcss/no-custom-classname */
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useEffect, useMemo, useState } from 'react';
import { Select } from 'src/components/Select';
import { SkillIcon } from 'src/components/SkillIcon';
import { clientData } from 'src/core/clientData';
import { HouseRoomDetail } from 'src/core/house/HouseRoomDetail';
import { ItemHrid } from 'src/core/hrid/ItemHrid';
import { LevelByLevelCostTable } from 'src/features/house/LevelByLevelCostTable';
import { TotalCostTable } from 'src/features/house/TotalCostTable';
import { Market } from 'src/features/market/Market';
import { useGetMarketDataQuery } from 'src/features/market/marketApi';
import { useStats } from 'src/hooks/useStats';

const roomDetailMap = clientData.houseRoomDetailMap;

export function HouseCalculator() {
  const { house } = useStats();

  const [priceOverrides, setPriceOverrides] = useState<Partial<Record<ItemHrid, number>>>(
    {}
  );

  const [selectedRoom, setSelectedRoom] = useState<HouseRoomDetail>(
    roomDetailMap['/house_rooms/dairy_barn']
  );
  const [startLevel, setStartLevel] = useState(house[selectedRoom.hrid]);
  const [endLevel, setEndLevel] = useState(8);
  const [activeTab, setActiveTab] = useState('total');

  const {
    data: marketData,
    error,
    isLoading
  } = useGetMarketDataQuery('', {
    pollingInterval: 1000 * 60 * 30
  });

  const market = useMemo(() => {
    if (isLoading || error || marketData == null) return null;
    else return new Market(marketData.market);
  }, [marketData, isLoading, error]);

  useEffect(() => {
    setStartLevel(house[selectedRoom.hrid]);
  }, [selectedRoom, house]);

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
        {(market == null || marketData == null || error) && (
          <div role="alert" className="alert alert-warning">
            <ExclamationTriangleIcon className="h-6 w-6" />
            <span>
              Market data could not be retrieved - costs are based on vendor prices (but
              can be overriden){' '}
            </span>
          </div>
        )}
        {activeTab === 'total' && (
          <TotalCostTable
            room={selectedRoom}
            startLevel={startLevel}
            endLevel={endLevel}
            market={market}
            priceOverrides={priceOverrides}
            setPriceOverrides={setPriceOverrides}
          />
        )}
        {activeTab === 'levelByLevel' && (
          <LevelByLevelCostTable
            room={selectedRoom}
            startLevel={startLevel}
            endLevel={endLevel}
            market={market}
            priceOverrides={priceOverrides}
            setPriceOverrides={setPriceOverrides}
          />
        )}
      </div>
    </div>
  );
}
