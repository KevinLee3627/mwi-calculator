import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NonCombatSkillHrid } from 'src/core/skills/NonCombatSkillHrid';
import { RootState } from 'src/store/store';

export interface ActiveSkillState {
  activeSkill: NonCombatSkillHrid;
}

// export const activeSkillInitialState: ActiveSkillState = {
//   '/skills/milking': false,
//   '/skills/foraging': false,
//   '/skills/woodcutting': false,
//   '/skills/cheesesmithing': false,
//   '/skills/crafting': false,
//   '/skills/tailoring': false,
//   '/skills/cooking': false,
//   '/skills/brewing': false,
//   '/skills/enhancing': false
// };

export const activeSkillInitialState: ActiveSkillState = {
  activeSkill: '/skills/milking'
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
      return { activeSkill: payload.skillHrid };
    }
  }
});

export const { setActiveSkill } = activeSkillSlice.actions;

export const selectActiveSkillState = (state: RootState) => state.activeSkill;
