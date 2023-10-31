import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NonCombatSkillHrid } from 'src/old/core/skills/NonCombatSkillHrid';
import { RootState } from 'src/old/store/store';

export type CharacterLevelState = Record<NonCombatSkillHrid, number>;

export const characterLevelInitialState: CharacterLevelState = {
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

interface SetLevelPayload {
  skillHrid: NonCombatSkillHrid;
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
