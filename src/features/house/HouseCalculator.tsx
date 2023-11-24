import { useState } from 'react';
import { Select } from 'src/components/Select';
import { clientData } from 'src/core/clientData';
import { HouseRoomDetail } from 'src/core/house/HouseRoomDetail';

const roomDetails = clientData.houseRoomDetailMap;

export function HouseCalculator() {
  const [selectedRoom, setSelectedRoom] = useState<HouseRoomDetail>(
    roomDetails['/house_rooms/dairy_barn']
  );
  return (
    <div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Room</span>
        </label>
        <Select
          options={Object.values(roomDetails).map((room) => ({
            label: room.name,
            value: room
          }))}
          value={{
            label: selectedRoom.name,
            value: selectedRoom
          }}
          placeholder="test"
          onChange={(selected) => {
            if (selected == null) {
              setSelectedRoom(roomDetails['/house_rooms/dairy_barn']);
            } else {
              setSelectedRoom(selected.value);
            }
          }}
          isClearable
        />
      </div>
    </div>
  );
}
