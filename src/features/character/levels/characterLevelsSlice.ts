import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NonCombatSkillHrid } from 'src/core/skills/NonCombatSkillHrid';
import { RootState } from 'src/store/store';

export type CharacterLevelState = Record<NonCombatSkillHrid, number>;

export const characterLevelsInitialState: CharacterLevelState = {
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

export const characterLevelsSlice = createSlice({
  name: 'characterLevel',
  initialState: characterLevelsInitialState,
  reducers: {
    setLevel: (state, action: PayloadAction<SetLevelPayload>) => {
      const { payload } = action;
      state[payload.skillHrid] = payload.value;
    }
  }
});

export const { setLevel } = characterLevelsSlice.actions;

export const selectCharacterLevels = (state: RootState) => state.characterLevels;
