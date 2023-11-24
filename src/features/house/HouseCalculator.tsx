import { useState } from 'react';
import { Select } from 'src/components/Select';
import { SkillIcon } from 'src/components/SkillIcon';
import { clientData } from 'src/core/clientData';
import { HouseRoomDetail } from 'src/core/house/HouseRoomDetail';

const roomDetailMap = clientData.houseRoomDetailMap;

export function HouseCalculator() {
  const [selectedRoom, setSelectedRoom] = useState<HouseRoomDetail>(
    roomDetailMap['/house_rooms/dairy_barn']
  );
  return (
    <div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Room</span>
        </label>
        <Select
          options={Object.values(roomDetailMap).map((room) => ({
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
    </div>
  );
}
