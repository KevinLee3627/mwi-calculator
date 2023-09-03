import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NonCombatActionTypeHrid } from 'src/core/actions/NonCombatActionTypeHrid';
import { ItemDetail } from 'src/core/items/ItemDetail';
import { RootState } from 'src/store/store';

export type SkillDrinksState = Record<NonCombatActionTypeHrid, ItemDetail[] | null>;

export const skillDrinksInitialState: SkillDrinksState = {
  '/action_types/milking': null,
  '/action_types/foraging': null,
  '/action_types/woodcutting': null,
  '/action_types/cheesesmithing': null,
  '/action_types/crafting': null,
  '/action_types/tailoring': null,
  '/action_types/cooking': null,
  '/action_types/brewing': null,
  '/action_types/enhancing': null
};

export interface SetDrinksPayload {
  actionTypeHrid: NonCombatActionTypeHrid;
  drinks: ItemDetail[];
}

export const skillDrinksSlice = createSlice({
  name: 'skillDrinks',
  initialState: skillDrinksInitialState,
  reducers: {
    setSkillDrinks: (state, action: PayloadAction<SetDrinksPayload>) => {
      const { payload } = action;
      state[payload.actionTypeHrid] = payload.drinks;
    }
  }
});

export const { setSkillDrinks } = skillDrinksSlice.actions;

export const selectSkillDrinks = (state: RootState) => state.skillDrinks;
