import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SkillHrid } from 'src/core/hrid/SkillHrid';
import { RootState } from 'src/store/store';

export type CharacterLevelState = Record<SkillHrid, number>;

export const characterLevelInitialState: CharacterLevelState = {
  '/skills/brewing': 0,
  '/skills/cheesesmithing': 0,
  '/skills/cooking': 0,
  '/skills/crafting': 0,
  '/skills/enhancing': 0,
  '/skills/foraging': 0,
  '/skills/milking': 0,
  '/skills/tailoring': 0,
  '/skills/woodcutting': 0,
  '/skills/attack': 0,
  '/skills/defense': 0,
  '/skills/intelligence': 0,
  '/skills/magic': 0,
  '/skills/power': 0,
  '/skills/ranged': 0,
  '/skills/stamina': 0,
  '/skills/total_level': 0
};

interface SetLevelPayload {
  skillHrid: SkillHrid;
  value: number;
}

export const characterLevelSlice = createSlice({
  name: 'characterLevel',
  initialState: characterLevelInitialState,
  reducers: {
    setLevel: (state, action: PayloadAction<SetLevelPayload>) => {
      const { payload } = action;
      state[payload.skillHrid] = payload.value;
    }
  }
});

export const { setLevel } = characterLevelSlice.actions;

export const selectCharacterLevel = (state: RootState) => state.characterLevel;
