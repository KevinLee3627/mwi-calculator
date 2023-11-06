import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NonCombatSkillHrid } from 'src/core/skills/NonCombatSkillHrid';
import { RootState } from 'src/store/store';

export interface CurrentXpState {
  '/skills/milking': number;
  '/skills/foraging': number;
  '/skills/woodcutting': number;
  '/skills/cheesesmithing': number;
  '/skills/crafting': number;
  '/skills/tailoring': number;
  '/skills/cooking': number;
  '/skills/brewing': number;
  '/skills/enhancing': number;
}

export const currentXpInitialState: CurrentXpState = {
  '/skills/milking': 0,
  '/skills/foraging': 0,
  '/skills/woodcutting': 0,
  '/skills/cheesesmithing': 0,
  '/skills/crafting': 0,
  '/skills/tailoring': 0,
  '/skills/cooking': 0,
  '/skills/brewing': 0,
  '/skills/enhancing': 0
};

interface SetTargetLevel {
  skillHrid: NonCombatSkillHrid;
  xp: number;
}

export const currentXpSlice = createSlice({
  name: 'currentXp',
  initialState: currentXpInitialState,
  reducers: {
    setSkillXp: (state, action: PayloadAction<SetTargetLevel>) => {
      const { payload } = action;
      state[payload.skillHrid] = payload.xp;
    }
  }
});

export const { setSkillXp } = currentXpSlice.actions;

export const selectCurrentXp = (state: RootState) => state.currentXp;
