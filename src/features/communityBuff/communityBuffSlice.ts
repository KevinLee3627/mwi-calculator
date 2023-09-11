import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CommunityBuffTypeHrid } from 'src/core/hrid/CommunityBuffTypeHrid';
import { RootState } from 'src/store/store';

export type CommunityBuffState = Record<CommunityBuffTypeHrid, number>;

export const communityBuffInitialState: CommunityBuffState = {
  '/community_buff_types/experience': 0,
  '/community_buff_types/gathering_quantity': 0,
  '/community_buff_types/production_efficiency': 0,
  '/community_buff_types/enhancing_speed': 0,
  '/community_buff_types/combat_drop_quantity': 0
};

interface SetCommunityBuffPayload {
  buffHrid: CommunityBuffTypeHrid;
  level: number;
}

export const communityBuffSlice = createSlice({
  name: 'communityBuff',
  initialState: communityBuffInitialState,
  reducers: {
    setBuffLevel: (state, action: PayloadAction<SetCommunityBuffPayload>) => {
      const { payload } = action;
      state[payload.buffHrid] = payload.level;
    }
  }
});

export const { setBuffLevel } = communityBuffSlice.actions;

export const selectCommunityBuffState = (state: RootState) => state.communityBuff;
