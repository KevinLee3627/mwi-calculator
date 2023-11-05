import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NonCombatSkillHrid } from 'src/core/skills/NonCombatSkillHrid';
import { RootState } from 'src/store/store';

export interface TargetLevelsState {
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

export const targetLevelsInitialState: TargetLevelsState = {
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
  level: number;
}

export const targetLevelsSlice = createSlice({
  name: 'targetLevels',
  initialState: targetLevelsInitialState,
  reducers: {
    setTargetLevel: (state, action: PayloadAction<SetTargetLevel>) => {
      const { payload } = action;
      state[payload.skillHrid] = payload.level;
    }
  }
});

export const { setTargetLevel } = targetLevelsSlice.actions;

export const selectTargetLevels = (state: RootState) => state.targetLevels;
