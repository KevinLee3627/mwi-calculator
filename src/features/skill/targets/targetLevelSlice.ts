import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NonCombatSkillHrid } from 'src/core/skills/NonCombatSkillHrid';
import { RootState } from 'src/store/store';

export type TargetLevelState = Record<NonCombatSkillHrid, number | null>;

export const targetLevelInitialState: TargetLevelState = {
  '/skills/milking': null,
  '/skills/foraging': null,
  '/skills/woodcutting': null,
  '/skills/cheesesmithing': null,
  '/skills/crafting': null,
  '/skills/tailoring': null,
  '/skills/cooking': null,
  '/skills/brewing': null,
  '/skills/enhancing': null
};

export interface SetTargetLevelPayload {
  nonCombatSkillHrid: NonCombatSkillHrid;
  level: number;
}

export const targetLevelSlice = createSlice({
  name: 'targetLevels',
  initialState: targetLevelInitialState,
  reducers: {
    setTargetLevel: (state, action: PayloadAction<SetTargetLevelPayload>) => {
      const { payload } = action;
      state[payload.nonCombatSkillHrid] = payload.level;
    }
  }
});

export const { setTargetLevel } = targetLevelSlice.actions;

export const selectTargetLevel = (state: RootState) => state.targetLevel;
