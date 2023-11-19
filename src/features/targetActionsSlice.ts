import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NonCombatSkillHrid } from 'src/core/skills/NonCombatSkillHrid';
import { RootState } from 'src/store/store';

export interface TargetActionsState {
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

export const targetActionsInitialState: TargetActionsState = {
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

interface SetTargetAction {
  skillHrid: NonCombatSkillHrid;
  num: number;
}

export const targetActionsSlice = createSlice({
  name: 'targetActions',
  initialState: targetActionsInitialState,
  reducers: {
    setTargetAction: (state, action: PayloadAction<SetTargetAction>) => {
      const { payload } = action;
      state[payload.skillHrid] = payload.num;
    }
  }
});

export const { setTargetAction } = targetActionsSlice.actions;

export const selectTargetActions = (state: RootState) => state.targetActions;
