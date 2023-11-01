import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HouseRoomHrid } from 'src/core/hrid/HouseRoomHrid';
import { RootState } from 'src/store/store';

export type HouseState = Record<HouseRoomHrid, number>;

export const houseInitialState: HouseState = {
  '/house_rooms/archery_range': 0,
  '/house_rooms/armory': 0,
  '/house_rooms/brewery': 0,
  '/house_rooms/dairy_barn': 0,
  '/house_rooms/dining_room': 0,
  '/house_rooms/dojo': 0,
  '/house_rooms/forge': 0,
  '/house_rooms/garden': 0,
  '/house_rooms/gym': 0,
  '/house_rooms/kitchen': 0,
  '/house_rooms/laboratory': 0,
  '/house_rooms/library': 0,
  '/house_rooms/log_shed': 0,
  '/house_rooms/mystical_study': 0,
  '/house_rooms/sewing_parlor': 0,
  '/house_rooms/workshop': 0
};

interface SetRoomLevelPayload {
  houseRoomHrid: HouseRoomHrid;
  level: number;
}

export const houseSlice = createSlice({
  name: 'house',
  initialState: houseInitialState,
  reducers: {
    setRoomLevel: (state, action: PayloadAction<SetRoomLevelPayload>) => {
      const { payload } = action;
      state[payload.houseRoomHrid] = payload.level;
    }
  }
});

export const { setRoomLevel } = houseSlice.actions;

export const selectHouse = (state: RootState) => state.house;
