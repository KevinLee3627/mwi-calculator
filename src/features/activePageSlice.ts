import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NonCombatSkillHrid } from 'src/core/skills/NonCombatSkillHrid';
import { RootState } from 'src/store/store';

export type ActivePageId = NonCombatSkillHrid | '/page/houses';

export interface ActivePageState {
  activePage: ActivePageId;
}

export const activePageInitialState: ActivePageState = {
  activePage: '/skills/milking'
};

interface SetActivePagePayload {
  pageId: ActivePageId;
}

export const activePageSlice = createSlice({
  name: 'activePage',
  initialState: activePageInitialState,
  reducers: {
    setActivePage: (state, action: PayloadAction<SetActivePagePayload>) => {
      const { payload } = action;
      return { activePage: payload.pageId };
    }
  }
});

export const { setActivePage } = activePageSlice.actions;

export const selectActivePage = (state: RootState) => state.activePage.activePage;
