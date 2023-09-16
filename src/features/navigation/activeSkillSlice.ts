import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NonCombatSkillHrid } from 'src/core/skills/NonCombatSkillHrid';
import { RootState } from 'src/store/store';

export type ActiveSkillState = Record<NonCombatSkillHrid, boolean>;

export const activeSkillInitialState: ActiveSkillState = {
  '/skills/milking': true,
  '/skills/foraging': false,
  '/skills/woodcutting': false,
  '/skills/cheesesmithing': false,
  '/skills/crafting': false,
  '/skills/tailoring': false,
  '/skills/cooking': false,
  '/skills/brewing': false,
  '/skills/enhancing': false
};

interface SetActiveSkillPayload {
  skillHrid: NonCombatSkillHrid;
}

export const activeSkillSlice = createSlice({
  name: 'activeSkill',
  initialState: activeSkillInitialState,
  reducers: {
    setActiveSkill: (state, action: PayloadAction<SetActiveSkillPayload>) => {
      const { payload } = action;
      return { ...activeSkillInitialState, [payload.skillHrid]: true };
    }
  }
});

export const { setActiveSkill } = activeSkillSlice.actions;

export const selectActiveSkillState = (state: RootState) => state.activeSkill;
